const path = require("path");

/**
 *
 * @param {object}  res retrieves Homepage file and returns the Home Page file to the client
 */
module.exports = async function (req, res) {
  if (req.session.username) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(
      path.join(__dirname, "..", "public", "login.html"),
      function (err) {
        if (err) {
          res.status(err.status).end();
        }
      }
    );
  }
};
