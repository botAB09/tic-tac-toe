const { MongoClient } = require("mongodb"),
  createUserSchema = require("../database/schema/db.schema");

/**
 *  db utility class usage ;
 *      -- connects to the database
 *
 */
class DbUtil {
  //constructor method : creates a new instance of database
  constructor() {
    this.client = new MongoClient(process.env.uri);
  }
  //initializes db object , collection object of database
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(process.env.dbname);
      this.collection = this.db.collection(process.env.collection);
      const collectionExists = await this.db.listCollections().toArray();
      if (!collectionExists.length) {
        createUserSchema(this.client);
      }
    } catch (err) {
      throw new Error(`Error Occured in DB.module while connecting \n ${err} `);
    }
  }
}
module.exports = DbUtil;
