const path = require("path"),
  db = require("../utilities/db.utility");
const dashboardView = async function (req, res) {
  res.render("user.dashboard.ejs", {
    username: req.session.username,
  });
};

const multiplayerGame = async function (req, res) {
  res.render("multiplayer.ejs");
};

const pvpGame = async function (req, res) {
  res.render("pvp.ejs");
};

const fetchUserStatistics = async function (req, res) {
  try {
    const username = req.session.username;
    const gamestatistics = await db.getUserStats(username);
    const userStats = {
      Win: gamestatistics[0].Win,
      Loss: gamestatistics[0].Loss,
      Draw: gamestatistics[0].Draw,
    };
    res.send(userStats);
  } catch (err) {
    console.log("Error: retrieving game statistics of the user", err);
  }
};

module.exports = {
  dashboardView,
  multiplayerGame,
  pvpGame,
  fetchUserStatistics,
};
