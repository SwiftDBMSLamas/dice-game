/*

author: Allan Aranzaso

*/

const btnNewGame        = document.getElementById('btn-newGame');
const btnRollDice       = document.getElementById('btn-rollDice');
const currentDate       = document.getElementById("dateTime");
const playerName        = document.getElementById('playerName');
const playerScore       = document.getElementById('playerScore');
const compScore         = document.getElementById('compScore');
const prevPage          = document.getElementById("go-back");
const timeNow           = new Date();

currentDate.innerHTML += `${timeNow.toDateString()}`;
//todo: refactor code to remove global variables
let gameRound = 0;
const maxVal = 6;
let nameOfPlayerPrompt;
let humanPlayer;
let computerPlayer;
let btnRollDiceClicked = false;
let computerTurn;
let playerTurn = true;
let gameOver = false;

class Dice {
    constructor(){
        this.value  = Math.round(Math.random() * 6) + 1;
        //todo: add images
    }
}

class Player {
    constructor( name ){
        this.name = name;
    }
    rollDice( firstRoll, secondRoll ){
        let score;
        let totalScore = 0;
        playerScore.innerHTML = "";
        if(playerTurn){
            if( firstRoll.value === 1 || secondRoll.value === 1) {
                score = 0;
            }else if( firstRoll.value === secondRoll.value ) {
                score = (firstRoll.value + secondRoll.value) * 2;
            }else {
                score = firstRoll.value + secondRoll.value;
            }
            playerScore.innerHTML += `${score}`;
            gameRound++;
            if(gameRound === 3){
                computerTurn = true;
                gameRound = 0;
                playerTurn = false;
            }
            //todo: add scores together at the end
            totalScore += score;
            console.log(totalScore);
        }
    }
}

class Computer {
    rollDice( firstRoll, secondRoll ){
        let score;
        compScore.innerHTML = "";
        if(computerTurn){
            if( firstRoll.value === 1 || secondRoll.value === 1) {
                score = 0;
            }else if( firstRoll.value === secondRoll.value ) {
                score = (firstRoll.value + secondRoll.value) * 2;
            }else {
                score = firstRoll.value + secondRoll.value;
            }
            compScore.innerHTML += `  ${score}`;
            gameRound++;
            if(gameRound === 3){
                computerTurn = false;
                gameOver = true;
            }
        }
    }
}

btnNewGame.addEventListener('click', function(evt){
    nameOfPlayerPrompt = window.prompt("Enter your name");
    
    playerName.innerHTML = nameOfPlayerPrompt;
    humanPlayer = new Player(nameOfPlayerPrompt);
    computerPlayer = new Computer();

    btnNewGame.disabled = true;

    if(btnRollDiceClicked){
        btnNewGame.disabled = false;
    }
});

btnRollDice.addEventListener('click', function(){
    let firstDie = new Dice();
    let secondDie = new Dice();
    let thirdDie = new Dice();
    let fourthDie = new Dice();

    if(humanPlayer === undefined){
        //todo: disable btn until new game is clicked
        alert('Please click new game first!');
    }

    btnRollDiceClicked = true;
    if(btnRollDiceClicked){
        btnNewGame.disabled = false;
    }
    
    humanPlayer.rollDice(firstDie, secondDie);
    computerPlayer.rollDice(thirdDie, fourthDie);
    //todo: automaticaly roll the dice three times, call function to compare winner, display winner with try again button
});

prevPage.addEventListener('click', function(){
    if(history != undefined){
        console.log('Goin back in time!');
        history.back();
    }
});