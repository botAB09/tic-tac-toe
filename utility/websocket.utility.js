class SOCKETUTIL{
    static opponent;
    static player = {};
    static createGame(socket){
        console.log(SOCKETUTIL.opponent);
        SOCKETUTIL.player[socket.id] = {
            symbol : 'X',
            opponent : SOCKETUTIL.opponent,
            socket : socket
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
        socket.on('player.move',data=>{
            console.log(SOCKETUTIL.player);
            console.log("A move was made",data);
            socket.emit('move.made',data);
            SOCKETUTIL.getOpponent(socket).emit('move.made',data);
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
