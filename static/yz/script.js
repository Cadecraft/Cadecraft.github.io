// Script for the YZ game
const recentVersion = "0.1.0";
const editDate = "2024/05/05";

// Data defaults
// Move data (indexed by Move ID)
const moves = [
	{
		name: "1's"
	},
	{
		name: "2's"
	},
	{
		name: "3's"
	},
	{
		name: "4's"
	},
	{
		name: "5's"
	},
	{
		name: "6's"
	},
	{
		name: "3 Of A Kind"
	},
	{
		name: "4 Of A Kind"
	},
	{
		name: "Full House"
	},
	{
		name: "Small Straight"
	},
	{
		name: "Large Straight"
	},
	{
		name: "YZ!"
	},
	{
		name: "Chance"
	},
	{
		name: "6 Of A Kind"
	}
];

// State defaults
let currentState = {
	scores_p1: [], // Move ID, points earned
	scores_p2: [],
	turnState: "p1"
};

// Generate the table by moves
const maintable = document.getElementById("maintable");
for (let i = 0; i < moves.length; i++) {
	const thisrow = document.createElement("tr");
	thisrow.id = "row_" + i;
	thisrow.innerHTML = (
		"<th>" + moves[i].name
		+ "</th> <th id=\"row_" + thisrow.id
		+ "_p1\">-</th> <th id=\"row_" + thisrow.id
		+ "_p2\">-</th>"
	);
	maintable.appendChild(thisrow);
}

// Update the state based on the click of the button and the current state
const mainbutton = document.getElementById("mainbutton");
mainbutton.addEventListener("click", () => {
	// Base
});
