const 
Mongo = require('../../utility/mongo-utility');

class TicTacToe{
    async find(username){
        try{
            const gamestatistics = await Mongo.collection.find({username: username},{projection:{_id:0}}).toArray();
            return gamestatistics;
        }
        catch(err){
            throw new Error('Error Occured in view function Tic Tac Toe.db.js',err);
        }
    }
};
module.exports = new TicTacToe();