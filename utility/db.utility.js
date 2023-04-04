const 
{MongoClient} = require('mongodb'),
createUserSchema = require('../database/models/db.schema');

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

    //method to find and return the gamestatistics of respective username
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
    //insert the wins, loss , draws of the user with the corresponding  username into the database ( following db.schema validation )
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
           console.log(err);
        }
    }
}
module.exports = new DbUtil();
