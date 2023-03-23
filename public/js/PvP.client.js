let symbol = 'X';
let obj = {};
const matches = ['XXX','OOO'];

/**
 * first move is made by 'X'
 */
function makeMove(){
    $('#'+this.id).attr('disabled', true);
    $('#' + this.id).text(symbol);
    checkBoard(symbol);
    /**
     * changes symbol 'X' to 'O' , else 
     * symbol 'O' to 'X'
     */
    symbol = symbol=='X' ? 'O' : 'X';  
}

/**
 * 
 * @returns object containing state of the board (where 'X' and 'O' are located)
 */
function getBoardState(){
    $('.cell').each(function(index){
        obj[$(this).attr('id')]= $(this).text();
    });
    return obj;
}

/**
 * 
 * @param {char} symbol checks if symbol won 
 */
function checkBoard(symbol){
    const obj = getBoardState();
    /**
     * winning combinations 
     */
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
    /**
     * check for win
     */
    for(const element of winCombination){
        if(element==matches[0] || element==matches[1]){
            alert(`Winner is ${symbol}`);
            console.log(`Winner is ${symbol}`);
            $('.cell').attr('disabled', true);     
            return ;           
        };
    }
    /**
     * check for draw
     */
    for(const i in obj){
        if(obj[i]==""){
            console.log("Empty Space !");
            return ;
        }
    }
    alert("Draw!");
}

$(document).ready(function () {
    $(".cell").on('click',makeMove);
});