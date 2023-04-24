const express = require('express'),
  { createServer } = require('http'),
  { Server } = require('socket.io'),
  routes = require('./routes/routes'),
  bodyParser = require('body-parser'),
  db = require('./database/src/db.method'),
  path = require('path'),
  socket = require('./src/socket.logic'),
  session = require('express-session'),
  app = express(),
  httpServer = createServer(app),
  io = new Server(httpServer),
  flash = require('req-flash');

//1 hour timer for each cookie , cookie gets deleted after 1 hour of inactivity
const cookieTimer = 60 * 60 * 1000;
const sessionMiddleware = session({
  name: `TicTacToe`,
  secret: 'some-secret-example',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: cookieTimer,
  },
});


app.use(bodyParser.urlencoded({ extended: true }));

//view engine and stylesheet setup
app.use(express.static(__dirname + '/public'));
app.set('views',path.join(__dirname,'/views'));
app.set('view engine', 'ejs');

//socket io setup
io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});
app.use(sessionMiddleware);
app.use(flash());

io.on('connection', socket.socketHandler);

//router middleware
app.use(routes);

//http server
httpServer.listen(process.env.port, async () => {
  console.log(`Listening on port ${process.env.port}`);
  try {
    await db.connect();
    console.log('Connected to the Tic Tac Toe Database');
  } catch (err) {
    console.log('Cannot Connect to the Tic Tac Toe Database', err);
  }
});
