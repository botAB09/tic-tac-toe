const DbUtil = require('../../utilities/db.utility'),
  bcrypt = require('bcrypt'),
  saltRounds = 10;

class DbUser extends DbUtil {
  constructor() {
    super();
  }
  /**
   *
   * @param {string} username username of the client connected to the game board;
   * @returns the user statistics { Win , Loss , Draws} of the entered username .
   */
  async getUserStats(username) {
    try {
      return await this.collection
        .find({ username }, { projection: { _id: 0 } })
        .toArray();
    } catch (err) {
      throw new Error('Error Occured in getUSerStats function db.js', err);
    }
  }

  async addUser(userData) {
    //check if user already exists ..
    const hashedpassword = await new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(userData.password, salt, function (err,hash) {
          // Store hash in your password DB.
          if (err) {
            reject(err);
          }
          resolve(hash);
        });
      });
    });
    await this.collection.insertOne({
      username: userData.username,
      email: userData.email,
      password: hashedpassword,
      Win: 0,
      Loss: 0,
      Draw: 0,
    });
  }

  async isExistingUser(username) {
    return this.collection
      .find({
        username,
      })
      .limit(1)
      .toArray();
  }

  async checkUserAuth(userData) {
    try {
      const existingUser = await this.isExistingUser(userData.username);
      if (existingUser.length) {
        return await bcrypt.compare(
          userData.password,
          existingUser[0].password
        );
      }
      return false;
    } catch (err) {
      console.log(err);
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
  async updateUserScore(userData, gameState) {
    try {
      const username = userData.username;
      //if game state is "Win" then increment the Win field in db by +1;
      if (gameState === "Win") {
        await this.collection.updateOne(
          { username },
          {
            $inc: {
              Win: 1,
            },
          },
          { upsert: true }
        );
      }
      //if game state is "Loss" then increment the Win field in db by +1;
      else if (gameState === "Loss") {
        await this.collection.updateOne(
          { username },
          {
            $inc: {
              Loss: 1,
            },
          },
          { upsert: true }
        );
      }
      //if game state is "Draw" then increment the Win field in db by +1;
      else {
        await this.collection.updateOne(
          { username },
          {
            $inc: {
              Draw: 1,
            },
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.log("Error: While updating records in the database", err);
    }
  }
}
module.exports = new DbUser();
