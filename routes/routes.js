const 
express = require('express'),
router = express.Router(),
home = require('../controllers/homePage.controller'),
gamestats = require('../controllers/userStatistics.controller'),
signup = require('../controllers/register.controller'),
login = require('../controllers/login.controller'),
dashboard = require('../controllers/user.dashboard.controller'),
requireAuth = require('../middleware/requireAuth'),
pvp = require('../controllers/pvp.controller'),
loadGame = require('../controllers/multiplayer.controller');

router.get('/',home);
router.post('/signup',signup);
router.post('/login',login);
router.get('/pvp',pvp);
router.get('/multiplayer',requireAuth,loadGame);
router.get('/dashboard',requireAuth,dashboard);
router.post('/gamestats',requireAuth,gamestats);

module.exports = router;
