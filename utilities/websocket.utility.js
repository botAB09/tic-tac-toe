const db = require("./db.utility");
//TODO login and user selection ; to play

/**
 * websocket utility class :
 *      -- creates the game
 *              creates the game by assigning opponent , symbol and username to each socket connected
 *                  -- stores the player data in key:value pair
 *                  -- each user is stored in "player" object with key as socket.id
 *              properties of each player[socket.id] object :
 *                  -- symbol: contains the user symbol for the board
 *                  -- opponent: is null initially ; when another user connects then available sockets are connected
 *                  -- socket: stores the socket object
 *                  -- username: stores the username of each connected user
 *
 *      -- manages socket and emits websocket event for each connected user
 *          socketHandler() :
 *              main driver function of websockets ;
 *                  -- createGame() function for both the connected user is called ; then
 *                  -- getOpponent() checks for available opponents
 *                      -- if yes then , socket event is emitted to begin the game and load the game board
 *                  -- if player makes a valid move , then socket event is emitted to display the move
 *
 */
class SOCKETUTIL {
  static opponent;
  static player = {};
  static createGame(socket) {
    console.log(SOCKETUTIL.opponent);
    SOCKETUTIL.player[socket.id] = {
      symbol: "X",
      opponent: SOCKETUTIL.opponent,
      socket: socket,
      username: socket.request.session.username,
      turn: true,
    };
    if (SOCKETUTIL.opponent) {
      SOCKETUTIL.player[socket.id].symbol = "O";
      SOCKETUTIL.player[socket.id].turn = false;
      SOCKETUTIL.player[SOCKETUTIL.opponent].opponent = socket.id;
      SOCKETUTIL.opponent = null;
    } else {
      SOCKETUTIL.opponent = socket.id;
    }
  }

  static getOpponent(socket) {
    if (SOCKETUTIL.player[socket.id].opponent) {
      return SOCKETUTIL.player[SOCKETUTIL.player[socket.id].opponent].socket;
    }
    return false;
  }

  /**
   *
   * @param {object} gameBoard contains position each player symbol on the game board
   * @returns true if winner is found ; else false
   */
  static isWinner(gameBoard) {
    const matches = ["XXX", "OOO"];
    const winCombination = [
      gameBoard.cell1 + gameBoard.cell2 + gameBoard.cell3,
      gameBoard.cell4 + gameBoard.cell5 + gameBoard.cell6,
      gameBoard.cell7 + gameBoard.cell8 + gameBoard.cell9,
      gameBoard.cell1 + gameBoard.cell5 + gameBoard.cell9,
      gameBoard.cell3 + gameBoard.cell5 + gameBoard.cell7,
      gameBoard.cell1 + gameBoard.cell4 + gameBoard.cell7,
      gameBoard.cell2 + gameBoard.cell5 + gameBoard.cell8,
      gameBoard.cell3 + gameBoard.cell6 + gameBoard.cell9,
    ];
    for (const element of winCombination) {
      if (element === matches[0] || element === matches[1]) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param {object} gameBoard contains position each player symbol on the game board
   * @returns true if game is drawn ; else false
   */
  static isDraw(gameBoard) {
    const val = Object.values(gameBoard);
    for (const element of val) {
      if (element === "") {
        return false;
      }
    }
    return true;
  }

  static socketHandler(socket) {
    console.log(`A User Connected ${socket.id}`);
    SOCKETUTIL.createGame(socket);
    if (SOCKETUTIL.getOpponent(socket)) {
      socket.emit("game.begin", {
        symbol: SOCKETUTIL.player[socket.id].symbol,
        turn: SOCKETUTIL.player[socket.id].turn,
      });
      SOCKETUTIL.getOpponent(socket).emit("game.begin", {
        symbol: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].symbol,
        turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn,
      });
    }

    socket.on("player.move", (player_postition) => {
      if (SOCKETUTIL.player[socket.id].turn) {
        SOCKETUTIL.player[socket.id].turn = false;
        SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn = true;
        socket.emit("move.made", {
          position: player_postition,
          turn: SOCKETUTIL.player[socket.id].turn,
          symbol: SOCKETUTIL.player[socket.id].symbol,
        });
        SOCKETUTIL.getOpponent(socket).emit("move.made", {
          position: player_postition,
          turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn,
          symbol: SOCKETUTIL.player[socket.id].symbol,
        });
      }
    });

    socket.on("game.state.check", (gameBoard) => {
      if (SOCKETUTIL.isWinner(gameBoard)) {
        socket.emit("game.state", {
          Win: true,
          Loss: false,
          Draw: false,
          turn: SOCKETUTIL.player[socket.id].turn,
        });
        SOCKETUTIL.getOpponent(socket).emit("game.state", {
          Win: false,
          Loss: true,
          Draw: false,
          turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn,
        });
      } else if (SOCKETUTIL.isDraw(gameBoard)) {
        socket.emit("game.state", {
          Win: false,
          Loss: false,
          Draw: true,
          turn: SOCKETUTIL.player[socket.id].turn,
        });
        SOCKETUTIL.getOpponent(socket).emit("game.state", {
          Win: false,
          Loss: false,
          Draw: true,
          turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn,
        });
      } else {
        socket.emit("game.state", {
          Win: false,
          Loss: false,
          Draw: false,
          turn: SOCKETUTIL.player[socket.id].turn,
        });
        SOCKETUTIL.getOpponent(socket).emit("game.state", {
          Win: false,
          Loss: false,
          Draw: false,
          turn: SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].turn,
        });
      }
    });
    socket.on("game.end", (gameState) => {
      db.updateUserScore(SOCKETUTIL.player[socket.id], gameState);
    });
    socket.on("disconnect", (disconn_data) => {
      console.log(disconn_data);
      if (SOCKETUTIL.getOpponent(socket)) {
        SOCKETUTIL.getOpponent(socket).emit("opponent.left");
      }
    });
  }
}
module.exports = SOCKETUTIL;
