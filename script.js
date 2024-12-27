let energy = 1000;
let points = 0;
let boostLevel = 1;
let energyRechargeTime = 600; // 10 minutes in seconds
let rechargeTimerInterval;
let boostActive = false;

// DOM elements
const energyValue = document.getElementById("energyValue");
const pointsValue = document.getElementById("pointsValue");
const boostLevelElement = document.getElementById("boostLevel");
const rechargeTimeElement = document.getElementById("rechargeTime");
const tapButton = document.getElementById("tapButton");
const rechargeTimer = document.getElementById("rechargeTimer");
const boostButton = document.getElementById("boostButton");

// Update UI elements
function updateUI() {
  energyValue.textContent = energy;
  pointsValue.textContent = points;
  boostLevelElement.textContent = boostLevel;
  if (energy <= 0) {
    startRecharge();
  }
}

// Start the recharge timer
function startRecharge() {
  tapButton.disabled = true;
  rechargeTimer.style.display = "block";
  let remainingTime = energyRechargeTime;

  rechargeTimerInterval = setInterval(() => {
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    rechargeTimeElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    remainingTime--;

    if (remainingTime < 0) {
      clearInterval(rechargeTimerInterval);
      energy = 1000;
      updateUI();
      tapButton.disabled = false;
      rechargeTimer.style.display = "none";
    }
  }, 1000);
}

// Tap to earn points
tapButton.addEventListener("click", () => {
  if (energy > 0) {
    points += boostActive ? boostLevel * 2 : boostLevel;
    energy -= 1;
    updateUI();
  }
});

// Boost button logic
boostButton.addEventListener("click", () => {
  if (points >= 100) {
    points -= 100;
    boostLevel++;
    boostActive = true;
    updateUI();
  } else {
    alert("You need 100 points to activate the boost.");
  }
});

updateUI();
