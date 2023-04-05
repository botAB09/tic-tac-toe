const db = require('./db.utility');
/**
 * websocket utility class :
 *      -- creates the game board 
 *      -- manages socket and emits websocket event for each connected user
 */
class SOCKETUTIL{
    static opponent;
    static player = {};
    /**
     * 
     * @param {object} socket 
     * creates the game by assigning opponent , symbol and username to each socket connected 
     *  -- stores the player data in key:value pair 
     *  -- each user is stored in "player" object with key as socket.id 
     *     properties of each player[socket.id] object :
     *          -- symbol: contains the user symbol for the board
     *          -- opponent: is null initially ; when another user connects then available sockets are connected 
     *          -- socket: stores the socket object 
     *          -- username: stores the username of each connected user
     */

    static createGame(socket){
        console.log(SOCKETUTIL.opponent);
        SOCKETUTIL.player[socket.id] = {
            symbol : 'X',
            opponent : SOCKETUTIL.opponent,
            socket : socket,
            username : ''
        }
        if(SOCKETUTIL.opponent){
            SOCKETUTIL.player[socket.id].symbol = 'O';
            SOCKETUTIL.player[SOCKETUTIL.opponent].opponent = socket.id;
            SOCKETUTIL.opponent = null;
        }
        else{
            SOCKETUTIL.opponent = socket.id;
        }
    }
    /**
     * 
     * @param {object} socket 
     * @returns the socket object of the opponent property of "player" object
     */
    static getOpponent(socket){
        if(SOCKETUTIL.player[socket.id].opponent){
            return SOCKETUTIL.player[SOCKETUTIL.player[socket.id].opponent].socket;
        }
        return false;
    }
    /**
     * 
     * @param {object} socket 
     * main driver function of websockets ;
     * -- createGame() function for both the connected user is called ; then 
     * -- getOpponent() checks for available opponents
     *    -- if yes then , socket event is emitted to begin the game and load the game board 
     * -- if player makes a valid move , then socket event is emitted to display the move 
     * 
     */
    static socketHandler(socket){
        console.log(`A User Connected ${socket.id}`);
        SOCKETUTIL.createGame(socket); 
        if(SOCKETUTIL.getOpponent(socket)){
            socket.emit('game.begin',{
                symbol : SOCKETUTIL.player[socket.id].symbol
            })
            SOCKETUTIL.getOpponent(socket).emit('game.begin',{
                symbol : SOCKETUTIL.player[SOCKETUTIL.getOpponent(socket).id].symbol
            })
        }
        socket.on('player.move',player_postition=>{
            console.log(SOCKETUTIL.player[socket.id]);
            console.log("A move was made",player_postition);
            socket.emit('move.made',player_postition);
            SOCKETUTIL.getOpponent(socket).emit('move.made',player_postition);
        })
        socket.on("username",username=>{
            SOCKETUTIL.player[socket.id].username = username;
        })
        socket.on("game.end",gameState=>{
            db.addUser(SOCKETUTIL.player[socket.id],gameState);
        })
        socket.on("disconnect",data=>{
            console.log(data);
            if(SOCKETUTIL.getOpponent(socket)){
                SOCKETUTIL.getOpponent(socket).emit('opponent.left');
            }
        });
    }
}
module.exports = SOCKETUTIL;
