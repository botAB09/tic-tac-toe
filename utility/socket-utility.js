let opponent;
const player = {}
function createGame(socket){
    console.log(opponent);
    player[socket.id] = {
        symbol : 'X',
        opponent : opponent,
        socket : socket
    }
    if(opponent){
        player[socket.id].symbol = 'O';
        player[opponent].opponent = socket.id;
        opponent = null;
    }
    else{
        opponent = socket.id;
    }
}
function getOpponent(socket){
    if(player[socket.id].opponent){
        return player[player[socket.id].opponent].socket;
    }
    return false;
}
function socketHandler(socket){
    console.log(`A User Connected ${socket.id}`);
    createGame(socket); 
    if(getOpponent(socket)){
        socket.emit('game.begin',{
            symbol : player[socket.id].symbol
        })
        getOpponent(socket).emit('game.begin',{
            symbol : player[getOpponent(socket).id].symbol
        })
    }
    socket.on('player.move',data=>{
        console.log("A move was made",data);
        socket.emit('move.made',data);
        getOpponent(socket).emit('move.made',data);
    })
    socket.on("disconnect",data=>{
        console.log(data);
        if(getOpponent(socket)){
            getOpponent(socket).emit('opponent.left');
        }
    });
}
module.exports.socketHandler = socketHandler
