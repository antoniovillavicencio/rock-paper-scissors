const cards = document.querySelectorAll(".card");
let playingContainer = document.querySelector(".playing");


for (let card of cards) {
  card.addEventListener("click", e => {
    let movement = e.target.getAttribute("name");
    for (let card of cards) {
      if (card.getAttribute("name") != movement) {
        card.style.display = "none";
      }
    }
    calculateResult(movement).then(data => {
      playingContainer.innerHTML = `
    <div class="winner">
      <a href="index.html">${data}. Click to return</a>
    </div>
  `;
    });
  });
}

// Read result

async function calculateResult(movement) {
  let response = await fetch("http://localhost:3000/singleplayer", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ data: movement })
  });
  let data = await response.json();
  return data;
}
