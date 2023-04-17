const path = require("path");

module.exports = async function (req, res) {
  if (!req.session.username) {
    res.send("Restricted User , Sign to continue ");
  } else {
    res.sendFile(
      path.join(__dirname, "..", "public", "user.dashboard.html"),
      function (err) {
        if (err) {
          console.log("Home Page not Found !!");
          res.status(err.status).end();
        }
      }
    );
  }
};
