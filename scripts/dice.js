/*
    author: Allan Aranzaso
*/
//gather document elements
const btnNewGame            = document.getElementById('btn-newGame');
const btnRollDice           = document.getElementById('btn-rollDice');
const btnPlayAgain          = document.getElementById('btn-playAgain');
const btnResetGame          = document.getElementById('btn-resetGame');
const btnClosePopUp         = document.getElementById('close-pop-up');
const playerName            = document.getElementById('playerName');
const playerCurrentScore    = document.getElementById('playerScore');
const playerFinalScore      = document.getElementById('playerFinalScore');
const compFinalScore        = document.getElementById('compFinalScore');
const compCurrentScore      = document.getElementById('compScore');
const prevPage              = document.getElementById("go-back");
const popup                 = document.getElementById('gameOver-pop-up');
const popupWinner           = document.getElementById('gameOver-winner-h2');
const diceImg1              = document.getElementById('dice1');
const diceImg2              = document.getElementById('dice2');
const diceImgComp1          = document.getElementById('dice3');
const diceImgComp2          = document.getElementById('dice4');
const playerRolled          = document.getElementById('playerRoll');
const compRolled            = document.getElementById('compRoll');
const roundNumber           = document.getElementById('round');

const popupDelay            = 150;
const windowDelay           = 200;
const maxDiceVal            = 6;
const defaultScore          = 0;
const lastRound             = 3;
const fadeDelay             = 50;
const minOpacity            = 0.1;
const maxOpacity            = 1;
const opacityFactor         = 0.1;

// hides the popup until game is over
popup.style.display         = 'none';
btnRollDice.style.cursor    = "default";
btnResetGame.style.cursor   = "default";

let gameRound           = 0;
let playerTurn          = true;
let humanPlayer;
let computerPlayer;
let computerTurn;

let totalScore          = 0;
let compTotalScore      = 0;
let opaque              = 0.1;
let opFadeOut           = 1;


class Dice {
    constructor(){
        this.value = Math.floor(Math.random() * 6) + 1;
    }
}

class Player {
    constructor( name ){
        this.name = name;
    }
    rollDice( firstRoll, secondRoll ){
        //store the score for the player's round
        let scoreForRound = getScore(firstRoll, secondRoll);

        diceImg1.src = `images/dice${firstRoll.value}.png`;
        diceImg2.src = `images/dice${secondRoll.value}.png`;
        
        //display current rolled dice score
        playerCurrentScore.textContent   = scoreForRound;
        //add and display the total score for the game so far
        totalScore                      += scoreForRound;
        playerFinalScore.textContent     = totalScore;

        //end turn
        endPlayerTurn(true);
        const consoleLogMsg = `${this.name}\'s roll was: ${firstRoll.value}, ${secondRoll.value} for a total of: ${scoreForRound} points`;
        console.log(consoleLogMsg);
    }
}

