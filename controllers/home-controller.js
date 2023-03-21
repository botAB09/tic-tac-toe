const path = require('path');

/**
 * 
 * @param {*} req 
 * @param {object} res send the home page of Tic Tac Toe game to the client
 */
module.exports = async function(req,res){
    res.sendFile(path.join(__dirname,'..','public','home.html'),function(err){
        if(err){
            console.log("Home Page not Found !!");
            res.status(err.status).end();
        }
    })
}