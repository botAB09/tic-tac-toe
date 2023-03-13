#include <iostream>
#include <vector> 
using namespace std;
void draw(vector<vector<int>> a){
    vector<vector<char>> board(3,vector<char>(3,'_'));

    for(int i=0;i<3;i++){
        for(int j=0;j<3;j++){
            if(a[i][j]==1){
                board[i][j]='X';
            }
            else if(a[i][j]==0){
                board[i][j]='O';
            }
            else{
                board[i][j]='_';
            }
        }
    }

    for(auto i:board){
        for(auto j:i){
            cout<<j<<' ';
        }
        cout<<endl;
    }
}
int check(vector<vector<int>> a){
    //diagonal check
    int diag = 0;
    for(int i=0;i<a.size();i++){
        if(a[i][i]==1){
            diag = 1;
        }
        else{
            diag = 0;
            break;
        }
    }
    if( diag ){
        cout<<"Player 1 Won !!\n";
        return 0 ;
    }
    for(int i=0;i<a.size();i++){
        if(a[i][i]==0){
            diag = 1;
        }
        else{
            diag = 0;
            break;
        }
    }
    if( diag ){
        cout<<"Player 2 Won !!\n";
        return 0 ;
    }

    //row check 
    int row = 0;
    for(int i=0;i<a.size();i++){
        for(int j=0;j<a.size();j++){
            if(a[i][j]==1){
                row = 1;
            }
            else{
                row = 0 ; 
                break;
            }
        }
        if(row){
            cout<<"Player 1 Won !!\n";
            return 0;
        }
    }

    for(int i=0;i<a.size();i++){
        for(int j=0;j<a.size();j++){
            if(a[i][j]==0){
                row = 1;
            }
            else{
                row = 0 ; 
                break;
            }
        }
        if(row){
            cout<<"Player 2 Won !!\n";
            return 0;
        }
    }    
    //column check
    int col = 0;
    for(int i=0;i<a.size();i++){
        for(int j=0;j<a.size();j++){
            if(a[j][i]==1){
                col = 1;
            }
            else{
                col = 0 ; 
                break;
            }
        }
        if(col){
            cout<<"Player 1 Won !!\n";
            return 0;
        }
    }

    for(int i=0;i<a.size();i++){
        for(int j=0;j<a.size();j++){
            if(a[j][i]==0){
                col = 1;
            }
            else{
                col = 0 ; 
                break;
            }
        }
        if(col){
            cout<<"Player 2 Won !!\n";
            return 0;
        }
    }  
    return 1;
}
void play(){
    vector<vector<int>> a ( 3, vector<int>(3,-1));
    int flag=1 ;
    do{
        int x1,x2;
        int y1,y2;

        cout<<"Player 1\n";
        cout<<"Enter the Position where you want to enter your choice\n";
        cin>>x1>>y1;
        a[x1][y1]=1;
        flag = check(a);
        if(flag == 0 ){
            break;
        }
        draw(a);
        cout<<"Player 2\n";
        cout<<"Enter the Position where you want to enter your choice\n";
        cin>>x2>>y2;
        a[x2][y2]=0;
        draw(a);
        flag = check(a);
    }while(flag != 0);
    return ;
}

int main(){
    play();
    return 0;
}