class Computer {
    rollDice( firstRoll, secondRoll ){

        let scoreForRound   = getScore(firstRoll, secondRoll);
        diceImgComp1.src    = `images/dice${firstRoll.value}.png`;
        diceImgComp2.src    = `images/dice${secondRoll.value}.png`;

        //display current rolled dice score
        compCurrentScore.textContent = scoreForRound;

        //add and display the total score for the game so far
        compTotalScore              += scoreForRound;
        compFinalScore.textContent   = compTotalScore;
        //end turn
        gameRound++;
        endPlayerTurn(false);

        if(gameRound === lastRound){
            playerTurn = false;
            getWinner();
        }
        const consoleLogMsg = `Computer\'s roll was: ${firstRoll.value}, ${secondRoll.value} for a total of: ${scoreForRound}`;
        console.log(consoleLogMsg);
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

    if( roll1 === 1 || roll2 === 1 ){
        score = defaultScore;
    }else if( roll1 === roll2 ){
        score = (roll1 + roll2) * 2;
    }else{
        score = roll1 + roll2;
    }
    return score;
}

function getWinner() {
    // fade in the popup
    startTimer = setTimeout(() => {
        fadeIn();
    }, popupDelay);
    
    const computerWinsMsg           = "Computer wins!";
    const tieMsg                    = "It's a tie!";
    const playerWinsMsg             = `You win!`;
    const computerFinalScoreInt     = parseInt(compFinalScore.textContent);
    const playerFinalScoreInt       = parseInt(playerFinalScore.textContent);

    // allow the fade in to come first
    setTimeout(() => {
        popup.style.display = 'block';
        if(computerFinalScoreInt > playerFinalScoreInt){
            popupWinner.textContent = computerWinsMsg;
        }else if(computerFinalScoreInt == playerFinalScoreInt){
            popupWinner.textContent = tieMsg;
        }else if(computerFinalScoreInt < playerFinalScoreInt){
            popupWinner.textContent = playerWinsMsg;
        } 
    }, windowDelay);
    buttonStateEnabled(btnRollDice, false);
};

//
// buttons
//
btnNewGame.addEventListener('click', function(){
    const enterNameMsg     = `Please enter your name`;
    const errorNameMsg     = `Field cannot be empty. Please click new game to try again`;
    let nameOfPlayerPrompt = window.prompt(enterNameMsg);
    
    if(nameOfPlayerPrompt.length === 0){
        alert(errorNameMsg);
        return;
    }
    playerName.innerHTML = nameOfPlayerPrompt;

    //create the objects when user clicks button
    humanPlayer = new Player(nameOfPlayerPrompt);
    computerPlayer = new Computer();

    buttonStateEnabled(btnRollDice, true);
    buttonStateEnabled(btnResetGame, true);
    buttonStateEnabled(btnNewGame, false);
});

btnRollDice.addEventListener('click', function(){
    // if for any reason the obj is undefined.. alert the user
    const alertbtnMsg = `Please click new game first!`;
    if(humanPlayer === undefined){
        alert(alertbtnMsg);
        return;
    }
    buttonStateEnabled(btnNewGame, false);
    buttonStateEnabled(btnResetGame, true);
    takeTurns(); 
});

btnResetGame.addEventListener('click', function(){
    location.reload();
});

btnPlayAgain.addEventListener('click', function(){
    fadeOut();
    location.reload();
});

btnClosePopUp.addEventListener('click', function(){
    fadeOut();
    buttonStateEnabled(btnRollDice, false);
});
// function that allows you to set the button state to disabled or enabled
// must have retrieved the button ID from the DOM first using getElementByID
function buttonStateEnabled(btnID, isEnabled) {
    if(isEnabled){
        btnID.disabled      = false;
        btnID.style.cursor  = "pointer";
        return;
    }
    btnID.disabled      = true;
    btnID.style.cursor  = "default";
}
// flags whose turn it is
// passes in boolean- isTurnOver. True if player turn is over. Otherwise false.
function endPlayerTurn(isTurnOver){
    if(isTurnOver){
        playerTurn = false;
        computerTurn = true;
        return;
    }
    playerTurn = true;
    computerTurn = false;
}
// rotates turns between player and computer
function takeTurns(){

    let firstDie = new Dice();
    let secondDie = new Dice();
    let thirdDie = new Dice();
    let fourthDie = new Dice();

    const displayGameRound = `Round: ${gameRound + 1}`
    const youRolled        = `You rolled`;
    const compRolledMsg    = `Computer rolled`;

    roundNumber.textContent = displayGameRound;

    //rotate player turns
    if(playerTurn){
        humanPlayer.rollDice(firstDie, secondDie);
        playerRolled.textContent = youRolled;
    }else if(computerTurn){
        computerPlayer.rollDice(thirdDie, fourthDie);
        compRolled.textContent = compRolledMsg;
    }
};

prevPage.addEventListener('click', function(){
    if(history != undefined){
        const notImplAlert = 'Sorry, this button doesn\'t do much.. yet :)';
        alert(notImplAlert);
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