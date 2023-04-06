/**
 * new updated featue to be merged with websocket.util.js 
 */
const db = require('./db.utility');

class SOCKETUTIL{
    static opponent;
    static player = {};

    static createGame(socket){
        console.log(SOCKETUTIL.opponent);
        SOCKETUTIL.player[socket.id] = {
            symbol : 'X',
            opponent : SOCKETUTIL.opponent,
            socket : socket,
            username : '',
            turn : true
        }
        if(SOCKETUTIL.opponent){
            SOCKETUTIL.player[socket.id].symbol = 'O';
            SOCKETUTIL.player[socket.id].turn = false;
            SOCKETUTIL.player[SOCKETUTIL.opponent].opponent = socket.id;
            SOCKETUTIL.opponent = null;
        }
        else{
            SOCKETUTIL.opponent = socket.id;
        }
    }

    static getOpponent(socket){
        if(SOCKETUTIL.player[socket.id].opponent){
            return SOCKETUTIL.player[SOCKETUTIL.player[socket.id].opponent].socket;
        }
        return false;
    }

    static isWinner(gameBoard){
        const matches = ['XXX','OOO'];
        const winCombination = [
            gameBoard.a1+gameBoard.a2+gameBoard.a3,
            gameBoard.a4+gameBoard.a5+gameBoard.a6,
            gameBoard.a7+gameBoard.a8+gameBoard.a9,
            gameBoard.a1+gameBoard.a5+gameBoard.a9,
            gameBoard.a3+gameBoard.a5+gameBoard.a7,
            gameBoard.a1+gameBoard.a4+gameBoard.a7,
            gameBoard.a2+gameBoard.a5+gameBoard.a8,
            gameBoard.a3+gameBoard.a6+gameBoard.a9
        ];
        for(const element of winCombination){
            if(element===matches[0] || element===matches[1]){
                return true;           
            }
        }
        return false;
    }

    static isDraw(gameBoard){
        const val = Object.values(gameBoard);
        for(const element of val){
            if(element === ""){
                return false;
            }
        }
        return true;
    }

    static socketHandler(socket){
        console.log(`A User Connected ${socket.id}`);
        SOCKETUTIL.createGame(socket); 
        if(SOCKETUTIL.getOpponent(socket)){
            socket.emit('game.begin',{
                symbol : SOCKETUTIL.player[socket.id].symbol,
                turn : SOCKETUTIL.player[socket.id].turn
            })
            SOCKETUTIL.getOpponent(socket).emit('game.begin',{
                symbol : SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].symbol,
                turn : SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn
            })
        }

        //player position : symbol and position
        socket.on('player.move',player_postition=>{
            console.log("A move was made",player_postition);
            if(SOCKETUTIL.player[socket.id].turn){
                SOCKETUTIL.player[socket.id].turn = false;
                SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn = true; 
                socket.emit('move.made',{
                    position: player_postition,
                    turn: SOCKETUTIL.player[socket.id].turn,
                    symbol: SOCKETUTIL.player[socket.id].symbol
                });
                SOCKETUTIL.getOpponent(socket).emit('move.made',{
                    position: player_postition,
                    turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn,
                    symbol: SOCKETUTIL.player[socket.id].symbol
                });         
            }
        })

        socket.on("game.state.check",gameBoard=>{
            console.log(gameBoard);
            console.log(socket.id);
            if(SOCKETUTIL.isWinner(gameBoard)){
                socket.emit("game.state",{
                    Win: true,
                    Loss: false,
                    Draw: false,
                    turn: SOCKETUTIL.player[socket.id].turn
                });
                SOCKETUTIL.getOpponent(socket).emit("game.state",{
                    Win: false,
                    Loss: true,
                    Draw: false,
                    turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn
                });                                
            }
            else if(SOCKETUTIL.isDraw(gameBoard)){
                socket.emit("game.state",{
                    Win: false,
                    Loss: false,
                    Draw: true,
                    turn: SOCKETUTIL.player[socket.id].turn
                });
                SOCKETUTIL.getOpponent(socket).emit("game.state",{
                    Win: false,
                    Loss: false,
                    Draw: true,
                    turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn
                });   
            }  
            else{
                socket.emit("game.state",{
                    Win: false,
                    Loss: false,
                    Draw: false,
                    turn: SOCKETUTIL.player[socket.id].turn
                });
                SOCKETUTIL.getOpponent(socket).emit("game.state",{
                    Win: false,
                    Loss: false,
                    Draw: false,
                    turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn                   
                });   
            }   

        }) 

        socket.on("username",username=>{
            SOCKETUTIL.player[socket.id].username = username;
        })
        socket.on("game.end",gameState=>{
            db.addUser(SOCKETUTIL.player[socket.id],gameState);
        })

        socket.on("disconnect",data=>{
            console.log(data);
            if(SOCKETUTIL.getOpponent(socket)){
                SOCKETUTIL.getOpponent(socket).emit('opponent.left');
            }
        });
    }
}
module.exports = SOCKETUTIL;
