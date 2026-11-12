//6 parts 
window.onload = function() {
	//debug var
	var miniMaxCall = 0;

	//1. Initial states
	var num;
	var box;
	var ctx;
	var players = 3; //number of players
	var turn = 0; //AI[# % players] turn
	var filled;
	var symbol;
	var winner; //winning states/patterns
	var gameOver = false;
	//ais
	var ais = [];
	for(var i = 0; i < players; i++){
		ais.push(String.fromCharCode(65 + i)); //symbol for each ai
		console.log(ais);
	}
	// var ai2 = 'X'; //This instead of being human will not be the 2nd AI
	// var ai = 'O';
	//TASK5 switching to 0 and 1 instead -> will be able to reference symbol in ais[] array
	var ai2 = 0; //This instead of being human will not be the 2nd AI
	var ai = 1;
	var b = 4; // length of board, later will be used in task 5 to generate the winner's array
	var result = {};
	filled = new Array();
	symbol = new Array();
	//generate winners
	winner = [];
	for(var i = 0; i < b; i++){
		//first row
		row = [];
		//first col
		col = [];
		for(var j = 0; j < b; j++){
			row.push(i*b + j);
			col.push(j * b + i);
		}
		winner.push(row);
		winner.push(col);
	}
	//both diagonals
	diag1 = [];
	diag2 = [];
	for(var i = 0; i < b; i++){
		diag1.push(i + i * b);
		diag2.push((b - 1) * (i + 1));
	}
	winner.push(diag1);
	winner.push(diag2);

	//set board
	board = document.getElementById("tic");
	for(var i=0; i<b * b; i++) {
		//add new element
		canvasBox = document.createElement("canvas");
		canvasBox.id = "canvas" + (i + 1);
		canvasBox.width = 320/b - 2;
		canvasBox.height = 320/b - 2;
		canvasBox.style.backgroundColor = "lightyelllow";
		board.appendChild(canvasBox);
		if(i % b == b - 1){
			br = document.createElement("br");
			board.appendChild(br);
		}

		//set game state array
		filled[i] = false;
		symbol[i] = '';
	}
	
	//setBoard
	function setBoard(b){
		//var b = 4; // length of board, later will be used in task 5 to generate the winner's array
		var result = {};
		winner = [];
		filled = new Array();
		symbol = new Array();
		//generate winners
		for(var i = 0; i < b; i++){
			//first row
			row = [];
			//first col
			col = [];
			for(var j = 0; j < b; j++){
				row.push(i*b + j);
				col.push(j * b + i);
			}
			winner.push(row);
			winner.push(col);
		}
		//both diagonals
		diag1 = [];
		diag2 = [];
		for(var i = 0; i < b; i++){
			diag1.push(i + i * b);
			diag2.push((b - 1) * (i + 1));
		}
		winner.push(diag1);
		winner.push(diag2);

		//set board
		board = document.getElementById("tic");
		board.innerHTML= "";
		for(var i=0; i<b * b; i++) {
			//add new element
			canvasBox = document.createElement("canvas");
			canvasBox.id = "canvas" + (i + 1);
			canvasBox.width = 320/b - 2;
			canvasBox.height = 320/b - 2;
			canvasBox.style.backgroundColor = "lightyelllow";
			board.appendChild(canvasBox);
			if(i % b == b - 1){
				br = document.createElement("br");
				board.appendChild(br);
			}

			//set game state array
			filled[i] = false;
			symbol[i] = '';
		}
	}
	
	
//#################		This part covers the Task 3 specific parts (2 changes above worth looking at for understanding)		######################
	
//Clears the tick tack toe board
	function clearBoard(){
		for(var i = 1; i <= b*b; i++){
			canvasBox = document.getElementById("canvas" + i);
			canvasBox.getContext("2d").clearRect(0, 0, canvasBox.width, canvasBox.height);
			canvasBox.style.backgroundColor = "lightyellow";
		}
	}

	//Clears the game
	function clearGame(){
		//Once the game is done clear the lists
		for(var j=0; j< b * b; j++) {
			filled[j] = false;
			symbol[j] = '';
		}
		turn = 0; //change TURN
		gameOver = false;	
	}

	//newGame - event + function
	var n = document.getElementById("new");
	n.addEventListener("click",newGame);
	
	var numGames; //This is the number of games chosen by the user for the games the AI need to play
	var gamesWon; //This is the number of games AI1 won
	var gamesDrawn; //The number of games that were draws
	var gamesLost;
	
	// //set games trackers
	gamesWon = [];
	//gamesLost = []; //can be derived from totale gamespl ayed - gamesWon and Drawn
	for(var i = 0; i < players; i++){
		gamesWon.push(0);
	} 

	var userInput = document.getElementById("numGames");
	var userBoardInput = document.getElementById("boardSize");
	var inputSubmit = document.getElementById("submitGames");

	inputSubmit.addEventListener("click", () => {
		if(userBoardInput.value < 3 || userBoardInput.value > 10){
			console.log("needs to be between 3 & 10");
			return;
		}
		setBoard(userBoardInput.value);
		b = parseInt(userBoardInput.value);
		if(userInput.value >= 1 && userInput.value <= 10){
			numGames = parseInt(userInput.value);
			//gamesWon = 0;
			gamesDrawn = 0;
			clearBoard();
			
			for(var i = 0; i < numGames; i++){
				//playAI(ai2);
				playAI(0); //always start with first player, or maybe we can mix it up
				clearGame();
			}

			//This displays the final results of the game from the perspective of AI1 or ai
			//document.getElementById("result").innerText = "Games won by AI (O): " + gamesWon + ", Games lost by AI (O): " + (numGames - (gamesDrawn + gamesWon)) + ", Games Drawn: " + gamesDrawn;
			result = document.getElementById("result");//.innerText = "Games won by AI (O): " + gamesWon + ", Games lost by AI (O): " + (numGames - (gamesDrawn + gamesWon)) + ", Games Drawn: " + gamesDrawn;
			result.innerHTML = "";
			wins = document.createElement("div");
			draws = document.createElement("div");
			draws.innerText = "Draws: " + gamesDrawn;
			losses = document.createElement("div");
			totalWins = 0;
			for(var i = 0; i < players; i++){
				//wins div
				totalWins += gamesWon[i];
			}
			for(var i = 0; i < players; i++){
				//wins div
				win = document.createElement("div");
				win.innerText = "# of wins for AI" + i + ": " + gamesWon[i];
				wins.appendChild(win);
				//draws.innerText = gamesDrawn[i];
				loss = document.createElement("div");
				loss.innerText = "# of losses for AI" + i + ": " + (numGames - (gamesWon[i] + gamesDrawn));
				losses.appendChild(loss);
			}
			result.appendChild(wins);
			result.appendChild(draws);
			result.appendChild(losses);
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
	//GENERAL DRAW FUNCTION
	function draw(currSymbol, next){
		ctx.fillStyle = "black";
		ctx.font = 100/b + "px Arial";
 		ctx.fillText(currSymbol,140/b, 170/b);
		symbol[next] = currSymbol;
	}

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
		
		symbol[next] = ais[ai2]; // ################## This was modified to account for ai2, and uses the next parameter like ai, 'X'
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
			//general case
			winnerFound = true;
			for(var k = 0; k < winner[j].length; k++){
				if(symbol[winner[j][k]]!= player){
					winnerFound = false;
				}
			}
			if(winnerFound){
				//console.log("winner found");
				return true;
			}
			//base case vvv
			// if((symbol[winner[j][0]] == player) && (symbol[winner[j][1]] == player) && (symbol[winner[j][2]] == player)) {
			// 	return true;
			// }
		}
		//console.log("winner not found");
		return false;
	}
	
	//4.Box click function - human playing
	function boxClick(numId) {
		box = document.getElementById(numId);
		ctx = box.getContext("2d");
		num = parseInt(numId.slice(6));
		
		// switch(numId) {
		// 	case "canvas1": num = 1;
		// 					break;
		// 	case "canvas2": num = 2;
		// 					break;
		// 	case "canvas3": num = 3;
		// 					break;
		// 	case "canvas4": num = 4;
		// 					break;
		// 	case "canvas5": num = 5;
		// 					break;
		// 	case "canvas6": num = 6;
		// 					break;
		// 	case "canvas7": num = 7;
		// 					break;
		// 	case "canvas8": num = 8;
		// 					break;
		// 	case "canvas9": num = 9;
		// 					break;
		// }
		
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
					
					if(turn > b*b && gameOver !== true) {
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
	function emptyBoxes(newSymbol) { //new symbol is the array
		var j = 0;
		var empty = [];
		for(var i=0; i<newSymbol.length; i++) {
			
			// if(newSymbol[i] !== 'X' && newSymbol[i] !== 'O') { //used to be X and 0
			// 	empty[j] = i;
			// 	j++;
			// }
			//general case
			// symbolFound = false;
			// for(var k = 0; k < players; k++){
			// 	//console.log(empty.length);
			// 	//if(empty.length > 100) return empty; //TASK5 DEBUG
			// 	if(newSymbol[i] === ais[k]){
			// 		symbolFound = true;
			// 	}
			// }
			// if(!symbolFound){
			// 	empty[j] = i;
			// 	j++;
			// }
			//fast version
			if(newSymbol[i] === ''){
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
		var nextMove = miniMax(symbol,whichAi,Math.max(Math.min(10 - b,4),1)); //object that stores id of next move and score of the box for next move
		//RESCURSIVE FUNCTION

		//AI CHECK FOR missing object
		// if(nextMove.id === undefined){
		// 	return;
		// }

		var nextId = "canvas" + (nextMove.id + 1);
		box = document.getElementById(nextId);
		ctx = box.getContext("2d");

		//new general draw function!
		draw(ais[whichAi],nextMove.id);
		// if(whichAi === 'X') { //Checks if its ai2's turn or if its ai's turn
		// 	drawX(nextMove.id);
		// }
		// else{
		// 	drawO(nextMove.id);
		// }
		

		turn++;
		//KILL IF INFINITE LOOP
		// if(turn >100){
		// 	//console.log("oof");
		// 	return;
		// }
		filled[nextMove.id] = true;

		//winner check - ai wins and draws, the return there is so they dont run on a completed board
		if(winnerCheck(symbol, ais[whichAi])) {
			// if(whichAi === ai){
			// 	gamesWon += 1;
			// }

			//TASK5
			gamesWon[whichAi] += 1;
			return;
		}
		else if(turn >= b*b) { //draw condition
			gamesDrawn += 1; //TASK5 might keep this as aglobal var instead of player specific
			return;
		}
		else{ //next player will play
			// if(whichAi === ais[ai2]) { 
			// 	playAI(ais[ai]);
			// }
			// else{
			// 	playAI(ais[ai2]);
			// }
			newPlayer = (whichAi+ 1) % players;
			//console.log(newPlayer);
			playAI(newPlayer);
		}
		
	}

	//new evaluateBoard function that evluates the board and cuts early
function evaluateBoard(boardState) {
    var scores = Array(players).fill(0);

    for (var i = 0; i < winner.length; i++) {
        var counts = Array(players).fill(0);
        var blocked = Array(players).fill(false);

        for (var j = 0; j < winner[i].length; j++) {
            var cell = boardState[winner[i][j]];

            for (var p = 0; p < players; p++) {
                if (cell === ais[p]) {
                    counts[p]++;
                }
                else if (cell !== '') {
                    blocked[p] = true;
                }
            }
        }

        for (var p = 0; p < players; p++) {
            if (!blocked[p] && counts[p] > 0) {
                scores[p] += Math.pow(4, counts[p]);
            }
        }
    }

    return scores;
}
	
	//Minimax function 
	//For this example/explanation, AI - X, human - O
	//symbol = ['X','','O','X','','O','','X','X'], 'O' -> human
	//The max or the AI modifies to make as high as possible
	//The min or human modifies to make as low as possible
	// function miniMax(newSymbol, player, depth) { 
	// 	miniMaxCall += 1;
	// 	if(miniMaxCall >= 2000){
	// 		//console.log("wtf ");
	// 		return {scores: Array(players).fill(0)};
	// 	}
	// 	var empty = [];
	// 	//player = ais[player]; //collect the thing
	// 	empty = emptyBoxes(newSymbol); //[]
	// 	//console.log(empty);
		
	// 	//changing this requires winner check on all the bots, to return array of N values
	// 	//general
	// 	scores = Array(players).fill(0);
	// 	for(var i = 0; i < players; i++){
			
	// 		if(winnerCheck(newSymbol, ais[i])){ //player i wins
	// 			scores[i] = 10;
	// 			return {scores: scores};
	// 		}
	// 	}
	// 	if(empty.length === 0 || depth === 0){
	// 		return {scores: evaluateBoard(newSymbol)};
	// 	}
	// 	// if(winnerCheck(newSymbol,ais[ai2])) {
	// 	// 	return { score: -10 }; //human wins
	// 	// }
	// 	// else if(winnerCheck(newSymbol,ais[ai])) {
	// 	// 	return { score: 10 }; //AI wins
	// 	// }
	// 	// else if(empty.length === 0) {
	// 	// 	if(winnerCheck(newSymbol,ais[ai2])) {
	// 	// 		return { score: -10 };
	// 	// 	}
	// 	// 	else if(winnerCheck(newSymbol,ais[ai])) {
	// 	// 		return { score : 10 };
	// 	// 	}
	// 	// 	return { score: 0 }; //game is draw
	// 	// }
		
	// 	//if its not a terminal state
	// 	//possible moves- their indices and score values
	// 	var posMoves = []; 
	// 	var bestResult;
	// 	//var bestMove;
	// 	var bestScore;
	// 	//[4] - Example
	// 	for(var i=0; i<empty.length; i++) {
	// 		//current move - index of current move,score
	// 		var curMove = {};
	// 		//generate the new board with the current move
	// 		curMove.id = empty[i]; //4
	// 		newSymbol[empty[i]] = ais[player]; //AI
	// 		//general case, let next player move
	// 		result = miniMax(newSymbol, (player + 1)%players, depth - 1);
	// 		curMove.scores = result.scores;
	// 		// if(player === ai) {
	// 		// 	//result = [{id:4,score:-10}], 
	// 		// 	//curMove = {id:1,score:-10}

	// 		// 	//RECURSIVE
	// 		// 	result = miniMax(newSymbol, ai2, depth - 1); //index and score
	// 		// 	curMove.scores = result.scores; //10

	// 		// 	// if(curMove.score > alpha){
	// 		// 	// 	alpha = curMove.score;
	// 		// 	// }
	// 		// }
	// 		// else {
	// 		// 	//result = [{id:6, score:10}]
	// 		// 	//curMove = {id:6, score:10}
	// 		// 	result = miniMax(newSymbol, ai);
	// 		// 	curMove.score = result.score; //-10
	// 		// 	//level 2 move 1 curMove = {id: 6, score: 10}
	// 		// 	//level 3 move 1 -> posMoves = [{id:4,score:10}]
	// 		// 	//level 2 move 1 -> posMoves = [{id:6, score:10}]

	// 		// 	// if(curMove.score < beta){
	// 		// 	// 	beta = curMove.score;
	// 		// 	// }
	// 		// }
			
	// 		//level 1 move 1 -> posMoves = [{id:4,score:-10},{id:6, score:10}]
	// 		//level 0 -> posMoves = [{id:4,score:10},{id:6,score:10},{id:1,score:-10}]
	// 		//empty:[1,4,6]
	// 		newSymbol[empty[i]] = ''; //tru a different move, and push on the move calcualtion
	// 		posMoves.push(curMove); //[{id: 1, score: -10}]

	// 		//This checks to see if the tree can be pruned must happen after the fateful node that caused this has been pushed and the move is emptied
	// 		// if(beta <= alpha){
	// 		// 	break;
	// 		// }
			
	// 	}
		
		
	// 	//Calculate score of intermediate states - best move + score with respect to that player + return statement 
	// 	var bestMove;
	// 	//AI - max player (always) -> choose maximum value, human - min player -> choose minimum value
		
	// 	//GENERAL
	// 	var highestScore = -1000;
	// 	console.log(posMoves[j])
	// 	for(var j = 0; j < posMoves.length; j++){
	// 		if(posMoves[j].scores[player] > highestScore){
	// 			highestScore = posMoves[j].scores[player];
	// 			bestMove = j;
	// 		}
	// 	}

	// 	// if(player === ai) {
	// 	// 	//posMoves = [{id:4,score:10},{id:6,score:10},{id:1,score:-10}]
	// 	// 	var highestScore = -1000;
	// 	// 	for(var j=0; j<posMoves.length;j++) {
	// 	// 		if(posMoves[j].score > highestScore) {
	// 	// 			highestScore = posMoves[j].score;
	// 	// 			bestMove = j; //0
	// 	// 		}
	// 	// 	}
	// 	// }
	// 	// //posMoves = [{id:4,score:-10},{id:6, score:10}]
	// 	// else {
	// 	// 	var lowestScore = 1000;
	// 	// 	for(var j=0; j<posMoves.length;j++) {
	// 	// 		if(posMoves[j].score < lowestScore) {
	// 	// 			lowestScore = posMoves[j].score;
	// 	// 			bestMove = j;
	// 	// 		}
	// 	// 	}
	// 	// }
	// 	return posMoves[bestMove]; 
	// 	//posMoves[0] = {id:4,score:10}
	// }
	

function miniMax(newSymbol, player, depth) {
    miniMaxCall++;
		//depth = Math.max(1, depth);

    var empty = emptyBoxes(newSymbol);

    var scores = Array(players).fill(-2000);

    // Terminal state: someone won
    for (var i = 0; i < players; i++) {
        if (winnerCheck(newSymbol, ais[i])) {
            scores[i] = 10000;
            return { scores: scores, id: -1 };
        }
    }

    // Terminal state: draw or depth limit
    if (empty.length === 0 || depth === 0) {
        return {
            scores: evaluateBoard(newSymbol),
            id: -1
        };
    }

    var posMoves = [];

    for (var i = 0; i < empty.length; i++) {
        var curMove = {};

        curMove.id = empty[i]; //this is where the move is stored

        newSymbol[empty[i]] = ais[player];

        var result = miniMax(
            newSymbol,
            (player + 1) % players,
            depth - 1
        );

        curMove.scores = result.scores;

        newSymbol[empty[i]] = '';

        posMoves.push(curMove);
    }

    var bestMove;
    var highestScore = -Infinity;

    for (var j = 0; j < posMoves.length; j++) {
        if (posMoves[j].scores[player] > highestScore) {
            highestScore = posMoves[j].scores[player];
            bestMove = j;
        }
    }

    return posMoves[bestMove];
}

	
};
	
	
	
	
	
	
	
	
	
	
	
	