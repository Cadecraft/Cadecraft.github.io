// Script for the YZ game
const recentVersion = "0.1.0";
const editDate = "2024/05/05";

// Data defaults
// Move data (indexed by Move ID)
const MOVES = [
	{
		name: "1's" // 0
	},
	{
		name: "2's" // 1
	},
	{
		name: "3's" // 2
	},
	{
		name: "4's" // 3
	},
	{
		name: "5's" // 4
	},
	{
		name: "6's" // 5
	},
	{
		name: "3 Of A Kind" // 6
	},
	{
		name: "4 Of A Kind" // 7
	},
	{
		name: "Full House" // 8
	},
	{
		name: "Small Straight" // 9
	},
	{
		name: "Large Straight" // 10
	},
	{
		name: "YZ!" // 11
	},
	{
		name: "Chance" // 12
	},
	{
		name: "6 Of A Kind" // 13
	}
];
const MAX_ROLLS = 3;

// Document elements
const mainbutton = document.getElementById("mainbutton");
const maintable = document.getElementById("maintable");

// State defaults
let currentState = {
	scores_p1: {}, // Move ID: points earned
	scores_p2: {},
	turnPlayerId: 1, // 1 or 2
	turnRollNumber: 1, // 1 out of 3
	dice: [0, 0, 0, 0, 0, 0], // 1-6, or 0 for none
	diceLocked: [false, false, false, false, false, false],
	possibleMoves: {}, // Move ID: points that could be earned
	winner: -1 // -1 (the game is not finished), 1, 2, or 3 (tie)
};

// Reset the state to start a whole new game
function restartComplete() {
	currentState = {
		scores_p1: {},
		scores_p2: {},
		turnPlayerId: 1,
		turnRollNumber: 1,
		dice: [0, 0, 0, 0, 0, 0],
		diceLocked: [false, false, false, false, false, false],
		possibleMoves: {},
		winner: -1
	};
}

// Count the number of dice of a value that exist (not including the sixth one)
function countDice(diceValue) {
	let res = 0;
	for (let i = 0; i < 5; i++) {
		if (currentState.dice[i] == diceValue) res++;
	}
	return res;
}

// Sum all the dice
function sumDice() {
	let res = 0;
	for (let i = 0; i < 5; i++) res += currentState.dice[i];
	return res;
}

// Update the possibilities
function calculatePossibilities() {
	// Based on the requirements for each one
	currentState.possibleMoves = {};
	currentState.possibleMoves[0] = countDice(1);
	currentState.possibleMoves[1] = countDice(2) * 2;
	currentState.possibleMoves[2] = countDice(3) * 3;
	currentState.possibleMoves[3] = countDice(4) * 4;
	currentState.possibleMoves[4] = countDice(5) * 5;
	currentState.possibleMoves[5] = countDice(6) * 6;
	for (let v = 1; v <= 6; v++) if (countDice(v) >= 3) currentState.possibleMoves[6] = sumDice();
	for (let v = 1; v <= 6; v++) if (countDice(v) >= 4) currentState.possibleMoves[7] = sumDice();
	let type1 = currentState.dice[0];
	let type2 = type1;
	for (let i = 0; i < 5; i++) {
		if (currentState.dice[i] != type1) type2 = currentState.dice[i];
	}
	if (type1 == type2) {
		// YZ!
		currentState.possibleMoves[11] = 50;
		// TODO: add in 6th dice
	} else if ((countDice(type1) == 3 && countDice(type2) == 2) || (countDice(type1) == 2 && countDice(type2) == 3)) {
		// Full house
		currentState.possibleMoves[8] = 25;
	}
	// Small straight
	if (
		(countDice(1) >= 1 && countDice(2) >= 1 && countDice(3) >= 1 && countDice(4) >= 1)
		|| (countDice(2) >= 1 && countDice(3) >= 1 && countDice(4) >= 1 && countDice(5) >= 1)
		|| (countDice(3) >= 1 && countDice(4) >= 1 && countDice(5) >= 1 && countDice(6) >= 1)
	) {
		currentState.possibleMoves[9] = 30;
	}
	// Large straight
	if (
		(countDice(1) >= 1 && countDice(2) >= 1 && countDice(3) >= 1 && countDice(4) >= 1 && countDice(5) >= 1)
		|| (countDice(2) >= 1 && countDice(3) >= 1 && countDice(4) >= 1 && countDice(5) >= 1 && countDice(6) >= 1)
	) {
		currentState.possibleMoves[10] = 40;
	}
	// Chance
	currentState.possibleMoves[12] = sumDice();
}

