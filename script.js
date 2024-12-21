const doorsContainer = document.getElementById('doorsContainer');
const doorElements = Array.from(document.querySelectorAll('.door'));
const stayBtn = document.getElementById('stayBtn');
const switchBtn = document.getElementById('switchBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const runSimulationBtn = document.getElementById('runSimulationBtn');
const simulationCountInput = document.getElementById('simulationCount');
const resultsDiv = document.getElementById('results');

let winningDoorIndex;
let playerFirstChoice;
let revealedDoorIndex;
let gameEnded = false;

function initGame() {
  gameEnded = false;
  winningDoorIndex = Math.floor(Math.random() * 3);
  playerFirstChoice = null;
  revealedDoorIndex = null;
  
  doorElements.forEach(door => {
    door.classList.remove('opened', 'selected');
    const prize = door.querySelector('.hidden-prize');
    const goat = door.querySelector('.hidden-goat');
    prize.style.display = 'none';
    goat.style.display = 'none';
  });

  stayBtn.disabled = true;
  switchBtn.disabled = true;
  playAgainBtn.disabled = true;
  resultsDiv.textContent = "";
}

function revealGoat() {
  const possibleDoors = [0, 1, 2].filter(i => i !== playerFirstChoice && i !== winningDoorIndex);
  revealedDoorIndex = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];
  doorElements[revealedDoorIndex].classList.add('opened');
  const goat = doorElements[revealedDoorIndex].querySelector('.hidden-goat');
  goat.style.display = 'block';
}

function onDoorClick(e) {
  if (gameEnded) return;
  const doorIndex = Number(e.currentTarget.getAttribute('data-door-index'));
  if (playerFirstChoice === null) {
    playerFirstChoice = doorIndex;
    e.currentTarget.classList.add('selected');
    revealGoat();
    stayBtn.disabled = false;
    switchBtn.disabled = false;
  }
}

function onStay() {
  openAllDoors();
  const isWin = (playerFirstChoice === winningDoorIndex);
  endGame(isWin);
}

function onSwitch() {
  const switchDoorIndex = [0, 1, 2].find(i => i !== playerFirstChoice && i !== revealedDoorIndex);
  openAllDoors();
  const isWin = (switchDoorIndex === winningDoorIndex);
  endGame(isWin);
}

function openAllDoors() {
  doorElements.forEach((door, index) => {
    door.classList.add('opened');
    if (index === winningDoorIndex) {
      const prize = door.querySelector('.hidden-prize');
      prize.style.display = 'block';
    } else if (index !== revealedDoorIndex) {
      const goat = door.querySelector('.hidden-goat');
      goat.style.display = 'block';
    }
  });
}

function endGame(isWin) {
  gameEnded = true;
  resultsDiv.textContent = isWin
    ? "🎉 Bravo, vous avez gagné la voiture ! 🚗"
    : "😞 Dommage, c'était une chèvre ! 🐐";
  stayBtn.disabled = true;
  switchBtn.disabled = true;
  playAgainBtn.disabled = false;
}

function onPlayAgain() {
  initGame();
}

function runSimulation() {
  const n = parseInt(simulationCountInput.value, 10);
  if (isNaN(n) || n <= 0) {
    alert("Veuillez entrer un nombre de parties valide.");
    return;
  }

  let stayWins = 0;
  let switchWins = 0;

  for (let i = 0; i < n; i++) {
    const winningDoor = Math.floor(Math.random() * 3);
    const playerChoice = Math.floor(Math.random() * 3);
    const doorsToReveal = [0, 1, 2].filter(index => index !== playerChoice && index !== winningDoor);
    const doorToReveal = doorsToReveal.length > 1 ? doorsToReveal[Math.floor(Math.random() * doorsToReveal.length)] : doorsToReveal[0];
    const switchDoor = [0, 1, 2].find(index => index !== playerChoice && index !== doorToReveal);

    if (playerChoice === winningDoor) stayWins++;
    if (switchDoor === winningDoor) switchWins++;
  }

  resultsDiv.innerHTML = 
    `📊 Simulation sur <strong>${n.toLocaleString()}</strong> parties :<br>` +
    `🔒 <strong>Rester :</strong> ${stayWins.toLocaleString()} victoires (${((stayWins / n) * 100).toFixed(2)}%)<br>` +
    `🔄 <strong>Changer :</strong> ${switchWins.toLocaleString()} victoires (${((switchWins / n) * 100).toFixed(2)}%)`;
}

doorElements.forEach(door => {
  door.addEventListener('click', onDoorClick);
});
stayBtn.addEventListener('click', onStay);
switchBtn.addEventListener('click', onSwitch);
playAgainBtn.addEventListener('click', onPlayAgain);
runSimulationBtn.addEventListener('click', runSimulation);

initGame();
