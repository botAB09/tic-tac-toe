const 
socket = io(),
matches = ['XXX','OOO'];

let
turn = true,
symbol;

function renderTurnMessage(){
    if(!turn){
        $("#turn").text("Your Opponent's Turn");
        $('.cell').attr('disabled', true); 
    }
    else{
        $("#turn").text("Your Turn");
        $('.cell').removeAttr('disabled');     
    }
}
function makeMove(e){
    if(!turn || $(this).text().length){
        return ;
    }
    socket.emit('player.move',{
        symbol : symbol,
        position : this.id
    })    
}

/**
 * 
 * @returns object containing state of the board (where 'X' and 'O' are located)
 */
function getBoardState(){
    const obj = {};
    $('.cell').each(function(index){
        obj[$(this).attr('id')]= $(this).text();
    });
    return obj;
}

function checkBoard(){
    const obj = getBoardState();

    const winCombination = [
        obj.a1+obj.a2+obj.a3,
        obj.a4+obj.a5+obj.a6,
        obj.a7+obj.a8+obj.a9,
        obj.a1+obj.a5+obj.a9,
        obj.a3+obj.a5+obj.a7,
        obj.a1+obj.a4+obj.a7,
        obj.a2+obj.a5+obj.a8,
        obj.a3+obj.a6+obj.a9
    ];
    for(const element of winCombination){
        if(element===matches[0] || element===matches[1]){
            return true;           
        }
    }
    return false;
}

socket.on("connect", () => {
    console.log(socket.id);
});
socket.on("game.begin",data=>{
    symbol = data.symbol;
    $("#symbol").text(`Your Symbol : ${data.symbol}`);
    turn = (data.symbol === 'X');
    renderTurnMessage();
});
socket.on("move.made",data=>{
    $("#"+data.position).text(data.symbol);
    turn = (data.symbol !== symbol);
    console.log(checkBoard());
    if(!checkBoard()){
        renderTurnMessage();
        return ;
    }
    if(turn){
        $("#turn").text("You Loose!");
    }
    else{
        $("#turn").text("You Win!");

    }
    $('.cell').attr('disabled', true);
})
socket.on("opponent.left",()=>{
    $("#turn").text("Your Opponent Left , reload for New Game!");
    $('.cell').attr('disabled', true);  
})
$(document).ready(function () {
    $('.cell').attr('disabled', true);     
    $(".cell").on('click',makeMove);
});
