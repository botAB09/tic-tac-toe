const MongoUtil = require('../../utility/mongo-utility');

/**
 * 
 * @returns boolean true if connection is established to Tic Tac Toe Database
 */
module.exports = async function(){
    try{
        await MongoUtil.connect();
        console.log("Connected to the Tic Tac Toe Database");
    }
    catch(err){
        console.log("Cannot Connect to the Tic Tac Toe Database",err);
    }
}