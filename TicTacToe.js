const 
express = require('express'),
app = express(),
routes = require('./routes/routes'),
bodyParser = require('body-parser'),
{createServer} = require('http'),
{Server} = require('socket.io'),
httpServer = createServer(app),
MongoConnection = require('./database/utility-functions/TicTacToe.database.connect')


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(routes);

httpServer.listen(8080, async()=>{
    console.log(`Listening on port 8080`);
    MongoConnection();
});

