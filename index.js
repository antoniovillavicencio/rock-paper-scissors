const express = require('express');
const app = express();
// const app = require('express')();
const server = require("http").createServer(app);
const io = require("–")(server);
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(express.static('./client/'));

server.listen(3000, () => {
  console.log("Server initialized on port 3000");
});

app.get("/players", (req, res) => {
  res.send(gameState);
});

app.get('/', (req, res) => {
  res.sendfile('./client/index.html');
})

app.post('/singleplayer', (req, res) => {
  let moves = ['rock', 'paper', 'scissors'];
  let randomNumber = Math.floor(Math.random() * 3);
  let cpuMove = moves[randomNumber];
  let playerMove = req.body.data;
  result = gameResult(playerMove, cpuMove);
  switch(result) {
    case -1: 
      res.json("It's a draw!")
      break;
    case 0:
      res.json("You win!!");
      break;
    case 1:
      res.json("CPU wins!");
      break;
  }
  
});

const gameState = {
  players: {},
  result: ""
};

function gameResult(p1, p2) {
  // 0 = player1, 1 = player2, -1 = draw
  let result = -2;
  if (p1 == "rock") {
    switch (p2) {
      case "paper":
        result = 1;
        break;
      case "scissors":
        result = 0;
        break;
      case "rock":
        result = -1;
        break;
    }
  }
  if (p1 == "paper") {
    switch (p2) {
      case "paper":
        result = -1;
        break;
      case "scissors":
        result = 1;
        break;
      case "rock":
        result = 0;
        break;
    }
  }
  if (p1 == "scissors") {
    switch (p2) {
      case "paper":
        result = 0;
        break;
      case "scissors":
        result = -1;
        break;
      case "rock":
        result = 1;
        break;
    }
  }

  return result;
}

// Socket methods
io.on("connection", socket => {
  console.log(`New user connected: ${socket.id}`);

  // Check disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete gameState.players[socket.id];
  });

  // New player Added
  socket.on("newPlayer", player => {
    gameState.players[socket.id] = player;

    console.log(gameState);
  });

  // Player move
  socket.on("move", player => {
    gameState.players[socket.id].move = player.move;
  });
});

// Waiting for two players to send their move at 60Hz
setInterval(() => {
  // Send the gameState
  io.sockets.emit('players', gameState.players)
  let playersIds = Object.keys(gameState.players);
  if (playersIds.length == 2) {
    const p1Name = gameState.players[playersIds[0]].name;
    const p1Move = gameState.players[playersIds[0]].move;
    const p2Name = gameState.players[playersIds[1]].name;
    const p2Move = gameState.players[playersIds[1]].move;

    if (p1Move && p2Move) {
      const result = gameResult(p1Move, p2Move);
      result >= 0
        ? (gameState.result = gameState.players[playersIds[result]])
        : (gameState.result = "draw");
      // Send the game state
      io.sockets.emit("result", gameState);
      // Reset players and result
      gameState.result = "";
      gameState.players = {}
    }
  }
}, 300);
