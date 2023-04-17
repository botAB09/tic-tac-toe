const 
express = require('express'),
router = express.Router(),
home = require('../controllers/homePage.controller'),
gamestats = require('../controllers/userStatistics.controller'),
signup = require('../controllers/signUp.controller'),
login = require('../controllers/auth.controller'),
dashboard = require('../controllers/userDashboard.controller');

router.get('/',home);
router.get('/dashboard',dashboard);
router.post('/signup',signup);
router.post('/login',login);
router.post('/gamestats',gamestats);

module.exports = router;
