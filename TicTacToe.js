const 
express = require('express'),
{createServer} = require('http'),
{Server} = require('socket.io'),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
DbUtil = require('./utility/db.utility'),
socketUtil = require('./utility/websocket.utility'),

app = express(),
httpServer = createServer(app),
io = new Server(httpServer)

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(routes);
io.on("connection",socketUtil.socketHandler);

httpServer.listen(process.env.port, async()=>{
    console.log(`Listening on port ${process.env.port}`);
    try{
        await DbUtil.connect();
        console.log("Connected to the Tic Tac Toe Database");
    }
    catch(err){
        console.log("Cannot Connect to the Tic Tac Toe Database",err);
    }
});
