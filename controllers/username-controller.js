const 
TicTacToe = require('../database/utility-functions/TicTacToe.database');

/**
 * 
 * @param {object} req contains the username of the player
 * @param {object} res redirects the client to the game url 
 */
module.exports = async function(req,res){
    /**
     * check if the user exists , if it exists then do not create new user ; else create a new field in the database 
     */
    const player1 = req.body.player1,
          player2 = req.body.player2;
    
    if(player1 == player2){
        res.send('Cannot have Same Username !!');
    }
    const player1_info = await TicTacToe.find(player1);
    if(player1_info.length == 0){
        
    }
    const player2_info = await TicTacToe.find(player2);
    if(player2_info.length == 0){
        
    }
    res.redirect('/game');
}