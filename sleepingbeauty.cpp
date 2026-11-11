#include<iostream>
#include <vector>
#include <algorithm>

using namespace std;
int main(){
  vector<bool>sleepingBeauty(100, false); //heads or tails?
  for(int i = 0; i < 100; i++){
    if(i < 50){
      sleepingBeauty[i] = true;
    }
  }


  int monday = 0;
  int tuesday = 0;
  for(int i = 0; i < 100; i++){
    if(sleepingBeauty[i]) //heads is monday  only
    {
      cout << " shit "<< endl;
      monday++; //
    }else{//tails is monday and then tuesday
      cout << " monday  "<< endl;
      monday++;
      tuesday++;
      cout << " tuesday "<< endl;
      // add ratio...
    }
  }
  cout << heads * 1.0 / (heads + tails) << endl;

}