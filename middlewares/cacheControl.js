/**
 * deletes browser cache and prevents browser from rendering the cached files 
 * prevents the user to access cached pages
 * @param {object} req 
 * @param {object} res object to set header of the browser cache of the page
 * @param {object} next redirects to next middleware 
 */
const nocache = function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

module.exports = nocache;
