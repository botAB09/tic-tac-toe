const 
express = require('express'),
{createServer} = require('http'),
{Server} = require('socket.io'),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
{port} = require('./config/env-config'),
MongoConnection = require('./database/utility-functions/TicTacToe.database.connect'),
player = {},

app = express(),
httpServer = createServer(app),
io = new Server(httpServer);

let opponent;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(routes);

httpServer.listen(port, async()=>{
    console.log(`Listening on port ${port}`);
    MongoConnection();
});

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

io.on("connection",socket=>{
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
        opponent = null;
        if(getOpponent(socket)){
            getOpponent(socket).emit('opponent.left');
        }
    });
})


