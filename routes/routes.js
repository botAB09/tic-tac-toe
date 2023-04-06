const 
express = require('express'),
router = express.Router(),
home = require('../controllers/homepage-controller'),
gamestats = require('../controllers/userstats-controller');

router.get('/',home);
router.post('/gamestats',gamestats);

module.exports = router
