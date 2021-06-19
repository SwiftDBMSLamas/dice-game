/*
    author: Allan Aranzaso
*/
//gather document elements
const btnNewGame        = document.getElementById('btn-newGame');
const btnRollDice       = document.getElementById('btn-rollDice');
const btnPlayAgain      = document.getElementById('btn-playAgain');
const btnResetGame      = document.getElementById('btn-resetGame');
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
const playerRolled      = document.getElementById('playerRoll');
const compRolled        = document.getElementById('compRoll');

const timeNow           = new Date();
const popupDelay        = 150;
const windowDelay       = 200;
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
btnResetGame.style.cursor = "default";

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
let timeoutHandler;


class Dice {
    constructor(){
        this.value  = Math.floor(Math.random() * 6) + 1;
    }
}

class Player {
    constructor( name ){
        this.name = name;
    }
    rollDice( firstRoll, secondRoll ){
        let score = getScore(firstRoll, secondRoll);
        diceImg1.src = `images/dice${firstRoll.value}.png`;
        diceImg2.src = `images/dice${secondRoll.value}.png`;
        
        //display current rolled dice score
        playerScore.textContent = score;
        //add and display the total score for the game so far
        totalScore += score;
        playerFinalScore.textContent = totalScore;

        //end turn
        endPlayerTurn(true);
        const consoleLogMsg = `${this.name}\'s roll was: ${firstRoll.value}, ${secondRoll.value} for a total of: ${score} points`;
        console.log(consoleLogMsg);
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
        endPlayerTurn(false);

        if(gameRound === lastRound){
            const gameRdConsolMsg = `Round: ${gameRound}`;
            console.log(gameRdConsolMsg);
            playerTurn = false;
            getWinner();
        }
        const consoleLogMsg = `Computer\'s roll was: ${firstRoll.value}, ${secondRoll.value} for a total of: ${score}`;
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
    
    const computerWinsMsg = "Computer wins!";
    const tieMsg          = "It's a tie!";
    const playerWinsMsg   = `${playerName.textContent} wins!`;
    // allow the fade in to come first
    setTimeout(() => {
        popup.style.display = 'block';
        if(compFinalScore.textContent > playerFinalScore.textContent){
            popupWinner.textContent = computerWinsMsg;
        }else if(compFinalScore.textContent === playerFinalScore.textContent){
            popupWinner.textContent = tieMsg;
        }else{
            popupWinner.textContent = playerWinsMsg;
        } 
    }, windowDelay);
    buttonState(btnRollDice, false);
};

//
// buttons
//
btnNewGame.addEventListener('click', function(){
    const enterNameMsg     = `Please enter your name`;
    const errorNameMsg     = `Field cannot be empty`;
    let nameOfPlayerPrompt = window.prompt(enterNameMsg);
    
    if(nameOfPlayerPrompt.length === 0){
        nameOfPlayerPrompt = window.prompt(errorNameMsg);
    }
    
    playerName.innerHTML = nameOfPlayerPrompt;
    //create the player objects when user clicks button
    humanPlayer = new Player(nameOfPlayerPrompt);
    computerPlayer = new Computer();

    buttonState(btnRollDice, true);
    buttonState(btnResetGame, true);
    buttonState(btnNewGame, false);
});

btnRollDice.addEventListener('click', function(){
    // if for any reason the obj is undefined.. alert the user
    const alertbtnMsg = `Please click new game first!`;
    if(humanPlayer === undefined){
        alert(alertbtnMsg);
    }
    // change button text to reset game
    btnNewGame.disabled = false;
    btnResetGame.disabled = false;
    btnNewGame.style.cursor = "pointer";

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
    buttonState(btnRollDice, true);
});
function rotateTheDice(){
    // maybe add an animation to rotate the dice after game over for added effect?
}
function buttonState(btnID, isEnabled) {
    if(isEnabled){
        btnID.disabled = false;
        btnID.style.cursor = "pointer";
        return;
    }
    btnID.disabled = true;
    btnID.style.cursor = "default";
}

function endPlayerTurn(isTurnOver){
    if(isTurnOver){
        playerTurn = false;
        computerTurn = true;
        return;
    }
    playerTurn = true;
    computerTurn = false;
}
function takeTurns(){

    let firstDie = new Dice();
    let secondDie = new Dice();
    let thirdDie = new Dice();
    let fourthDie = new Dice();

    const displayGameRound = `Round: ${gameRound + 1}`
    const youRolled        = `You rolled`;
    const compRolled       = `Computer rolled`;
    //rotate player turns
    if(playerTurn){
        compRolled.textContent = displayGameRound;
        humanPlayer.rollDice(firstDie, secondDie);
        playerRolled.textContent = youRolled;
    }else if(computerTurn){
        playerRolled.textContent = displayGameRound;
        computerPlayer.rollDice(thirdDie, fourthDie);
        compRolled.textContent = compRolled;
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