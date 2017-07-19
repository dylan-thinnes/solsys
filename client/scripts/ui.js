var ArbNum = function (value, length) {
	this.length = length === undefined ? 100 : length;
	this.buffer = new ArrayBuffer(this.length);
	this.reader = new Uint8Array(this.buffer);
	this.value = value;
}
Object.defineProperties(ArbNum.prototype, {
	'value': {
		get: function () {
			return this.reader.slice().reverse().join('');
		},
		set: function (newValue) {
			if (newValue.constructor === String) {
				var minLength = newValue.length > this.length ? this.length : newValue.length;
				for (var ii = 0; ii < minLength; ii++) {
					this.reader[ii] = parseInt(newValue[minLength - ii - 1]);
				}
			} else if (newValue.constructor === Array || newValue.constructor === Uint8Array || newValue.constructor === Uint8ClampedArray) {
				var minLength = newValue.length > this.length ? this.length : newValue.length;
				for (var ii = 0; ii < minLength; ii++) {
					this.reader[ii] = parseInt(newValue[ii]);
				}
			}
		}
	}
});
ArbNum.prototype.setDigit = function (place, newDigit) {
	if (place < this.length) this.reader[place] = newDigit;
}
ArbNum.prototype.getDigit = function (place) {
	if (place >= this.length) return 0;
	return this.reader[place];
}
ArbNum.prototype.addDigit = function (place, operand) {
	var res = this.getDigit(place) + operand;
	if (res > 9) {
		this.setDigit(place, res - 10);
		this.addDigit(place + 1, 1);
	} else {
		this.setDigit(place, res);
	}
}
ArbNum.prototype.subtractDigit = function (place, operand) {
	var res = this.getDigit(place) - operand;
	if (res < 0) {
		this.setDigit(place, 10 + res);
		this.subtractDigit(place + 1, 1);
	} else {
		this.setDigit(place, res);
	}
}
ArbNum.prototype.add = function (operand) {
	if (operand.constructor !== ArbNum) var operand = new ArbNum(operand);
	var minLength = operand.length > this.length ? this.length : operand.length;
	for (var ii = 0; ii < minLength; ii++) {
		this.addDigit(ii, operand.getDigit(ii));
	}
}
ArbNum.prototype.subtract = function (operand) {
	if (operand.constructor !== ArbNum) var operand = new ArbNum(operand);
	var minLength = operand.length > this.length ? this.length : operand.length;
	for (var ii = 0; ii < minLength; ii++) {
		this.subtractDigit(ii, operand.getDigit(ii));
	}
}

var Seed = function (input) {
	this.input = input;
	this.type = this.NUMBER;
	var inputLength = input.length;
	var codePoints = [];
	var maxCodePoint = 57;
	for (var ii = 0; ii < inputLength; ii++) {
		codePoints[ii] = input.codePointAt(ii);
		if (codePoints[ii] > maxCodePoint || codePoints[ii] < 48) maxCodePoint = codePoints[ii];
	}
	if (maxCodePoint === 57) {
		this.result = this.input;
	} else {
		if (maxCodePoint < 256) {
			this.type = this.ASCII;
			var buffer = new ArrayBuffer(inputLength);
			var reader = new Uint8Array(buffer);
		} else if (maxCodePoint < 65536) {
			this.type = this.UTF16;
			var buffer = new ArrayBuffer(inputLength * 2);
			var reader = new Uint16Array(buffer);
		} else if (maxCodePoint < 4294967296) {
			this.type = this.UTF32;
			var buffer = new ArrayBuffer(inputLength * 4);
			var reader = new Uint32Array(buffer);
		}
		for (var ii = 0; ii < inputLength; ii++) reader[ii] = codePoints[ii];
	}
	return reader;
}
Seed.prototype.NUMBER = 0;
Seed.prototype.ASCII = 1;
Seed.prototype.UTF16 = 2;
Seed.prototype.UTF32 = 3;


