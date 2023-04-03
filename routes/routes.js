const 
express = require('express'),
router = express.Router(),
home = require('../controllers/homepage-controller'),
game = require('../controllers/game-controller'),
gamestats = require('../controllers/userstats-controller');

//TODO how to do hashing in routes and its usage 
//TODO singelton progm..
router.get('/',home);
router.get('/game',game);
router.post('/gamestats',gamestats);

module.exports = router
