const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const previousGuesses = document.getElementById('previousGuesses');
const highScoreDisplay = document.getElementById('highScore');

let secretNumber;
let attemptsRemaining = 10;
let guesses = [];
let highScore = localStorage.getItem('highScore') || Infinity; // Get high score from localStorage or set to infinity if none

// Function to generate a random number
function generateSecretNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

// Function to start a new game
function startGame() {
    secretNumber = generateSecretNumber();
    attemptsRemaining = 10;
    guesses = [];
    guessInput.value = ''; // Clear input field
    message.textContent = '';
    previousGuesses.textContent = '';
    guessInput.focus(); // Put focus on the input field
    highScoreDisplay.textContent = `High Score: ${highScore === Infinity ? 'N/A' : highScore}`;
}

startGame(); // Start the game when the script loads

guessButton.addEventListener('click', checkGuess);

// ... (Rest of the game logic will go here)
function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    // Input Validation
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = "Please enter a valid number between 1 and 100.";
        return; // Stop execution
    }

    guesses.push(userGuess);
    previousGuesses.textContent = `Previous Guesses: ${guesses.join(', ')}`;

    if (userGuess === secretNumber) {
        endGame(true);
    } else {
        attemptsRemaining--;
        if (attemptsRemaining === 0) {
            endGame(false);
        } else {
            message.textContent = userGuess < secretNumber ? "Too low!" : "Too high!";
        }
    }
    guessInput.value = ''; // Clear input field
    guessInput.focus();
}

function endGame(win) {
    guessInput.disabled = true;
    guessButton.disabled = true;

    if (win) {
        message.textContent = `You won! You guessed the number in ${guesses.length} attempts.`;
        if (guesses.length < highScore) {
            highScore = guesses.length;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = `New High Score: ${highScore}`;
        }
    } else {
        message.textContent = `You lost! The number was ${secretNumber}.`;
    }

    // Add a "Play Again" button or reset functionality here.  This is a good exercise for you.
}