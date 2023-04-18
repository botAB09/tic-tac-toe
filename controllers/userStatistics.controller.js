const 
db = require('../utilities/db.utility');

/**
 *
 * @param {object} req request object contains username "string"
 * @param {object} res sends gamestatistics data of the respective username
 *
 */
//TODO change it json format 
module.exports = async function(req,res){
    try{
        const username = req.session.username;
        const gamestatistics = await db.getUserStats(username);
        const userStats = {
            Win: gamestatistics[0].Win,
            Loss: gamestatistics[0].Loss,
            Draw: gamestatistics[0].Draw
        };
        res.send(userStats);
    }
    catch(err){
        console.log("Error: retrieving game statistics of the user",err);
    }
}

