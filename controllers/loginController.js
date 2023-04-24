const path = require("path"),
  db = require("../database/src/db.method");

const registerUser = async function (req, res) {
  try {
    const existUser = await db.isExistingUser(req.body.username);
    if (existUser.length) {
      //user already exists , sign in
      req.flash("error", "User Already Exist ! Login");
      res.redirect("/");
    } else {
      await db.addUser(req.body);
      req.flash("success", "User Registered Successfully");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

const loginAuth = async function (req, res) {
  const userExists = await db.checkUserAuth(req.body);
  if (userExists) {
    req.session.username = req.body.username;
    res.redirect(`/dashboard`);
  } else {
    //incorrect password or username ;
    req.flash("error", "Incorrect Username or Password");
    res.redirect("/");
  }
};

module.exports = {
  loginAuth,
  registerUser,
};
