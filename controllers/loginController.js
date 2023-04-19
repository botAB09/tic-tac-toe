const path = require("path"),
  db = require("../utilities/db.utility");

const registerView = async function (req, res) {
  try {
    const existUser = await db.isExistingUser(req.body.username);
    if (existUser.length) {
      //user already exists , sign in
      res.redirect("/");
    } else {
      await db.addUser(req.body);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

const loginView = async function (req, res) {
  const userExists = await db.checkUserAuth(req.body);
  if (userExists) {
    req.session.username = req.body.username;
    res.redirect(`/dashboard`);
  } else {
    //user does not exist
    res.status(400).json({
      message: "incorrect user or password",
    });
  }
};

module.exports = {
  loginView,
  registerView,
};
