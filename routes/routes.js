const express = require("express"),
  router = express.Router(),
  home = require("../controllers/homepageController"),
  { loginView, registerView } = require("../controllers/loginController"),
  {
    dashboardView,
    multiplayerGame,
    pvpGame,
    fetchUserStatistics,
  } = require("../controllers/dashboardController"),
  requireAuth = require("../middlewares/requireAuth");

router.get("/", home);
router.post("/signup", registerView);
router.post("/login", loginView);

router.get("/pvp", pvpGame);
router.get("/multiplayer", requireAuth, multiplayerGame);
router.get("/dashboard", requireAuth, dashboardView);
router.post("/gamestats", requireAuth, fetchUserStatistics);

module.exports = router;
