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
            username : ''
        }
        if(SOCKETUTIL.opponent){
            SOCKETUTIL.player[socket.id].symbol = 'O';
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
    static socketHandler(socket){
        console.log(`A User Connected ${socket.id}`);
        SOCKETUTIL.createGame(socket); 
        if(SOCKETUTIL.getOpponent(socket)){
            socket.emit('game.begin',{
                symbol : SOCKETUTIL.player[socket.id].symbol
            })
            SOCKETUTIL.getOpponent(socket).emit('game.begin',{
                symbol : SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].symbol
            })
        }
        socket.on('player.move',player_postition=>{
            console.log(SOCKETUTIL.player[socket.id]);
            console.log("A move was made",player_postition);
            socket.emit('move.made',player_postition);
            SOCKETUTIL.getOpponent(socket).emit('move.made',player_postition);
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
