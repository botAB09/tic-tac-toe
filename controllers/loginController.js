const db = require("../database/src/db.method");
/**
 * registers user to the database ; if the user already exists then redirect to the login Page view else creates a new user 
 * @param {object} req 
 * @param {object} res 
 */
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

/**
 * checks for user authentication {username , password} ; if credentials are correct then redirects to dashboard 
 * @param {object} req 
 * @param {object} res 
 */
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
