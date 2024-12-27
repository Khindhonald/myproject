// Required Libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const bot = new TelegramBot('7932400528:AAE3H1QaRxsoygNKr-QChsBbUXIN35yTnmE', { polling: true });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Set up EJS as templating engine
app.set('view engine', 'ejs');

// Middleware for sessions
app.use(session({
    secret: 'your_secret_key', // Use a strong secret for sessions
    resave: false,
    saveUninitialized: true
}));

// Serve static files (like styles.css) from the "public" folder
app.use(express.static('public'));

// In-memory user data (replace with a database in real use case)
let users = {
  'user1': { energy: 1000, points: 0, boostLevel: 1, rechargeTime: null }
};

let referredUsers = {}; // To track referred users (referrer -> [list of referred users])

// Helper function to recharge energy
function rechargeEnergy(userId) {
  if (users[userId].energy <= 0 && !users[userId].rechargeTime) {
    users[userId].rechargeTime = Date.now() + 600000; // 10 minutes
  }
}

// Endpoints for actions (energy and boost)
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

// Account page to show the referral link and invited users
app.get('/account', (req, res) => {
    // Assuming user ID is stored in the session (you might need to add logic to set this in the session)
    const userId = req.session.userId || "12345"; // Example user ID
    const referredList = referredUsers[userId] || [];

    // Generate the referral link
    const userReferralCode = req.session.userReferralCode || `r${Math.random().toString(36).substr(2, 9)}`; 
    const referralLink = `https://t.me/quirkcoin_bot?start=${userReferralCode}`;
    
    // Store the referral code in session for later use
    req.session.userReferralCode = userReferralCode;

    // Render the account page and pass referred users list and referral link
    res.render('account', { referredUsers: referredList, referralLink });
});

// Handle Telegram bot `/start` command (Welcome message and generate referral link)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Generate a referral code for the user
    const referralCode = `r${userId}`;
    const referralLink = `https://t.me/quirkcoin_bot?start=${referralCode}`;

    // Store user details and send the referral link
    if (!users[userId]) {
        users[userId] = { id: userId, username: msg.from.username };  // Store user info in memory (use DB in production)
    }

    // Send the referral link to the user
    bot.sendMessage(chatId, `Welcome to the bot! Here is your referral link: ${referralLink}`);
});

// Handle `/start <referralCode>` command (Track referral information)
bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const referralCode = match[1];  // Capture the referral code from the link
    const referredByUserId = referralCode.slice(1);  // Remove the "r" to get the user ID
    
    // Store this referral information in the referredUsers object
    if (users[referredByUserId]) {
        if (!referredUsers[referredByUserId]) {
            referredUsers[referredByUserId] = [];  // Initialize array if not present
        }
        referredUsers[referredByUserId].push(msg.from.username);  // Add referred user's username to list
    }

    // Send confirmation message to the user
    bot.sendMessage(chatId, `Welcome! You were referred by @${users[referredByUserId]?.username || 'Unknown'}`);
});

// Handle `/referrals` command to show referred users for a specific user
bot.onText(/\/referrals/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const referredList = referredUsers[userId] || [];
    const referredNames = referredList.length > 0 ? referredList.join('\n') : 'No users referred yet.';
    
    bot.sendMessage(chatId, `Invited Users:\n${referredNames}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
