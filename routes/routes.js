const 
express = require('express'),
router = express.Router(),
home = require('../controllers/homepage-controller'),
gamestats = require('../controllers/userstats-controller');

//TODO how to do hashing in routes and its usage 
router.get('/',home);
router.post('/gamestats',gamestats);

module.exports = router
