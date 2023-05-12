/**
 * checks if userdata exist in the cookie data 
 * redirects to login page if user does not exists
 * @param {object} req contains session data of the user
 * @param {object} res response object to redirect user
 * @param {object} next redirects to next middleware
 */
module.exports = function requireAuth(req, res, next) {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    next();
  }
};
