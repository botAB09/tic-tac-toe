const 
{MongoClient} = require('mongodb'),
createUserSchema = require('../database/models/db.schema');
/**
 *  db utility class usage ; 
 *      -- connecting to the database
 *      -- searching User Statistics of each game played by the User 
 *      -- adding / updating the username and statistics ( Win , Loss , Draw ) of the user .
 * //TODO authenticate database ; how to store passwords in the database ; 
 */
class DbUtil {
    //constructor method : creates a new instance of database
    constructor (){
        this.client = new MongoClient(process.env.uri);
    }
    //initializes db object , collection object of database 
    async connect() {
        try{
            await this.client.connect();
            this.db = this.client.db(process.env.dbname);
            this.collection = this.db.collection(process.env.collection);
            const collectionExists = await this.db.listCollections().toArray();
            if(!collectionExists.length){
                createUserSchema(this.client);
            }
        }
        catch(err){
            throw new Error(`Error Occured in DB.module while connecting \n ${err} `);
        }
    }

    /**
     * 
     * @param {string} username username of the client connected to the game board;
     * @returns the user statistics { Win , Loss , Draws} of the entered username .
     */
    async getUserStats(username){
        try{
            const gamestatistics = await this.collection.find({username: username},{projection:{_id:0}}).toArray();
            console.log(gamestatistics);
            return gamestatistics;
        }
        catch(err){
            throw new Error('Error Occured in getUSerStats function db.js',err);
        }
    }
    
   /**
    * 
    * @param {object} userData player object 
     *     properties of each player object :
     *          -- symbol: contains the user symbol for the board
     *          -- opponent: is null initially ; when another user connects then available sockets are connected 
     *          -- socket: stores the socket object 
     *          -- username: stores the username of each connected user
    *  
    * @param {string} gameState the end result of the game board for each user , whether user won , lost or drew the game 
    * Updates the database with username and corresponding game state 
    */

    async addUser(userData,gameState){
        try{
            const username = userData.username;

            //if the username does not exists then it will insert it with the default values to 0 .
            await this.collection.updateOne(
                {"username":username},
                {
                    $setOnInsert: {
                        Win: 0,
                        Loss: 0,
                        Draw: 0
                    }
                },
                {upsert:true}
            )
            
            //if game state is "Win" then increment the Win field in db by +1;
            if(gameState === "Win"){
                await this.collection.updateOne(
                    {"username":username},
                    {
                        $inc:{
                            Win:1
                        }
                    },
                    {upsert:true}
                )
            }
             //if game state is "Loss" then increment the Win field in db by +1;
            else if(gameState === "Loss"){
                await this.collection.updateOne(
                    {"username":username},
                    {
                        $inc:{
                            Loss:1
                        }
                    },
                    {upsert:true}
                )
            }
             //if game state is "Draw" then increment the Win field in db by +1;
            else{
                await this.collection.updateOne(
                    {"username":username},
                    {
                        $inc:{
                            Draw:1
                        }
                    },
                    {upsert:true}
                )
            }
        }
        catch(err){
           console.log("Error: While updating records in the database",err);
        }
    }
}
module.exports = new DbUtil();
