let board = null;
let game = null;

function showStudentOptions() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('game-options').style.display = 'block';
}

function startChessLevel(level) {
    document.getElementById('game-options').style.display = 'none';
    document.getElementById('chessboard-container').style.display = 'block';
    startNewGame(level);
}

function startNewGame(level) {
    game = new Chess();  // Initialize a new Chess instance.
    board = Chessboard('chessboard', {
        draggable: true,
        dropOffBoard: 'snapback',
        onDrop: handleMove,
        orientation: 'white'
    });

    if (level !== 'beginner') {
        playAI();  // Make AI move if it is a level other than beginner.
    }
}

function playScenario() {
    // Load a specific scenario position.
    const scenarioPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    game = new Chess(scenarioPosition);
    board = Chessboard('chessboard', {
        draggable: true,
        dropOffBoard: 'snapback',
        onDrop: handleMove,
        position: scenarioPosition,
    });
}

function playAgainstAI() {
    document.getElementById('game-options').style.display = 'none';
    document.getElementById('chessboard-container').style.display = 'block';
    game = new Chess();
    board = Chessboard('chessboard', {
        draggable: true,
        dropOffBoard: 'snapback',
        onDrop: handleMove,
        orientation: 'white'
    });

    playAI();  // Start playing AI moves.
}

function handleMove(source, target) {
    // Make the player move.
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'  // Always promote to a queen for simplicity.
    });

    // Illegal move, return the piece back.
    if (move === null) {
        return 'snapback';
    }

    // If the game is not over, make an AI move after a delay.
    if (!game.game_over()) {
        setTimeout(playAI, 250);
    }
}

function playAI() {
    if (game.game_over()) return;

    // Get all possible moves for AI.
    const moves = game.ugly_moves();
    const randomIndex = Math.floor(Math.random() * moves.length);
    game.ugly_move(moves[randomIndex]);

    // Update board to reflect AI's move.
    board.position(game.fen());
}

function endGame() {
    document.getElementById('chessboard-container').style.display = 'none';
    document.getElementById('game-options').style.display = 'block';

    // Reset the chessboard instance to prevent showing the old state.
    if (board) {
        board.destroy();
    }
}

function updateLeaderboard(username, points) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ username, points });
    leaderboard.sort((a, b) => b.points - a.points);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.forEach(player => {
        console.log(`${player.username}: ${player.points} points`);
    });
}
