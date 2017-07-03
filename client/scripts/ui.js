var stageFunctions = {
	"link": console.log,
	"download": console.log,
	"orbit": console.log,
	"move": console.log,
	"zoom-in": console.log,
	"zoom-out": console.log,
	"settings": console.log,
	"rotate": console.log,
	"paint": console.log,
	"edit": console.log,
	"view": console.log,
	"share": console.log
}
var stageLists = {
	"r34": ["tool"],
	"root": ["view", "edit", "share"],
	"view": ["orbit", "move", "zoom-in", "zoom-out"],
	"edit": ["rotate", "paint"],
	"share": ["link", "download"]
}

var mode = "";
var tool = "";

var stages = document.getElementsByClassName("UIStage");
for (var ii = 0; ii < stageLists["root"].length; ii++) {
	var elementToHide = document.getElementById(stageLists["root"][ii]);
	elementToHide.style.display = "flex";
	elementToHide.style.order = ii.toString();
}
console.log(stages);
var largeButtonListener = function (event) {
	var buttonId = event.target.parentNode.id;
	/*if (stageLists[buttonId] !== undefined) {
		if (keyHistory.length === 0) {
			var oldKey = "root";
			document.getElementById("back").style.display = "flex";
		} else var oldKey = keyHistory[keyHistory.length - 1];
		for (var ii = 0; ii < stageLists[oldKey].length; ii++) {
			var elementToHide = document.getElementById(stageLists[oldKey][ii]);
			elementToHide.style.display = "";
			elementToHide.style.order = "";
		}
		var newKey = buttonId;
		keyHistory.push(newKey);
		for (var ii = 0; ii < stageLists[newKey].length; ii++) {
			var elementToShow = document.getElementById(stageLists[newKey][ii]);
			elementToShow.style.order = ii.toString();
			elementToShow.style.display = "flex";
		}
	} else if (buttonId === "back") {
		var oldKey = keyHistory.pop();
		for (var ii = 0; ii < stageLists[oldKey].length; ii++) {
			var elementToHide = document.getElementById(stageLists[oldKey][ii]);
			elementToHide.style.display = "";
			elementToHide.style.order = "";
		}
		if (keyHistory.length === 0) {
			var newKey = "root";
			document.getElementById("back").style.display = "";
		} else var newKey = buttonId;
		for (var ii = 0; ii < stageLists[newKey].length; ii++) {
			var elementToShow = document.getElementById(stageLists[newKey][ii]);
			elementToShow.style.order = ii.toString();
			elementToShow.style.display = "flex";
		}
	}*/
	if (buttonId === mode) {
		resetMode();
	} else if (stageLists[buttonId] !== undefined) {
		if (mode !== "") resetMode();
		setMode(buttonId);
	} else if (buttonId === tool) {
		resetTool();
	} else {
		if (tool !== "") resetTool();
		setTool(buttonId);
	}
	if (stageFunctions[buttonId] !== undefined) {
		stageFunctions[buttonId](buttonId);
	}
}
var setTool = function (newTool) {
	document.getElementById(newTool).getElementsByClassName("icon")[0].style.opacity = "1";
	tool = newTool;
}
var resetTool = function () {
	document.getElementById(tool).getElementsByClassName("icon")[0].style.opacity = "";
	tool = "";
}
var setMode = function (newMode) {
	for (var ii = 0; ii < stageLists[newMode].length; ii++) {
		var elementToShow = document.getElementById(stageLists[newMode][ii]);
		elementToShow.style.order = ii.toString();
		elementToShow.style.display = "flex";
	}
	document.getElementById(newMode).getElementsByClassName("icon")[0].style.opacity = "1";
	mode = newMode;
}
var resetMode = function () {
	for (var ii = 0; ii < stageLists[mode].length; ii++) {
		var elementToHide = document.getElementById(stageLists[mode][ii]);
		elementToHide.style.display = "";
		elementToHide.style.order = "";
	}
	document.getElementById(mode).getElementsByClassName("icon")[0].style.opacity = "";
	mode = "";
}

var largeButtons = document.getElementsByClassName("largeButton");
var largeButtonsCount = largeButtons.length;
for (var ii = 0; ii < largeButtonsCount; ii++) {
	largeButtons[ii].addEventListener("mousedown", largeButtonListener);
}