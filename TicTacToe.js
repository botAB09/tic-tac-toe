const 
express = require('express'),
app = express(),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
{createServer} = require('http'),
{Server} = require('socket.io'),
httpServer = createServer(app),
{port} = require('./config/env-config'),
MongoConnection = require('./database/utility-functions/TicTacToe.database.connect')


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(routes);

httpServer.listen(port, async()=>{
    console.log(`Listening on port ${port}`);
    MongoConnection();
});

