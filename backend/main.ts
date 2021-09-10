import { log, logRequest } from './src/Logger';
import auth = require('./src/Auth');
import db = require('./src/Database');
import mc = require('./src/ManageContent');
import um = require('./src/UserManagement');
import ge = require('./src/GameEngine');
import { gameT } from './src/Types';
var express = require('express');
var ip = require("ip");
var app = express();
var passport = auth.getPassport();
var session = require('express-session');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let port = process.env.port || 3001;
let path = __dirname.substring(0, __dirname.length - 3)

var onlineUsers = [];

db.init();

app.use(express.json());
app.use(express.static('homepageBuild'));
app.use('/game', express.static('frontendBuild'))
app.use(express.urlencoded({ extended: true }));

console.log(path + "/game");

const sessionMiddleware = session({ secret: 'keyboard cat', resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

io.of("/game").use(wrap(sessionMiddleware));
io.of("/game").use(wrap(passport.initialize()));
io.of("/game").use(wrap(passport.session()));
io.of("/game").use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

app.get('/', (req,res) => {
  res.sendFile(path + '/homepageBuild/index.html')
});

app.post('/login', um.login);

app.post('/signup', um.signup);

app.post('/session', auth.verifyRequest(), um.session);

app.post('/logout', auth.verifyRequest(), um.logout);

app.post('/move',
auth.verifyRequest(),
mc.isReqValid(["gameId", "selectedPawn", "clickedPawn"]),
ge.isMoveValid,
ge.executeMove(io),
ge.isGameFinished(io)
)

app.post('/creategame', auth.verifyRequest() , async (req,res)=>{
  let gameId = await mc.createGame(req, res);
  let gameObject: gameT = await db.getGameById(gameId, req.user.username);

  for( const playerSocket of onlineUsers ){
    let username:string = playerSocket.request.user.username;
    let host:string = req.user.username;
    let opponent:string = req.body.opponent;
    if( ( username === host ) || (username === opponent ) ) {
      playerSocket.emit("newgame", JSON.stringify(gameObject));
    }
  }
});

app.get('/game/:gameID', (req,res)=>{
  res.sendFile(path + '/frontendBuild/index.html')
});

app.post('/game/:gameID', auth.verifyRequest(), async (req, res)=>{
  let game: gameT;
  try{
    game = await db.getGameById(req.params.gameID, req.user.username);
  } catch {
    res.status(404).send();
    return;
  }
  res.send(JSON.stringify(game));
});

io.on('connection' , (socket) => {
  log.req('a ' + socket.request.user.username + ' connected');
  onlineUsers.push( socket );

  socket.broadcast.emit('update' , '+' + socket.request.user.username);

  let resp = [];
  for( const elm of onlineUsers ){
    resp.push( elm.request.user.username );
  }

  socket.emit('online', JSON.stringify(resp));
  mc.getPlayerHistory(socket.request.user.username).then((result)=>{
    socket.emit('playerHistory', JSON.stringify(result) );
  });

  socket.on('disconnect', function() {
    log.req(socket.request.user.username + ' got disconnected!');

    socket.broadcast.emit('update' , '-' + socket.request.user.username);

    var i = onlineUsers.indexOf( socket );
    onlineUsers.splice(i, 1);

    socket.removeAllListeners();
  });
});

io.of("/game").on("connection", (socket)=>{
  let gameID:string = mc.parseGameID(socket.handshake.headers.referer);
  log.req(gameID + ": " + socket.request.user.username + " connected!");
  socket.join(gameID);

  socket.on('sendMessage', (msg) => {
    log.req(gameID + " GOT MESSAGE: " + msg);
    io.of("/game").to(gameID).emit('chatMessage', JSON.stringify({ sender: socket.request.user.username, message: msg }) );
  });

  socket.on('disconnect', function() {
    log.req(gameID + ": " + socket.request.user.username + ' disconnected!');
  });

})

server.listen(port, () => {
    console.log("Server started at IP " + ip.address() + " and port " + port);
});