// Roll the dice that have not been selected
function rollDice() {
	for (let i = 0; i < 5; i++) {
		if (!currentState.diceLocked[i]) {
			currentState.dice[i] = Math.floor(Math.random() * 6) + 1;
		}
	}
}

// Reset the dice for the next turn
function resetForNextTurn() {
	currentState.dice = [0, 0, 0, 0, 0, 0];
	currentState.diceLocked = [false, false, false, false, false, false];
	currentState.possibleMoves = {};
	currentState.turnRollNumber = 1;
}

// Commit a move (from clicking a rendered move button for the thisi-th move type)
function commitMove(thisi) {
	// If game already ended, cannot change anything
	if (currentState.winner != -1) return;
	// Add points
	if (currentState.turnPlayerId == 1) {
		if (thisi in currentState.possibleMoves) currentState.scores_p1[thisi] = currentState.possibleMoves[thisi];
		else currentState.scores_p1[thisi] = 0;
	} else {
		if (thisi in currentState.possibleMoves) currentState.scores_p2[thisi] = currentState.possibleMoves[thisi];
		else currentState.scores_p2[thisi] = 0;
	}
	resetForNextTurn();
	currentState.turnPlayerId = 3 - currentState.turnPlayerId;
	// Endgame check: set winner if necessary
	let isGameFinished = true;
	let finalscore_p1 = 0;
	let finalscore_p2 = 0;
	for (let i = 0; i < MOVES.length; i++) {
		if (!(i in currentState.scores_p1) || !(i in currentState.scores_p2)) {
			isGameFinished = false;
			break;
		}
		finalscore_p1 += currentState.scores_p1[i];
		finalscore_p2 += currentState.scores_p2[i];
	}
	if (isGameFinished) {
		// Set the winner
		// TODO: display the difference in scores when rendering the end screen?
		if (finalscore_p1 == finalscore_p2) {
			// Tie
			// TODO: handle tie: duel to the death of chance (whoever gets the first highest roll)?
			currentState.winner = 3;
		} else if (finalscore_p1 > finalscore_p2) {
			currentState.winner = 1;
		} else {
			currentState.winner = 2;
		}
	}
	// Render
	render();
}


