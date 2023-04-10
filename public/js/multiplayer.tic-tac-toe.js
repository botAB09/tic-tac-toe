const 
socket = io();

//render turn message to the connected clients
function renderTurnMessage(turn){
    if(!turn){
        $("#turn").text("Your Opponent's Turn");
        $('.cell').attr('disabled', true); 
    }
    else{
        $("#turn").text("Your Turn");
        $('.cell').removeAttr('disabled');     
    }
}

//emits socket event to server , when player makes a move
function makeMove(){
    if($(this).text().length){
        return ;
    }
    socket.emit('player.move',this.id)    
}

//creates a board state object comprising of player symbol position on the board
function getBoardState(){
    const boardState = {};
    $('.cell').each(function(index){
        boardState[$(this).attr('id')]= $(this).text();
    });
    return boardState;
}

socket.on("connect", () => {
    console.log(socket.id);
});
socket.on("game.begin",playerData=>{
    console.log(playerData)
    $("#symbol").text(`Your Symbol : ${playerData.symbol}`);
    renderTurnMessage(playerData.turn);
});
socket.on("move.made",data=>{
    console.log(data);
    $("#"+data.position).text(data.symbol);
    const gameBoard = getBoardState();
    if(!data.turn){
        socket.emit("game.state.check",gameBoard);
    }
})
socket.on("game.state",gameState=>{
    console.log(gameState);
    if(gameState.Win){
        $("#turn").text("You Win!");
        socket.emit("game.end","Win");
    }
    else if(gameState.Loss){
        $("#turn").text("You Loose!");
        socket.emit("game.end","Loss");
    }
    else if(gameState.Draw){
        $("#turn").text("Draw!... reload for New Game!");
        $('.cell').attr('disabled', true);
        socket.emit("game.end","draw");       
    }
    else{
        renderTurnMessage(gameState.turn);
        return;
    }
    $('.cell').attr('disabled', true);
})
socket.on("opponent.left",()=>{
    $("#turn").text("Your Opponent Left , reload for New Game!");
    $('.cell').attr('disabled', true);  
})
$(document).ready(function () {
    $('form').on('submit',function fetchUser(e){
        e.preventDefault();
        $('form').css('display','none');
        $('#gameboard').css('display','block');
        const name = $("input[name='username']",this).val();
        socket.emit("username",name);
    });
    $('.cell').attr('disabled', true);     
    $(".cell").on('click',makeMove);
});
