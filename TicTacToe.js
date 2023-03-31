const 
express = require('express'),
{createServer} = require('http'),
{Server} = require('socket.io'),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
{port} = require('./config/env-config'),
MongoUtil = require('./utility/db.utility'),
{socketHandler} = require('./utility/websocket.utility'),
app = express(),
httpServer = createServer(app),
io = new Server(httpServer)

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(routes);
io.on("connection",socketHandler);

httpServer.listen(port, async()=>{
    console.log(`Listening on port ${port}`);
    try{
        await MongoUtil.connect();
        console.log("Connected to the Tic Tac Toe Database");
    }
    catch(err){
        console.log("Cannot Connect to the Tic Tac Toe Database",err);
    }
});
