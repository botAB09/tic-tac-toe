const
{dbname} = require('../../config/env-config');

/**
 * 
 * @param {object} client Created Tic Tac Toe Schema
 */
const createGameSchema = async(client)=>{
    await client.db(dbname).createCollection("gameUsers",{
        validator: {
            $jsonSchema: {
                bsonType: "object",
                title: "Tic Tac Toe Object Validation",
                required: ["username"],
                properties: {
                    username: {
                        bsonType: "string",
                        description: "username must be string and is required"
                    },
                    Win: {
                        bsonType: "int",
                        minimum: 0,
                        description: "Win must be integer"
                    },
                    Loss: {
                        bsonType: "int",
                        minimum: 0,
                        description: "Loss must be integer"
                    },
                    Draw: {
                        bsonType: "int",
                        minimum: 0,
                        description: "Draw must be integer"
                    }
                }
            }
        }
    })
}
module.exports = createGameSchema;