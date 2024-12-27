const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// User Data (in-memory for now, replace with a database later)
let users = {
  'user1': { energy: 1000, points: 0, boostLevel: 1, rechargeTime: null }
};

// Helper functions
function rechargeEnergy(userId) {
  if (users[userId].energy <= 0 && !users[userId].rechargeTime) {
    users[userId].rechargeTime = Date.now() + 600000; // 10 minutes
  }
}

// Endpoints
app.post('/tap', (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.status(404).send('User not found');
  
  rechargeEnergy(userId);

  if (Date.now() >= users[userId].rechargeTime) {
    users[userId].energy = 1000;
    users[userId].rechargeTime = null;
  }

  if (users[userId].energy > 0) {
    users[userId].points += users[userId].boostLevel;
    users[userId].energy -= 1;
  }

  res.send({ energy: users[userId].energy, points: users[userId].points });
});

app.post('/boost', (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.status(404).send('User not found');

  if (users[userId].points >= 100) {
    users[userId].points -= 100;
    users[userId].boostLevel += 1;
    res.send({ boostLevel: users[userId].boostLevel, points: users[userId].points });
  } else {
    res.status(400).send('Not enough points to boost');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