var Buttons = function () {
	this.buttons = {}
	this.groups = {}
}
Buttons.prototype.newButton = function (name, group, element, disableDefaultHandling, onCallback, offCallback) {
	this.buttons[name] = {
		name: name,
		group: group,
		element: element,
		onCallback: onCallback,
		offCallback: offCallback,
		icon: element.getElementsByClassName("icon")[0],
		on: false
	}
	if (disableDefaultHandling !== true) element.addEventListener("mousedown", this.buttonToggle.bind(this, name));
	if (group !== undefined) {
		if (this.groups[group] === undefined) this.newGroup(group, onCallback, offCallback);
		this.groups[group].buttons.push(name);
	}
}
Buttons.prototype.newGroup = function (name, onCallback, offCallback, displayType, preserveState) {
	this.groups[name] = {
		name: name,
		onCallback: onCallback,
		offCallback: offCallback,
		on: false,
		buttons: [],
		displayType: (displayType === undefined ? "flex" : displayType),
		preserveState: (preserveState ? true : false)
	}
}
Buttons.prototype.showGroup = function (name) {
	for (var ii = 0; ii < this.groups[name].buttons.length; ii++) {
		this.buttons[this.groups[name].buttons[ii]].element.style.display = this.groups[name].displayType;
	}
}
Buttons.prototype.hideGroup = function (name) {
	for (var ii = 0; ii < this.groups[name].buttons.length; ii++) {
		this.buttons[this.groups[name].buttons[ii]].element.style.display = "";
		if (this.buttons[this.groups[name].buttons[ii]].on) {
			if (this.groups[name].preserveState) {
				if (typeof this.buttons[this.groups[name].buttons[ii]].offCallback === "function") this.buttons[this.groups[name].buttons[ii]].offCallback(this.groups[name].buttons[ii], event);
			} else {
				this.buttonOff(this.groups[name].buttons[ii]);
			}
		}
	}
}
Buttons.prototype.unfocusGroup = function (name) {
	for (var ii = 0; ii < this.groups[name].buttons.length; ii++) {
		this.buttonOff(this.groups[name].buttons[ii]);
	}
}
Buttons.prototype.unfocusButton = function (name) {
	if (name === undefined) var name = this.lastFocusedButtonName;
	this.buttons[name].icon.style.opacity = "";
}
Buttons.prototype.focusButton = function (name) {
	this.lastFocusedButtonName = name;
	this.buttons[name].icon.style.opacity = "1";
}
Buttons.prototype.buttonOn = function (name, event) {
	if (this.buttons[name].on === false) {
		if (this.groups[this.buttons[name].group] !== undefined) this.unfocusGroup(this.buttons[name].group);
		this.buttons[name].on = true;
		console.log(name, this.buttons[name].group, "button on");
		this.focusButton(name);
		if (typeof this.buttons[name].onCallback === "function") this.buttons[name].onCallback(name, event);
	}
}
Buttons.prototype.buttonOff = function (name, event) {
	if (this.buttons[name].on === true) {
		this.buttons[name].on = false;
		console.log(name, this.buttons[name].group, "button off");
		this.unfocusButton(name);
		if (typeof this.buttons[name].offCallback === "function") this.buttons[name].offCallback(name, event);
	}
}
Buttons.prototype.buttonToggle = function (name, event) {
	if (this.buttons[name].on === true) this.buttonOff(name, event);
	else this.buttonOn(name, event);
}
Buttons.prototype.groupOn = function (name, event) {
	this.groups[name].on = true;
	console.log(name, "group on");
	this.showGroup(name);
	if (typeof this.groups[name].onCallback === "function") this.groups[name].onCallback(name, event);
}
Buttons.prototype.groupOff = function (name, event) {
	this.groups[name].on = false;
	console.log(name, "group off");
	this.hideGroup(name);
	if (typeof this.groups[name].offCallback === "function") this.groups[name].offCallback(name, event);
}
Buttons.prototype.groupToggle = function (name, event) {
	if (this.groups[name].on === true) this.groupOff(name, event);
	else this.groupOn(name, event);
}
document.body.onload = function () {
	var stage1 = new Buttons();
	var stage2 = new Buttons();

	stage1.newGroup("root");
	stage1.newButton("view", "root", document.getElementById("view"), false, stage2.groupToggle.bind(stage2, "view"), stage2.groupToggle.bind(stage2, "view"));
	stage1.newButton("edit", "root", document.getElementById("edit"), false, stage2.groupToggle.bind(stage2, "edit"), stage2.groupToggle.bind(stage2, "edit"));
	stage1.newButton("share", "root", document.getElementById("share"), false, stage2.groupToggle.bind(stage2, "share"), stage2.groupToggle.bind(stage2, "share"));

	stage2.newButton("orbit", "view", document.getElementById("orbit"));
	stage2.newButton("move", "view", document.getElementById("move"));
	stage2.newButton("zoom-in", "view", document.getElementById("zoom-in"));
	stage2.newButton("zoom-out", "view", document.getElementById("zoom-out"));
	stage2.newButton("rotate", "edit", document.getElementById("rotate"));
	stage2.newButton("paint", "edit", document.getElementById("paint"));
	stage2.newButton("seed", "edit", document.getElementById("seed"), true);
	stage2.newButton("link", "share", document.getElementById("link"));
	stage2.newButton("download", "share", document.getElementById("download"));
	stage2.newButton("reddit", "share", document.getElementById("reddit"));
	stage2.newButton("facebook", "share", document.getElementById("facebook"));
	stage2.newButton("twitter", "share", document.getElementById("twitter"));

	stage1.showGroup("root");

	/*var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
	var seed = MQ.MathField(document.getElementById("seed"), {
		supSubsRequireOperand: true,
		substituteTextarea: function () {
			var sub = document.createElement("textarea");
			var newAttr = document.createAttribute("autocapitalize");
			newAttr.value = "off";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("autocomplete");
			newAttr.value = "off";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("autocorrect");
			newAttr.value = "off";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("spellcheck");
			newAttr.value = "false";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("x-palm-disable-ste-all");
			newAttr.value = "true";
			sub.setAttributeNode(newAttr);
			var escapeBackslash = function (event) {
				console.log(event.key);
				if (event.key === "\\") {
					console.log("stopping propagation");
					console.log(document.activeElement === event.target);
					event.stopPropagation();
					event.stopImmediatePropagation();
				}
			}
			return sub;
		}
	});*/
	document.getElementById("seed").addEventListener("keypress", function (event) {
		if (event.keyCode === 13 || event.charCode === 13) {
			event.preventDefault();
			console.log(new Seed(event.target.innerHTML));
		}
	});
}