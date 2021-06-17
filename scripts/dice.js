/*

author: Allan Aranzaso

*/

/* 
    todo: add animation (popup & dice)
    fix tables to look better
    add toggle animation for help?
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
const diceImg1          = document.getElementById('dice1');
const diceImg2          = document.getElementById('dice2');
const diceImgComp1      = document.getElementById('dice3');
const diceImgComp2      = document.getElementById('dice4');
const timeNow           = new Date();
const diceDelay         = 1500;
const maxVal            = 6;
const defaultScore      = 0;
const lastRound         = 3;
const fadeDelay         = 50;
const minOpacity        = 0.1;
const maxOpacity        = 1;
const opacityFactor     = 0.1;

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
let opaque = 0.1;
let opFadeOut = 1;

class Dice {
    constructor(){
        this.value  = Math.floor(Math.random() * 6) + 1;
    }
}
let getRoll = 0;
let get2Roll = 0;
class Player {
    constructor( name ){
        this.name = name;
    }
    rollDice( firstRoll, secondRoll ){
        
        let score = getScore(firstRoll, secondRoll);
        diceImg1.src = `images/dice${firstRoll.value}.png`;
        diceImg2.src = `images/dice${secondRoll.value}.png`;
        getRoll = getFirstRoll(firstRoll);
        get2Roll = get2ndRoll(secondRoll);
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
        diceImgComp1.src = `images/dice${firstRoll.value}.png`;
        diceImgComp2.src = `images/dice${secondRoll.value}.png`;

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

function getFirstRoll(firstRoll) {
    let retVal = firstRoll.value;
    return retVal;
}
function get2ndRoll(secondRoll) {
    return secondRoll.value;
}

function getWinner() {
    fadeIn();
    popup.style.display = 'block';
    if(compFinalScore.textContent > playerFinalScore.textContent){
        popupWinner.textContent = "Computer wins!";
    }else if(compFinalScore.textContent === playerFinalScore.textContent){
        popupWinner.textContent = "Tie!";
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

    // timeoutHandler = setTimeout(() => {
    //     console.log('in!')
    //     diceAnimHandler = requestAnimationFrame( shuffleDice );
    // },100);

    // if for any reason the obj is undefined.. alert the user
    if(humanPlayer === undefined){
        alert('Please click new game first!');
    }
    // change button text to reset game
    btnNewGame.disabled = false;
    btnNewGame.textContent = "Reset Game";
    btnNewGame.style.cursor = "pointer";

    // turnInterval = setInterval(() => {
    //     clearTimeout(timeoutHandler);
    //     diceImg1.src = `images/dice${getRoll}.png`;
    //     diceImg2.src = `images/dice${get2Roll}.png`;
    // }, 3000);
    takeTurns(); 
});

btnPlayAgain.addEventListener('click', function(){
    fadeOut(100);
    popup.style.display = 'none';
    resetTheGame();
});

btnClosePopUp.addEventListener('click', function(){
    fadeOut();
    popup.style.display = 'none';
    // clearInterval(turnInterval);
    
});
let currentDiceNumber = 0;
function shuffleDice(){
    currentDiceNumber++;
    if(currentDiceNumber > 6){
        currentDiceNumber = 1;
    }
    if(playerTurn){
        diceImg1.src = `images/dice${currentDiceNumber}.png`;
        diceImg2.src = `images/dice${currentDiceNumber}.png`; 
    }else if(computerTurn){
        diceImgComp1.src = `images/dice${currentDiceNumber}.png`; 
        diceImgComp2.src = `images/dice${currentDiceNumber}.png`; 
    }
    

    timeoutHandler = setTimeout(function() {
        diceAnimHandler = requestAnimationFrame( shuffleDice );
    }, 100);
}
let timeoutHandler;
function takeTurns(){
    
    
        
        let firstDie = new Dice();
        let secondDie = new Dice();
        let thirdDie = new Dice();
        let fourthDie = new Dice();

        if(playerTurn){
            humanPlayer.rollDice(firstDie, secondDie);
            
        }else if(computerTurn){
            computerPlayer.rollDice(thirdDie, fourthDie);
        }
};

// Reset the game to default values
function resetTheGame(){
    gameRound = 0;
    playerFinalScore.textContent = defaultScore;
    compFinalScore.textContent = defaultScore;
    playerScore.textContent = defaultScore;
    compScore.textContent = defaultScore;
    playerName.textContent = "Player 1";
    playerTurn = true;
    btnNewGame.textContent = "New Game";

    // clearInterval(turnInterval);
};

prevPage.addEventListener('click', function(){
    if(history != undefined){
        console.log('Goin back in time!');
        history.back();
    }
});

//allows popup to fade in
function fadeIn(customDelay = fadeDelay){
    let intervalPopupHndlr;
    intervalPopupHndlr = setInterval(() => {
        if(opaque >= maxOpacity) {
            clearInterval(intervalPopupHndlr);
        }
        popup.style.opacity = opaque;
        opaque += opaque * opacityFactor;
    }, customDelay);
}

//allows popup to fade out
function fadeOut(customDelay = fadeDelay){
    let intervalBtnCloseHndlr;
    intervalBtnCloseHndlr = setInterval(() => {
        if(opFadeOut <= minOpacity) {
            clearInterval(intervalBtnCloseHndlr);
            popup.style.display = "none";
        }
        popup.style.opacity = opFadeOut;
        opFadeOut -= opFadeOut * opacityFactor;
    }, customDelay);
}