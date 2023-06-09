const cacheControl = require("../middlewares/cacheControl");
const express = require("express"),
  router = express.Router(),
  home = require("../controllers/homepageController"),
  { loginAuth, registerUser } = require("../controllers/loginController"),
  {
    dashboardView,
    multiplayerGame,
    pvpGame,
    fetchUserStatistics,
    logoutUser,
  } = require("../controllers/dashboardController"),
  requireAuth = require("../middlewares/requireAuth");

//routes for login page and authentication
router.get("/", home);
router.post("/signup", registerUser);
router.post("/login", loginAuth);

//routes for dashboard , dashboard functionality 
router.get("/dashboard", requireAuth,cacheControl, dashboardView);
router.get("/pvp", pvpGame);
router.get("/multiplayer", requireAuth, multiplayerGame);
router.post("/gamestats", requireAuth, fetchUserStatistics);
router.post("/logout",logoutUser);

module.exports = router;
