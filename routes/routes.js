const 
express = require('express'),
router = express.Router(),
home = require('../controllers/home-controller'),
game = require('../controllers/game-controller'),
gamestats = require('../controllers/gamestats-controller');

router.get('/',home);
router.get('/game',game);
router.post('/gamestats',gamestats);

module.exports = router