// script.js

// Game variables
let targetNumber;
let attempts = 0;
const maxAttempts = 10;
const previousGuesses = [];

// DOM elements
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const messageDisplay = document.getElementById('message');
const guessList = document.getElementById('guessList');
const restartButton = document.getElementById('restartButton');

// Start a new game
function startGame() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    previousGuesses.length = 0; // Clear previous guesses
    messageDisplay.textContent = 'Guess a number between 1 and 100!';
    guessList.innerHTML = '';
    restartButton.style.display = 'none';
}

// Check the user's guess
const checkGuess = () => {
    const userGuess = Number(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        messageDisplay.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    attempts++;
    previousGuesses.push(userGuess);
    
    const listItem = document.createElement('li');
    listItem.textContent = userGuess;
    guessList.appendChild(listItem);

    if (userGuess === targetNumber) {
        endGame(true);
    } else if (attempts >= maxAttempts) {
        endGame(false);
    } else {
        messageDisplay.textContent = userGuess > targetNumber ? 'Too high!' : 'Too low!';
    }
    
    guessInput.value = ''; // Clear input field
};

// End the game
const endGame = (isWin) => {
    if (isWin) {
        messageDisplay.textContent = `Congratulations! You guessed the number ${targetNumber} in ${attempts} attempts!`;
        saveScore(attempts);
    } else {
        messageDisplay.textContent = `Game over! The correct number was ${targetNumber}.`;
    }
    
    guessButton.disabled = true; // Disable button after game ends
    restartButton.style.display = 'block'; // Show restart button
};

// Save score to localStorage
const saveScore = (score) => {
    const highScore = localStorage.getItem('highScore') || Infinity;
    
    if (score < highScore) {
        localStorage.setItem('highScore', score);
        alert(`New high score: ${score} attempts!`);
    }
};

// Event listeners
guessButton.addEventListener('click', checkGuess);
restartButton.addEventListener('click', startGame);

// Initialize game on page load
startGame();
