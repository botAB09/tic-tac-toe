const 
db = require('../utility/db.utility');

/**
 * 
 * @param {object} req contains username string to find from Tic Tac Toe Database
 * @param {object} res sends the gamestatics data to the client
 */
module.exports = async function(req,res){
    //fetch game data using the username   
    const username = req.body;
    const gamestatistics = await db.find(username['username']);
    res.send(gamestatistics);
}
