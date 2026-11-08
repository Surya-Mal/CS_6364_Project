//6 parts 
window.onload = function() {
	//1. Initial states
	var num;
	var box;
	var ctx;
	var turn = 1; //AI2 is on odd turns, and AI is on even turns
	var filled;
	var symbol;
	var winner;
	var gameOver = false;
	var ai2 = 'X'; //This instead of being human will not be the 2nd AI
	var ai = 'O';
	var result = {};
	filled = new Array();
	symbol = new Array();
	winner = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	for(var i=0; i<9; i++) {
		filled[i] = false;
		symbol[i] = '';
	}
	
//#################		This part covers the Task 3 specific parts (2 changes above worth looking at for understanding)		######################
	
//Clears the tick tack toe board
	function clearBoard(){
		for(var i = 1; i <= 9; i++){
			canvasBox = document.getElementById("canvas" + i);
			canvasBox.getContext("2d").clearRect(0, 0, canvasBox.width, canvasBox.height);
			canvasBox.style.backgroundColor = "lightyellow";
		}
	}

	//Clears the game
	function clearGame(){
		//Once the game is done clear the lists
		for(var j=0; j<9; j++) {
			filled[j] = false;
			symbol[j] = '';
		}
		turn = 1;
		gameOver = false;	
	}

	//newGame - event + function
	var n = document.getElementById("new");
	n.addEventListener("click",newGame);
	
	var numGames; //This is the number of games chosen by the user for the games the AI need to play
	var gamesWon; //This is the number of games AI1 won
	var gamesDrawn; //The number of games that were draws

	var userInput = document.getElementById("numGames");
	var inputSubmit = document.getElementById("submitGames");

	inputSubmit.addEventListener("click", () => {
		if(userInput.value >= 1 && userInput.value <= 10){
			numGames = parseInt(userInput.value);
			gamesWon = 0;
			gamesDrawn = 0;
			clearBoard();
			
			for(var i = 0; i < numGames; i++){
				playAI(ai2);
				clearGame();
			}

			//This displays the final results of the game from the perspective of AI1 or ai
			document.getElementById("result").innerText = "Games won by AI (O): " + gamesWon + ", Games lost by AI (O): " + (numGames - (gamesDrawn + gamesWon)) + ", Games Drawn: " + gamesDrawn;
		}
		else{
			console.log("ERROR: Not between 1 and 10");
		}
	});

//#################		End of this part of the Task 3		######################

	//Reload page
	function newGame() {
		document.location.reload();
	}
	
	//Canvas click + retrieving the box's number 
	//canvas click event

	/* This part is the human part, not needed here
	document.getElementById("tic").addEventListener("click",function(e){
		boxClick(e.target.id);
	});
	*/

	//2.Drawing X's and O's
	//Draw X
	function drawX(next) {
		box.style.backgroundColor = "#fb5181";
		ctx.beginPath();
		ctx.moveTo(15,15);
		ctx.lineTo(85,85);
		ctx.moveTo(85,15);
		ctx.lineTo(15,85);
		ctx.lineWidth = 21;
		ctx.lineCap = "round";
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.closePath();
		
		symbol[next] = ai2; // ################## This was modified to account for ai2, and uses the next parameter like ai, 'X'
	}
	
	//Drawing O
	function drawO(next) {
		box.style.backgroundColor = "#93f273";
		ctx.beginPath();
		ctx.arc(50,50,35,0,2*Math.PI);
		ctx.lineWidth = 20;
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.closePath();
		
		symbol[next] = ai; // 'O'
	}
	
	//3.Winner check function 
	function winnerCheck(symbol,player) {
		for(var j=0;j<winner.length;j++) {
			if((symbol[winner[j][0]] == player) && (symbol[winner[j][1]] == player) && (symbol[winner[j][2]] == player)) {
				return true;
			}
		}
		return false;
	}
	
	//4.Box click function - human playing
	function boxClick(numId) {
		box = document.getElementById(numId);
		ctx = box.getContext("2d");
		switch(numId) {
			case "canvas1": num = 1;
							break;
			case "canvas2": num = 2;
							break;
			case "canvas3": num = 3;
							break;
			case "canvas4": num = 4;
							break;
			case "canvas5": num = 5;
							break;
			case "canvas6": num = 6;
							break;
			case "canvas7": num = 7;
							break;
			case "canvas8": num = 8;
							break;
			case "canvas9": num = 9;
							break;
		}
		
		if(filled[num-1] === false) {
			if(gameOver === false) {
				if(turn%2 !== 0) {
					drawX();
					turn++;
					filled[num-1] = true;
					
					if(winnerCheck(symbol,symbol[num-1]) === true) {
						document.getElementById("result").innerText = "Player '" + symbol[num-1] + "' won!";
						gameOver = true;
						
					}
					
					if(turn > 9 && gameOver !== true) {
						document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
						return;
					}
					
					if(turn%2 == 0) {
						playAI();
					}
				}
			}
			else {
				alert("Game over. Please click the New Game button to start again");
			}
		}
		else {
			alert("This box was already filled. Please click on another one.")
		}
	}
	
	//5. Find the empty boxes
	function emptyBoxes(newSymbol) {
		var j = 0;
		var empty = [];
		for(var i=0; i<newSymbol.length; i++) {
			if(newSymbol[i] !== 'X' && newSymbol[i] !== 'O') {
				empty[j] = i;
				j++;
			}
		}
		return empty;
	}
	
	//6. Making the AI play - playAI() and minimax()
	//playAI()
	//#############################		This is last thing modified for task 3		###############################
	function playAI(whichAi) {
		//symbol = ['X','','O','O','','O','','X','X'], 'O'
		//nextMove = {id:4,score:10}
		var nextMove = miniMax(symbol,whichAi, -1000, 1000); //object that stores id of next move and score of the box for next move
		
		var nextId = "canvas" + (nextMove.id + 1);
		box = document.getElementById(nextId);
		ctx = box.getContext("2d");

		if(whichAi === 'X') { //Checks if its ai2's turn or if its ai's turn
			drawX(nextMove.id);
		}
		else{
			drawO(nextMove.id);
		}

		turn++;
		filled[nextMove.id] = true;

		//winner check - ai wins and draws, the return there is so they dont run on a completed board
		if(winnerCheck(symbol, whichAi)) {
			if(whichAi === ai){
				gamesWon += 1;
			}
			return;
		}
		else if(turn > 9) { //draw condition
			gamesDrawn += 1;
			return;
		}
		else{
			if(whichAi === ai2) {
				playAI(ai);
			}
			else{
				playAI(ai2);
			}
		}
		
	}
	
	//Minimax function 
	//For this example/explanation, AI - X, human - O
	//symbol = ['X','','O','X','','O','','X','X'], 'O' -> human
	//The max or the AI modifies to make as high as possible
	//The min or human modifies to make as low as possible
	function miniMax(newSymbol, player, alpha, beta) { 
		var empty = [];
		empty = emptyBoxes(newSymbol); //[]
		
		if(winnerCheck(newSymbol,ai2)) {
			return { score: -10 }; //human wins
		}
		else if(winnerCheck(newSymbol,ai)) {
			return { score: 10 }; //AI wins
		}
		else if(empty.length === 0) {
			if(winnerCheck(newSymbol,ai2)) {
				return { score: -10 };
			}
			else if(winnerCheck(newSymbol,ai)) {
				return { score : 10 };
			}
			return { score: 0 }; //game is draw
		}
		
		//if its not a terminal state
		//possible moves- their indices and score values
		var posMoves = []; 
		//[4] - Example
		for(var i=0; i<empty.length; i++) {
			//current move - index of current move,score
			var curMove = {};
			//generate the new board with the current move
			curMove.id = empty[i]; //4
			newSymbol[empty[i]] = player; //AI
			
			if(player === ai) {
				//result = [{id:4,score:-10}], 
				//curMove = {id:1,score:-10}
				result = miniMax(newSymbol, ai2, alpha, beta); //index and score
				curMove.score = result.score; //10

				if(curMove.score > alpha){
					alpha = curMove.score;
				}
			}
			else {
				//result = [{id:6, score:10}]
				//curMove = {id:6, score:10}
				result = miniMax(newSymbol, ai, alpha, beta);
				curMove.score = result.score; //-10
				//level 2 move 1 curMove = {id: 6, score: 10}
				//level 3 move 1 -> posMoves = [{id:4,score:10}]
				//level 2 move 1 -> posMoves = [{id:6, score:10}]

				if(curMove.score < beta){
					beta = curMove.score;
				}
			}
			
			//level 1 move 1 -> posMoves = [{id:4,score:-10},{id:6, score:10}]
			//level 0 -> posMoves = [{id:4,score:10},{id:6,score:10},{id:1,score:-10}]
			//empty:[1,4,6]
			newSymbol[empty[i]] = '';
			posMoves.push(curMove); //[{id: 1, score: -10}]

			//This checks to see if the tree can be pruned must happen after the fateful node that caused this has been pushed and the move is emptied
			if(beta <= alpha){
				break;
			}
			
		}
		
		//Calculate score of intermediate states - best move + score with respect to that player + return statement 
		var bestMove;
		//AI - max player (always) -> choose maximum value, human - min player -> choose minimum value
		
		if(player === ai) {
			//posMoves = [{id:4,score:10},{id:6,score:10},{id:1,score:-10}]
			var highestScore = -1000;
			for(var j=0; j<posMoves.length;j++) {
				if(posMoves[j].score > highestScore) {
					highestScore = posMoves[j].score;
					bestMove = j; //0
				}
			}
		}
		//posMoves = [{id:4,score:-10},{id:6, score:10}]
		else {
			var lowestScore = 1000;
			for(var j=0; j<posMoves.length;j++) {
				if(posMoves[j].score < lowestScore) {
					lowestScore = posMoves[j].score;
					bestMove = j;
				}
			}
		}
		return posMoves[bestMove]; 
		//posMoves[0] = {id:4,score:10}
	}
	

	
};
	
	
	
	
	
	
	
	
	
	
	
	