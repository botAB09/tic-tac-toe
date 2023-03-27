const path = require('path');

/**
 * 
 * @param {object} res sends the game.html page to the client
 */
module.exports = async function (req,res){
    res.sendFile(path.join(__dirname,'..','public','game.html'),function(err){
        if(err){
            console.log("Home Page not Found !!");
            res.status(err.status).end();
        }
    }) 
}