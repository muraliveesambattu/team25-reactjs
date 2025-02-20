// script.js

class Game {
    constructor() {
        this.targetNumber = null;
        this.guesses = [];
        this.attempts = 10;
        this.gameOver = false;
    }

    startGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.guesses = [];
        this.attempts = 10;
        this.gameOver = false;
        document.getElementById('message-area').innerText = 'Guess a number between 1 and 100!';
        document.getElementById('score-area').innerText = '';
    }

    checkGuess(guess) {
        if (this.gameOver) {
            return;
        }

        if (guess < this.targetNumber) {
            document.getElementById('message-area').innerText = 'Too low!';
        } else if (guess > this.targetNumber) {
            document.getElementById('message-area').innerText = 'Too high!';
        } else {
            document.getElementById('message-area').innerText = 'Correct!';
            this.gameOver = true;
            this.saveScore();
        }

        this.guesses.push(guess);
        this.attempts--;
        document.getElementById('score-area').innerText = `Attempts left: ${this.attempts}`;
    }

    saveScore() {
        const score = this.guesses.length;
        const highScore = localStorage.getItem('highScore');
        if (highScore === null || score < highScore) {
            localStorage.setItem('highScore', score);
            document.getElementById('message-area').innerText += ` New high score: ${score}!`;
        }
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('message-area').innerText = 'Game over!';
    }
}

const game = new Game();

document.getElementById('start-button').addEventListener('click', () => {
    game.startGame();
});

document.getElementById('submit-button').addEventListener('click', () => {
    const guess = parseInt(document.getElementById('guess-input').value);
    if (!isNaN(guess) && guess >= 1 && guess <= 100) {
        game.checkGuess(guess);
    } else {
        document.getElementById('message-area').innerText = 'Invalid input!';
    }
});