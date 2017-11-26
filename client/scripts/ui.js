// The ArbInt class, named to represent "Arbitrary Integer", is designed to represent numbers as a collection of digits inside TypedArrays (default length 100), allowing a theoretically unlimited number size. They can be added and subtracted to/from other ArbInts. The ArbInt class also contains a static property, POW2, an array which contains all powers of 2 in ArbInt form, up until 2^166.
var ArbInt = function (value, length) {
	this.length = length === undefined ? 100 : length;
	this.buffer = new ArrayBuffer(this.length);
	this.reader = new Uint8Array(this.buffer);
	this.value = value;
}
Object.defineProperties(ArbInt.prototype, {
	'value': {
		get: function () {
			var res = "";
			var inPadding = true;
			for (var ii = this.length - 1; ii >= 0; ii--) {
				if (this.reader[ii] === 0 && inPadding === true) continue;
				if (this.reader[ii] !== 0 && inPadding === true) inPadding = false;
				res += this.reader[ii].toString();
			}
			if (res.length === 0) res = "0";
			return res;
		},
		set: function (newValue) {
			if (newValue === undefined) {
				return;
			} else if (newValue.constructor === String) {
				var minLength = newValue.length > this.length ? this.length : newValue.length;
				for (var ii = 0; ii < minLength; ii++) {
					this.reader[ii] = parseInt(newValue[minLength - ii - 1]);
				}
			} else if (newValue.constructor === Array || newValue.constructor === Uint8Array || newValue.constructor === Uint8ClampedArray) {
				var minLength = newValue.length > this.length ? this.length : newValue.length;
				for (var ii = 0; ii < minLength; ii++) {
					this.reader[ii] = parseInt(newValue[ii]);
				}
			} else if (newValue.constructor === ArrayBuffer) {
				this.buffer = newValue.slice();
				this.reader = new Uint8Array(this.buffer);
				this.length = this.buffer.byteLength;
			}
		}
	}
});
ArbInt.prototype.setDigit = function (place, newDigit) {
	if (place < this.length) this.reader[place] = newDigit;
}
ArbInt.prototype.getDigit = function (place) {
	if (place >= this.length) return 0;
	return this.reader[place];
}
ArbInt.prototype.addDigit = function (place, operand) {
	var res = this.getDigit(place) + operand;
	if (res > 9) {
		this.setDigit(place, res - 10);
		this.addDigit(place + 1, 1);
	} else {
		this.setDigit(place, res);
	}
}
ArbInt.prototype.subtractDigit = function (place, operand) {
	var res = this.getDigit(place) - operand;
	if (res < 0) {
		this.setDigit(place, 10 + res);
		this.subtractDigit(place + 1, 1);
	} else {
		this.setDigit(place, res);
	}
}
ArbInt.prototype.add = function (operand) {
	if (operand.constructor !== ArbInt) var operand = new ArbInt(operand);
	var minLength = operand.length > this.length ? this.length : operand.length;
	for (var ii = 0; ii < minLength; ii++) {
		this.addDigit(ii, operand.getDigit(ii));
	}
}
ArbInt.prototype.subtract = function (operand) {
	if (operand.constructor !== ArbInt) var operand = new ArbInt(operand);
	var minLength = operand.length > this.length ? this.length : operand.length;
	for (var ii = 0; ii < minLength; ii++) {
		this.subtractDigit(ii, operand.getDigit(ii));
	}
}
ArbInt.prototype.duplicate = function () {

}
var newNum = new ArbInt("1");
ArbInt.POW2 = [newNum];
for (var ii = 0; ii < 167; ii++) {
	var oldNum = newNum;
	var newNum = new ArbInt(oldNum.buffer);
	newNum.add(oldNum);
	ArbInt.POW2.push(newNum);
}

// getRemoteBlueprint gets the solar system blueprint for any number from AWS blueprint API endpoint.
getRemoteBlueprint = function (number, callback) {
	number = (!isNaN(number) && number !== null) ? number.toString() : "1";
	var req = new XMLHttpRequest();
	req.open("GET", "https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/blue/?number=" + number.toString() + "&piXDepth=1");
	req.setRequestHeader("x-api-key", "LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM");
	req.onreadystatechange = function (event) {
		if (this.readyState === 4) {
			callback(JSON.parse(this.response));
		}
	}
	req.send();
}

// The Seed class is a class for creating ArbNums from strings that may or may not contain single-byte, double-byte, or quad-byte unicode characters. It analyzes the given input string and determines whether it is a number (type: Seed.NUMBER) or a string. If it is a string, the Seed class reads string as UTF-8 formatted, and turns each successive byte into a new set of 8 bits which are appended to the beginning of the previous set of bits. Once it is done with concatenating the bits of each byte in the string's representation, it reads those bits as a number and uses the ArbInt class to represent the final number as a string.
var Seed = function (input) {
	this.input = input;
	if (input === "") {
		this.value = 1;
		return;
	}
	var inputLength = input.length;
	var codePoints = [];
	var maxCodePoint = 57;
	for (var ii = 0; ii < inputLength; ii++) {
		codePoints[ii] = input.codePointAt(ii);
		if (codePoints[ii] > maxCodePoint || codePoints[ii] < 48) maxCodePoint = codePoints[ii];
	}
	if (maxCodePoint === 57) {
		this.result = new ArbInt(this.input);
		this.value = this.result.value;
	} else {
		this.result = new ArbInt();
		var currBitIndex = 0;
		for (var ii = 0; ii < inputLength; ii++) {
			var cursor = 0;
			var cursorMask = 1;	
			var smallLength = 0;
			if (codePoints[inputLength - ii - 1] < 256) smallLength = 8;
			else if (codePoints[inputLength - ii - 1] < 65536) smallLength = 16;
			else if (codePoints[inputLength - ii - 1] < 4294967296) smallLength = 32;
			else throw "codePoint out of bounds error!";
			while (cursor < smallLength) {
				if (codePoints[inputLength - ii - 1] & cursorMask) this.result.add(ArbInt.POW2[currBitIndex]);
				cursor++;
				currBitIndex++;
				cursorMask *= 2;
			}
		}
		this.value = this.result.value;
	}
}

