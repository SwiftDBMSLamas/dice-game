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