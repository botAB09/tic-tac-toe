const 
express = require('express'),
app = express(),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
Mongo = require('./utility/mongo-utility'),
{createServer} = require('http'),
{Server} = require('socket.io'),
httpServer = createServer(app),
io = new Server(httpServer,{});

let 
unmatched = null,
player = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(routes);

httpServer.listen(8080, async()=>{
    console.log(`Listening on port 8080`);
    try{
        await Mongo.connect();
        console.log('Connected to the database');
    }
    catch(err){
        console.log('Cannot Connect to the database',err);
        process.exit(1);
    }
});

/**
 * 
 * @param {object} socket creates player key-value pair 
 */
function createGame(socket){
    
    player[socket.id] = {
        symbol : 'X',
        opponent : unmatched,
        socket : socket
    };

    if(!unmatched){
        unmatched = socket.id;
    }
    else{
        player[socket.id].symbol = 'O';
        player[unmatched].opponent = socket.id;
        unmatched = null;
    }

}

/**
 * 
 * @param {object} socket contains the player 2 socket object
 * @returns opponent socket 
 */
function getOpponent(socket){
    if(!player[socket.id].opponent){
        return ;
    }
    else{
        return player[
            player[socket.id].opponent
        ].socket;
    }
}

io.on("connection",(socket)=>{
    console.log("user Connected",socket.id);
    createGame(socket);
    /**
     * send the symbol of opponent and player 2 
     */
    if(getOpponent(socket)){
        socket.emit('gameBegin',{
            symbol : player[socket.id].symbol
        });
        getOpponent(socket).emit('gameBegin',{
            symbol : player[getOpponent(socket).id].symbol
        });
    }
    
    socket.on('disconnect',()=>{
        console.log("user disconnected",socket.id);
    })
})