// The Button classes Button and Radio serve to create "groups" of buttons, with each Radio object representing a singular group of buttons that are kept such that only one is focused at any given time.
var Radio = function (allOff, buttons) {
	this.allOff = allOff ? true : false; // Sets if all buttons being out of focus is an acceptable state.
	this.buttons = {};
	buttons = buttons ? Array.from(buttons) : [];
	for (var ii in buttons) {
		this.add(buttons[ii]);
	}
}
Radio.prototype.add = function (button) {
	var id = (Math.random() * Math.pow(2, 32)).toString(36);
	button.on("click", this.click.bind(this, id));
	this.buttons[id] = button;
}
Radio.prototype.click = function (id, event) {
	var emitterIsFocused = this.buttons[id].focused;
	for (var index in this.buttons) this.buttons[index].focused = false;
	if (!(emitterIsFocused && this.allOff)) this.buttons[id].focused = true; // As long as the emitter wasn't focused previously and allOff isn't permitted, focus the current button.
}


var Button = function (node, doNotCapture) {
	this.node = node;
	this.listeners = {};
	this.node.addEventListener("click", this.emit.bind(this, "click"));
	if (doNotCapture !== true) this.node.addEventListener("click", this.captureEvent.bind(this));
	this.node.addEventListener("mousedown", this.activate.bind(this));
	this.node.addEventListener("mouseup", this.deactivate.bind(this));
	this.node.addEventListener("mouseleave", this.deactivate.bind(this));
}
Button.prototype = Object.create(Emitter.prototype); // Makes it into an event emitter
Object.defineProperty(Button.prototype, "focused", {
	set: function (newFocused) {
		console.log("setting new focused");
		newFocused = newFocused ? true : false;
		if (newFocused === this.focused) return;
		else if (newFocused === true) {
			console.log("focusing this, ", this);
			this.node.classList.add("focused");
			this.emit("focus");
			this.emit("toggle");
		} else {
			console.log("unfocusing this, ", this);
			this.node.classList.remove("focused");
			this.emit("unfocus");
			this.emit("toggle");
		}
	},
	get: function () {
		return this.node.classList.contains("focused");
	}
});
Button.prototype.captureEvent = function (e) { e.preventDefault(); }
Button.prototype.unpropagateEvent = function (e) { e.stopPropagation(); }
Button.prototype.activate = function () {
	this.node.classList.add("active");
}
Button.prototype.deactivate = function () {
	this.node.classList.remove("active");
}
Button.prototype.toggle = function () {
	this.focused = !this.focused;
}


var Modal = function (node, container) {
	this.node = node;
	this.container = container;
	this.listeners = {};
	this.on("focus", this.showContainer.bind(this));
	this.on("unfocus", this.hideContainer.bind(this));
}
Modal.prototype = Object.create(Button.prototype);
Modal.prototype.showContainer = function () { this.container.style.zIndex = "1000000"; }
Modal.prototype.hideContainer = function () { this.container.style.zIndex = ""; }

var Wakeable = function (node) {
	this.node = node;
	this.lastUserAction = 0;
	this.stayAwake = false;
	this.keepAwake = function (e) {
		this.lastUserAction = Date.now();
		this.woke = true;
		this.node.classList.remove("asleep");
		this.node.classList.add("awake");
		this.stayAwake = true;
	}
	this.unkeepAwake = function (e) {
		this.lastUserAction = Date.now();
		this.stayAwake = true;
	}
	this.wake = function (e) {
		this.lastUserAction = Date.now();
		if (!this.woke) {
			this.woke = true;
			this.node.classList.remove("asleep");
			this.node.classList.add("awake");
		}
	}
	this.sleep = function () {
		if (Date.now() - this.lastUserAction > 10000 && this.woke === true && this.stayAwake === false) {
			this.woke = false;
			this.node.classList.remove("awake");
			this.node.classList.add("asleep");
		}
	}
	this.woke = null;
}

var copyUrlToClipboard = function () {
	var textArea = document.createElement("textarea");
	textArea.value = location.href;
	document.body.appendChild(textArea);
	textArea.select();
	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	} catch (err) {
		console.log('Oops, unable to copy');
	}
	document.body.removeChild(textArea);
}

var updateSharingUrls = function () {
	document.getElementById("facebook").href = "https://www.facebook.com/sharer/sharer.php?u=" + location.href;
	document.getElementById("twitter").href = "https://twitter.com/intent/tweet?url=" + location.href + "&via=solsys";
	document.getElementById("reddit").href = "https://www.reddit.com/submit?url=" + location.href;
	document.getElementById("mail").href = "mailto:user@example.com?body=" + location.href;
}
