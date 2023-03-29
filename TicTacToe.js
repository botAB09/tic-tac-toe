const 
express = require('express'),
{createServer} = require('http'),
{Server} = require('socket.io'),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
{port} = require('./config/env-config'),
MongoConnection = require('./database/utility-functions/TicTacToe.database.connect'),
{socketHandler} = require('./utility/socket-utility'),
// socketUtility = require('./utility/socket-utility'),
app = express(),
httpServer = createServer(app),
io = new Server(httpServer);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(routes);
io.on("connection",socketHandler);

httpServer.listen(port, async()=>{
    console.log(`Listening on port ${port}`);
    MongoConnection();
});



