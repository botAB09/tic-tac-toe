const MongoUtil = require('./utility/mongo-utility');

module.exports = async function(){
    try{
        await MongoUtil.connect();
        console.log("Connected to the Tic Tac Toe Database");
        return true;
    }
    catch(err){
        console.log("Cannot Connect to the Tic Tac Toe Database",err);
    }
}