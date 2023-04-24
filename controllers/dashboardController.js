const db = require("../database/src/db.method");

const dashboardView = async function (req, res) {
  const userStats = await fetchUserStatistics(req.session.username);
  res.render("user.dashboard.ejs", {
    username: req.session.username,
    win: userStats.Win,
    loss: userStats.Loss,
    draw: userStats.Draw,
  });
};

const multiplayerGame = async function (req, res) {
  res.render("multiplayer.ejs");
};

const pvpGame = async function (req, res) {
  res.render("pvp.ejs");
};

const fetchUserStatistics = async function (username) {
  try {
    const gamestatistics = await db.getUserStats(username);
    return {
      Win: gamestatistics[0].Win,
      Loss: gamestatistics[0].Loss,
      Draw: gamestatistics[0].Draw,
    };
  } catch (err) {
    console.log("Error: retrieving game statistics of the user", err);
  }
};

const logoutUser = async function (req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  dashboardView,
  multiplayerGame,
  pvpGame,
  fetchUserStatistics,
  logoutUser,
};
