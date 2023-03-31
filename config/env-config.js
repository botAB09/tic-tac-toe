const dotenv=require('dotenv');
dotenv.config();

/**
 * .env Config File
 */
//TODO Remove .env , use CLI args
module.exports={
    port: process.env.PORT,
    url:process.env.URL,
    dbname:process.env.DBNAME,
    collection:process.env.COLLECTION
};