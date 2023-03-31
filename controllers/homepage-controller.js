const path = require('path');

/**
 * 
 * @param {object}  res retrieves Homepage file and returns the Home Page file to the client 
 */
module.exports = async function(req,res){
    res.sendFile(path.join(__dirname,'..','public','TicTacToe.homepage.html'),function(err){
        if(err){
            console.log("Home Page not Found !!");
            res.status(err.status).end();
        }
    })
}