// Render the page based on the current state
function render() {
	// Main bottom button
	if (currentState.winner != -1) {
		// Win screen
		// TODO: other features/styles?
		// TODO: screen rotation
		mainbutton.className = "bigmain button_p" + currentState.winner;
		if (currentState.winner == 3) {
			// Tie
			mainbutton.innerText = "Tie! - Restart";
		} else {
			mainbutton.innerText =
				"P" + currentState.winner + " Wins! - Restart";
		}
	} else {
		// Player turn/roll count
		// TODO: screen rotation
		mainbutton.className = "bigmain button_p" + currentState.turnPlayerId;
		if (currentState.turnRollNumber > MAX_ROLLS) {
			// TODO: disable button (make gray?)
			mainbutton.className = "bigmain button_disabled";
			mainbutton.innerText =
				"P" + currentState.turnPlayerId + " - Out of rolls";
		} else {
			// Currently rolling
			mainbutton.innerText =
				"P" + currentState.turnPlayerId + " - Roll " + currentState.turnRollNumber + "/" + MAX_ROLLS;

		}
	}
	// Dice
	for (let i = 0; i < 5; i++) {
		let imgsrc = "static/yz/img_dice_" + currentState.dice[i] + ".png";
		document.getElementById("dice_" + (i + 1)).src = imgsrc;
		document.getElementById("dice_" + (i + 1)).className =
			"diceimg " + (currentState.diceLocked[i] ? "diceimg_locked" : "diceimg_normal");
	}
	// Moves/possible moves
	for (let i = 0; i < MOVES.length; i++) {
		// Display buttons for this player and only scores for the other
		if (currentState.turnPlayerId == 1) {
			// Player 1
			document.getElementById("row_" + i + "_p1").innerHTML = "";
			if (i in currentState.scores_p1) {
				// Text: this many points earned
				document.getElementById("row_" + i + "_p1").innerText = currentState.scores_p1[i];
			} else if (i in currentState.possibleMoves) {
				// Button: this many points possible
				let newbutton = document.createElement("button");
				newbutton.className = "button_p1";
				newbutton.innerText = currentState.possibleMoves[i];
				let thisi = i;
				newbutton.addEventListener("click", () => {
					commitMove(thisi);
				});
				document.getElementById("row_" + i + "_p1").appendChild(newbutton);
			} else {
				// Button: zero points
				let newbutton = document.createElement("button");
				newbutton.className = "button_p1";
				newbutton.innerText = "0";
				let thisi = i;
				newbutton.addEventListener("click", () => {
					commitMove(thisi);
				});
				document.getElementById("row_" + i + "_p1").appendChild(newbutton);
			}
			// Other player's scores
			document.getElementById("row_" + i + "_p2").innerHTML = "";
			if (i in currentState.scores_p2) {
				// Text: this many points earned
				document.getElementById("row_" + i + "_p2").innerText = currentState.scores_p2[i];
			} else {
				// Text: blank
				document.getElementById("row_" + i + "_p2").innerText = "-";
			}
		} else {
			// Player 2
			document.getElementById("row_" + i + "_p2").innerHTML = "";
			if (i in currentState.scores_p2) {
				// Text: this many points earned
				document.getElementById("row_" + i + "_p2").innerText = currentState.scores_p2[i];
			} else if (i in currentState.possibleMoves) {
				// Button: this many points possible
				let newbutton = document.createElement("button");
				newbutton.className = "button_p2";
				newbutton.innerText = currentState.possibleMoves[i];
				let thisi = i;
				newbutton.addEventListener("click", () => {
					commitMove(thisi);
				});
				document.getElementById("row_" + i + "_p2").appendChild(newbutton);
			} else {
				// Button: zero points
				let newbutton = document.createElement("button");
				newbutton.className = "button_p2";
				newbutton.innerText = "0";
				let thisi = i;
				newbutton.addEventListener("click", () => {
					commitMove(thisi);
				});
				document.getElementById("row_" + i + "_p2").appendChild(newbutton);
			}
			// Other player's scores
			document.getElementById("row_" + i + "_p1").innerHTML = "";
			if (i in currentState.scores_p1) {
				// Text: this many points earned
				document.getElementById("row_" + i + "_p1").innerText = currentState.scores_p1[i];
			} else {
				// Text: blank
				document.getElementById("row_" + i + "_p1").innerText = "-";
			}
		}
	}
}

// Dice locking feature on click
for (let i = 0; i < 5; i++) {
	document.getElementById("dice_" + (i + 1)).addEventListener("click", () => {
		if (currentState.winner == -1 && (currentState.turnRollNumber == 2 || currentState.turnRollNumber == 3)) {
			currentState.diceLocked[i] = !currentState.diceLocked[i];
		}
		render();
	});
}

// Update the state based on the click of the button and the current state
mainbutton.addEventListener("click", () => {
	if (currentState.winner != -1) {
		// Winner already decided: restart the entire game
		restartComplete();
	} else {
		// Player turn/roll
		if (currentState.turnRollNumber > MAX_ROLLS) {
			// Cannot roll again: do nothing
		} else {
			// Roll
			rollDice();
			currentState.turnRollNumber++;
			calculatePossibilities();
		}
	}
	// Update state: possible moves, scores, etc.
	// Render
	render();
});

// PAGE SETUP: generate the table by moves
for (let i = 0; i < MOVES.length; i++) {
	const thisrow = document.createElement("tr");
	thisrow.innerHTML = (
		"<th>" + MOVES[i].name
		+ "</th> <th id=\"row_" + i
		+ "_p1\">-</th> <th id=\"row_" + i
		+ "_p2\">-</th>"
	);
	maintable.appendChild(thisrow);
}
// PAGE SETUP: initial render, etc.
resetForNextTurn();
render();
