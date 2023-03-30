const 
TicTacToe = require('../database/utility-functions/TicTacToe.database');

/**
 * 
 * @param {object} req contains username string to find from Tic Tac Toe Database
 * @param {object} res sends the gamestatics data to the client
 */
module.exports = async function(req,res){
    //fetch game data using the username   
    const username = req.body;
    const gamestatistics = await TicTacToe.find(username['username']);
    console.log(gamestatistics);
    res.send(gamestatistics);
}
