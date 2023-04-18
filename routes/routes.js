const 
express = require('express'),
router = express.Router(),
home = require('../controllers/homePage.controller'),
gamestats = require('../controllers/userStatistics.controller'),
signup = require('../controllers/signUp.controller'),
login = require('../controllers/auth.controller'),
dashboard = require('../controllers/userDashboard.controller'),
requireAuth = require('../middleware/requireAuth'),
loadGame = require('../controllers/multiplayer.controller');

router.get('/',home);
router.post('/signup',signup);
router.post('/login',login);
router.get('/multiplayer',requireAuth,loadGame);
router.get('/dashboard',requireAuth,dashboard);
router.post('/gamestats',requireAuth,gamestats);

module.exports = router;
