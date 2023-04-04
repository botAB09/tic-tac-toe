const 
db = require('../utility/db.utility');

/**
 * 
 * @param {object} req request object contains username "string" 
 * @param {object} res sends gamestatistics data of the respective username
 *                                 
 */
module.exports = async function(req,res){
    //fetch game data using the username   
    const username = req.body;
    const gamestatistics = await db.getUserStats(username['username']);
    res.send(gamestatistics);
}
