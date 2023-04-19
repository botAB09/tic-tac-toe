/**
 *@param {object} client validates database schema and creates the rules for database with following properties 
 * ---properties : 
 *      -username  : "string"
 *      -win : "int"
 *      -loss : "int"
 *      -draw : "int"
 */
const createGameSchema = async(client)=>{
    await client.db(process.env.dbname).createCollection('gameUsers',{
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
                    email: {
                        bsonType: "string"
                    },
                    password: {
                        bsonType: "string"       
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
