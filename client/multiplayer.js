var playerName = prompt("What's your name?");

let p1Lbl = document.querySelector('#player1');
let p2Lbl = document.querySelector('#player2');
const cards = document.querySelectorAll(".card");
let playingContainer = document.querySelector(".playing");

// Declare socket for communication
var socket = io("http://172.16.50.16:3000");
// Connect socket
socket.on("connect", () => {
  console.log("Client connected to server: " + playerName);
});

// Create player in server
const player = {
  name: playerName,
  move: ''
}

socket.emit('newPlayer', player);

// Read players connected and set their names
socket.on('players', (players) => {
  let playersIds = Object.keys(players);
  if (playersIds.length == 1) {
    p1Lbl.innerHTML = `P1: ${players[playersIds[0]].name}`;
    p2Lbl.innerHTML = `P2: `;
  } 
  if(playersIds.length == 2) {
    p1Lbl.innerHTML = `P1: ${players[playersIds[0]].name}`;
    p2Lbl.innerHTML = `P2: ${players[playersIds[1]].name}`;
  } 
});

// Add event listener to each player to send their movement
for (let card of cards) {
  card.addEventListener('click', (e) => {
    let movement = e.target.getAttribute('name')
    console.log(e.target);
    player.move = movement;
    socket.emit('move', player);
    for (let card of cards) {
      if(card.getAttribute('name') != movement) {
        card.style.display = "none"
      }
    }
  })
}


// Read result
socket.on('result', (gameState) => {
  playingContainer.innerHTML = `
    <div class="winner">
      <a href="index.html">${gameState.result.name} won!!! Click to return</a>
    </div>
  `;
});
