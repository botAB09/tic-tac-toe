const 
{MongoClient} = require('mongodb'),
createUserSchema = require('../database/models/db.schema');

//TODO use authentication mongo

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

    //find method to find and return the gamestatistics of respective username
    async find(username){
        try{
            const gamestatistics = await this.collection.find({username: username},{projection:{_id:0}}).toArray();
            console.log(gamestatistics);
            return gamestatistics;
        }
        catch(err){
            throw new Error('Error Occured in find function db.js',err);
        }
    }
}
module.exports = new DbUtil();
