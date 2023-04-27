const db = require("../database/src/db.method"),
  socket_options = require("../constants/constants");
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
class Socket {
  static opponent;
  static player = {};
  /**
   * creates the game by assigning opponent , symbol and username to each socket connected
   * stores the player data in key:value pair
   * each user is stored in "player" object with key as socket.id
   * @param {object} socket
   */
  static createGame(socket) {
    if(Socket.opponent && socket.request.session.username === Socket.player[Socket.opponent].username){
      const delOppKey = Socket.opponent;
      delete Socket.player[delOppKey];
      Socket.opponent = null;
    }
    Socket.player[socket.id] = {
      symbol: "X",
      opponent: Socket.opponent,
      socket: socket,
      username: socket.request.session.username,
      turn: true,
    };
    if (Socket.opponent) {
      Socket.player[socket.id].symbol = "O";
      Socket.player[socket.id].turn = false;
      Socket.player[Socket.opponent].opponent = socket.id;
      Socket.opponent = null;
    } else {
      Socket.opponent = socket.id;
    }
  }

  /**
   * check if an opponent exist for the respective socket.id
   * @param {object} socket 
   * @returns the opponent socket id 
   */
  static getOpponent(socket) {
    if (Socket.player[socket.id].opponent) {
      return Socket.player[Socket.player[socket.id].opponent].socket;
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
  /**
   * main driver function of the socket logic
   * @param {object} socket 
   */
  static socketHandler(socket) {
    Socket.createGame(socket);
    if (Socket.getOpponent(socket)) {
      socket.emit(socket_options.begin, {
        symbol: Socket.player[socket.id].symbol,
        turn: Socket.player[socket.id].turn,
      });
      Socket.getOpponent(socket).emit(socket_options.begin, {
        symbol: Socket.player[Socket.getOpponent(socket).id].symbol,
        turn: Socket.player[Socket.getOpponent(socket).id].turn,
      });
    }

    socket.on(socket_options.move, (player_postition) => {
      if (Socket.player[socket.id].turn) {
        Socket.player[socket.id].turn = false;
        Socket.player[Socket.getOpponent(socket).id].turn = true;
        socket.emit(socket_options.move_made, {
          position: player_postition,
          turn: Socket.player[socket.id].turn,
          symbol: Socket.player[socket.id].symbol,
        });
        Socket.getOpponent(socket).emit(socket_options.move_made, {
          position: player_postition,
          turn: Socket.player[Socket.getOpponent(socket).id].turn,
          symbol: Socket.player[socket.id].symbol,
        });
      }
    });

    socket.on(socket_options.state_check, (gameBoard) => {
      if (Socket.isWinner(gameBoard)) {
        socket.emit(socket_options.state, {
          Win: true,
          Loss: false,
          Draw: false,
          turn: Socket.player[socket.id].turn,
        });
        Socket.getOpponent(socket).emit(socket_options.state, {
          Win: false,
          Loss: true,
          Draw: false,
          turn: Socket.player[Socket.getOpponent(socket).id].turn,
        });
      } else if (Socket.isDraw(gameBoard)) {
        socket.emit(socket_options.state, {
          Win: false,
          Loss: false,
          Draw: true,
          turn: Socket.player[socket.id].turn,
        });
        Socket.getOpponent(socket).emit(socket_options.state, {
          Win: false,
          Loss: false,
          Draw: true,
          turn: Socket.player[Socket.getOpponent(socket).id].turn,
        });
      } else {
        socket.emit(socket_options.state, {
          Win: false,
          Loss: false,
          Draw: false,
          turn: Socket.player[socket.id].turn,
        });
        Socket.getOpponent(socket).emit(socket_options.state, {
          Win: false,
          Loss: false,
          Draw: false,
          turn: Socket.player[Socket.getOpponent(socket).id].turn,
        });
      }
    });
    socket.on(socket_options.end, (gameState) => {
      db.updateUserScore(Socket.player[socket.id], gameState);
    });
    socket.on(socket_options.disconnect, () => {
      if (Socket.getOpponent(socket)) {
        Socket.getOpponent(socket).emit(socket_options.opponent_left);
      }
    });
  }
}
module.exports = Socket;
