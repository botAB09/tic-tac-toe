const path = require("path");

module.exports = async function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "public", "Multiplayer.TicTacToe.html"),
    function (err) {
      if (err) {
        res.status(err.status).end();
      }
    }
  );
};
