const 
{MongoClient} = require('mongodb'),
{url,dbname,collection} = require('../config/env-config'),
createUserSchema = require('../database/models/TicTacToe-schema');

/**
 * Mongo Utility class
 */
class MongoUtil {
    /**
     * MongoUtil constructor to create MongoClient 
     */
    constructor (){
        this.client = new MongoClient(url);
        //createUserSchema(this.client);
    }
    /**
     * Initialize db and collection parameter of To Do List database
     */
    async connect() {
        try{
            await this.client.connect();
            this.db = this.client.db(dbname);
            this.collection = this.db.collection(collection);
        }
        catch(err){
            throw new Error(`Error Occured in MongoUtil module while connecting \n ${err} `);
        }
    }
};
module.exports = new MongoUtil();    