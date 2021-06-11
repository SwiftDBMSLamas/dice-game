/*

author: Allan Aranzaso

*/

/* 
    todo: add animation
    add 6 images (dice)
*/
//gather document elements
const btnNewGame        = document.getElementById('btn-newGame');
const btnRollDice       = document.getElementById('btn-rollDice');
const btnPlayAgain      = document.getElementById('btn-playAgain');
const btnClosePopUp     = document.getElementById('close-pop-up');
const currentDate       = document.getElementById("dateTime");
const playerName        = document.getElementById('playerName');
const playerScore       = document.getElementById('playerScore');
const playerFinalScore  = document.getElementById('playerFinalScore');
const compFinalScore    = document.getElementById('compFinalScore');
const compScore         = document.getElementById('compScore');
const prevPage          = document.getElementById("go-back");
const popup             = document.getElementById('gameOver-pop-up');
const popupWinner       = document.getElementById('gameOver-winner-h2');
const timeNow           = new Date();
const diceDelay         = 1500;
const maxVal            = 6;
const defaultScore      = 0;
const lastRound         = 3;

currentDate.innerHTML += `${timeNow.toDateString()}`;
// hides the popup until game is over
popup.style.display = 'none';
btnRollDice.style.cursor = "default";

//todo: refactor code to remove global variables
let gameRound = 0;
let humanPlayer;
let computerPlayer;
let computerTurn;
let playerTurn = true;

let totalScore = 0;
let compTotalScore = 0;
let turnInterval;

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
        
        let score = getScore(firstRoll, secondRoll);

        playerScore.textContent = score;

        totalScore += score;
        playerFinalScore.textContent = totalScore;

        playerTurn = false;
        computerTurn = true;
        if(gameRound === 2){
            totalScore = defaultScore;
        }
        console.log(`${this.name}\'s roll was: ${firstRoll.value}, ${secondRoll.value} for a total of: ${score}`);
    }
}

class Computer {
    rollDice( firstRoll, secondRoll ){

        let score = getScore(firstRoll, secondRoll);

        //display current rolled dice score
        compScore.textContent = score;

        //add and display the total score for the game so far
        compTotalScore += score;
        compFinalScore.textContent = compTotalScore;
        //end turn
        gameRound++;
        computerTurn = false;
        playerTurn = true;

        if(gameRound === lastRound){
            playerTurn = false;
            getWinner();
            compTotalScore = defaultScore;
        }
        console.log(`Computer\'s roll was: ${firstRoll.value}, ${secondRoll.value} for a total of: ${score}`);
    }
}

/*
    computes the score for the pair of dice rolled
    firstRoll - the value of the first die rolled, between 1-6 randomly
    secondRoll - the value of the second die rolled, between 1-6 randomly
    Returns the score for that round
*/
function getScore( firstRoll, secondRoll ){
    let score;
    let roll1    = firstRoll.value;
    let roll2    = secondRoll.value;
    //todo: add a result if it's a tie
    if( roll1 === 1 || roll2 === 1){
        score = defaultScore;
    }else if( roll1 === roll2 ){
        score = (roll1 + roll2) * 2;
    }else{
        score = roll1 + roll2;
    }
    return score;
}

function getWinner() {
    popup.style.display = 'block';
    if(compFinalScore.textContent > playerFinalScore.textContent){
        popupWinner.textContent = "Computer wins!";
    }else{
        popupWinner.textContent = `${playerName.textContent} wins!`;
    }
    btnRollDice.disabled = true;
};

btnNewGame.addEventListener('click', function(){
    let nameOfPlayerPrompt = window.prompt("Please enter your name");
    
    if(nameOfPlayerPrompt.length === 0){
        nameOfPlayerPrompt = window.prompt('Field cannot be empty');
    }

    playerName.innerHTML = nameOfPlayerPrompt;
    humanPlayer = new Player(nameOfPlayerPrompt);
    computerPlayer = new Computer();

    btnNewGame.disabled = true;
    
    btnRollDice.disabled = false;
    
    if(btnRollDice.disabled == false){
        btnRollDice.style.cursor = "pointer";
        btnNewGame.style.cursor = "default";
    }
    //reset the game when user clicks the button
    if(btnNewGame.textContent === "Reset Game"){
        resetTheGame();
    }
});

btnRollDice.addEventListener('click', function(){
    // if for any reason the obj is undefined.. alert the user
    if(humanPlayer === undefined){
        alert('Please click new game first!');
    }
    // change button text to reset game
    btnNewGame.disabled = false;
    btnNewGame.textContent = "Reset Game";
    btnNewGame.style.cursor = "pointer";
    
    takeTurns();
});

btnPlayAgain.addEventListener('click', function(){
    popup.style.display = 'none';
    resetTheGame();

});

btnClosePopUp.addEventListener('click', function(){
    popup.style.display = 'none';
    clearInterval(turnInterval);
});


function takeTurns(){
    
    turnInterval = setInterval(() => {
        
        let firstDie = new Dice();
        let secondDie = new Dice();
        let thirdDie = new Dice();
        let fourthDie = new Dice();

        if(playerTurn){
            humanPlayer.rollDice(firstDie, secondDie);
        }else if(computerTurn){
            computerPlayer.rollDice(thirdDie, fourthDie);
        }
    }, diceDelay);
};

// Reset the game to default values
function resetTheGame(){
    gameRound = 0;
    playerFinalScore.textContent = defaultScore;
    compFinalScore.textContent = defaultScore;
    playerScore.textContent = defaultScore;
    compScore.textContent = defaultScore;
    playerTurn = true;
    btnNewGame.textContent = "New Game";

    clearInterval(turnInterval);
};

prevPage.addEventListener('click', function(){
    if(history != undefined){
        console.log('Goin back in time!');
        history.back();
    }
});