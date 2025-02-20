// script.js

// Variables and Data Types
const maxAttempts = 10;
let attempts = 0;
let targetNumber = Math.floor(Math.random() * 100) + 1;
let previousGuesses = [];
let gameStatus = {
    isWon: false,
    attempts: 0,
    score: 0
};

// DOM Elements
const guessInput = document.getElementById('guessInput');
const submitGuessBtn = document.getElementById('submitGuess');
const message = document.getElementById('message');
const previousGuessesEl = document.getElementById('previousGuesses');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const restartGameBtn = document.getElementById('restartGame');

// Functions
const startGame = () => {
    attempts = 0;
    previousGuesses = [];
    targetNumber = Math.floor(Math.random() * 100) + 1;
    gameStatus.isWon = false;
    gameStatus.attempts = 0;
    updateUI();
};

const checkGuess = (guess) => {
    try {
        if (isNaN(guess)) {
            throw new Error("Please enter a valid number.");
        }

        guess = Number(guess);
        attempts++;
        previousGuesses.push(guess);

        if (guess === targetNumber) {
            gameStatus.isWon = true;
            gameStatus.score = maxAttempts - attempts + 1;
            message.textContent = `Correct! You guessed the number in ${attempts} attempts.`;
            saveScore(gameStatus.score);
            endGame();
        } else if (guess > targetNumber) {
            message.textContent = "Too high!";
        } else {
            message.textContent = "Too low!";
        }

        updateUI();

        if (attempts >= maxAttempts && !gameStatus.isWon) {
            message.textContent = `Game over! The correct number was ${targetNumber}.`;
            endGame();
        }
    } catch (error) {
        message.textContent = error.message;
    }
};

const endGame = () => {
    guessInput.disabled = true;
    submitGuessBtn.style.display = 'none';
    restartGameBtn.style.display = 'block';
};

const updateUI = () => {
    previousGuessesEl.textContent = `Previous guesses: ${previousGuesses.join(', ')}`;
    attemptsLeftEl.textContent = `Attempts left: ${maxAttempts - attempts}`;
};

const saveScore = (score) => {
    const highestScore = localStorage.getItem('highestScore') || 0;
    if (score > highestScore) {
        localStorage.setItem('highestScore', score);
    }
};

const loadScore = () => {
    const highestScore = localStorage.getItem('highestScore');
    if (highestScore) {
        message.textContent += ` Highest Score: ${highestScore}`;
    }
};

// Event Listeners
submitGuessBtn.addEventListener('click', () => {
    const guess = guessInput.value;
    checkGuess(guess);
    guessInput.value = '';
});

restartGameBtn.addEventListener('click', () => {
    startGame();
    guessInput.disabled = false;
    submitGuessBtn.style.display = 'block';
    restartGameBtn.style.display = 'none';
});

// Initialize Game
startGame();
loadScore();