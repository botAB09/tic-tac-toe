const 
express = require('express'),
router = express.Router(),
home = require('../controllers/home-controller'),
username = require('../controllers/username-controller'),
game = require('../controllers/game-controller'),
gamestats = require('../controllers/gamestats-controller');

router.get('/',home);
router.post('/username',username);
router.get('/game',game);
router.post('/gamestats',gamestats);

module.exports = router