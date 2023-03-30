const 
Mongo = require('../../utility/mongo-utility');

/**
 * Tic Tac Toe utility class
 */
class TicTacToe{
    /**
     * 
     * @param {string} username username to search
     * @returns game statictic ie wins, loss , draws ;
     */
    async find(username){
        try{
            const gamestatistics = await Mongo.collection.find({username: username},{projection:{_id:0}}).toArray();
            return gamestatistics;
        }
        catch(err){
            throw new Error('Error Occured in view function Tic Tac Toe.db.js',err);
        }
    }
}
module.exports = new TicTacToe();
