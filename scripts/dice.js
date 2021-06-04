/*

author: Allan Aranzaso

*/

const btnNewGame        = document.getElementById('btn-newGame');
const btnRollDice       = document.getElementById('btn-rollDice');
const currentDate       = document.getElementById("dateTime");
const playerName        = document.getElementById('playerName');
const prevPage          = document.getElementById("go-back");
const timeNow           = new Date();

currentDate.innerHTML += `${timeNow.toString()} ${timeNow.getMonth()} ${timeNow.getDate()}, ${timeNow.getFullYear()}`;


prevPage.addEventListener('click', function(){
    if(history != undefined){
        console.log('Goin back in time!');
        history.back();
    }
});

btnNewGame.addEventListener('click', function(){
    let nameOfPlayerPrompt = window.prompt("Enter your name");
    playerName.innerHTML = nameOfPlayerPrompt;
});

btnRollDice.addEventListener('click', function(){
    alert('Not implemented yet');
});