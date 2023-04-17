const path = require("path"),
  db = require("../utilities/db.utility");

module.exports = async function (req, res) {
  const userExists = await db.checkUserAuth(req.body);
  if (userExists) {
    req.session.username = req.body.username;
    res.redirect(`/dashboard`);
  } else {
    res.status(400).json({
      message: "incorrect user or password",
    });
  }
};
