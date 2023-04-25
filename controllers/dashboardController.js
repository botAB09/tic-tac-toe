const db = require("../database/src/db.method");

/**
 * 
 * @param {object} req contains session data for the respective username 
 * @param {object} res renderd dashboard of the logged in user ,sends user statistics data to display on dashboard 
 */
const dashboardView = async function (req, res) {
  const userStats = await fetchUserStatistics(req.session.username);
  res.render("user.dashboard.ejs", {
    username: req.session.username,
    win: userStats.Win,
    loss: userStats.Loss,
    draw: userStats.Draw,
  });
};

/**
 * renders multiplayer EJS file 
 * @param {object} res sends multiplayer ejs file to user 
 */
const multiplayerGame = async function (req, res) {
  res.render("multiplayer.ejs");
};

/**
 * renders pvp EJS file 
 * @param {object} res sends pvp ejs file to user 
 */
const pvpGame = async function (req, res) {
  res.render("pvp.ejs");
};

/**
 * retrieves userstatistics from db for the user
 * @param {string} username username string of the user 
 * @returns {win,Loss,Draw} object for the user 
 */
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

/**
 * deletes the session of the user and redirects to homepage view
 * @param {object} req session object
 * @param {object} res sends a redirect response to the user
 */
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
