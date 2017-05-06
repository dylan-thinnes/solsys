const cp = require("child_process");

const DEBUG = false;
const regexSub = [null, null];
const factorsRegex = new RegExp(/p\d+: (\d+)/gm);
const numberRegex = new RegExp(/\d+/gm);
var output = {};
const Prime = new (function Prime () {
	this.getFactors = function (number, callback) {
		if (this.factorHistory[number] !== undefined) {
			//console.log("using previous work for prime: " + number);
			return callback(this.factorHistory[number]);
		} else cp.exec("./factorization-dependencies/msieve.core2.exe -q " + number.toString()).stdout.on("data", this.parseFactorsOutput.bind(this, number, callback));
	}
	this.factorHistory = {};
	this.piXHistory = {};
	this.requests = {};
	this.parseFactorsOutput = function (number, callback, stdout) {
		var factorsArray = [];
		var factorsArrayIndex = 0;
		var currPrime = "";
		var tempPrime = factorsRegex.exec(stdout);
		factorsArray.push({value: (currPrime = parseInt(tempPrime[1])), power: 1});
		while (tempPrime = factorsRegex.exec(stdout)) {
			if (parseInt(tempPrime[1]) === currPrime) factorsArray[factorsArrayIndex].power++;
			else factorsArrayIndex = factorsArray.push({value: (currPrime = parseInt(tempPrime[1])), power: 1}) - 1;
		}
		this.factorHistory[number] = factorsArray;
		callback(factorsArray);
	}
	this.getPiX = function (number, callback) {
		if (number <= 1) {
			callback(1);
		} else if (this.piXHistory[number] !== undefined) {
			callback(this.piXHistory[number]);
		} else if (number > 999999999999) cp.exec("./factorization-dependencies/primecount,exe --Li" + number.toString() + "\n").stdout.on("data", this.parsePiXOutput.bind(this, number, callback));
		else if (number > 999999) cp.exec("./factorization-dependencies/primecount,exe " + number.toString() + "\n").stdout.on("data", this.parsePiXOutput.bind(this, number, callback));
		else callback(null);
	}
	this.parsePiXOutput = function (number, callback, stdout) {
		this.piXHistory[number] = parseInt((/\d+/g).exec(stdout)[0]);
		callback(this.piXHistory[number]);
	}
})();

const Factor = function (value, power, isPrime, onCompletelyDone) {
	this.onCompletelyDone = onCompletelyDone;
	this.isPrime = isPrime;
	this.factors = new Array();
	this.setValue(value);
	this.setPower(power);
}
Factor.prototype.getValue = function () {
	return this.value;
}
Factor.prototype.setValue = function (newValue) {
	newValue = parseInt(newValue);
	if (newValue <= 1 || isNaN(newValue)) {
		this.value = 1;
		this.setFactors([]);
	} else {
		this.value = newValue;
		if (this.isPrime !== true) Prime.getFactors(this.value, this.setFactors.bind(this));
		else this.setFactors([]);
	}
}
Factor.prototype.setFactors = function (newFactors) {
	var newFactorsLength = newFactors.length;
	if (newFactorsLength <= 1) {
		this.factorsLength = null;
		this.factors = [];
		this.isPrime = true;
		Prime.getPiX(this.value, this.setPiX.bind(this));
	} else {
		this.factorsLength = newFactorsLength;
		this.isPrime = false;
		this.childDone("piX");
		for (var ii = 0; ii < newFactorsLength; ii++) this.factors.push(new Factor(newFactors[ii].value, newFactors[ii].power, true, this.childDone.bind(this)));
	}
}
Factor.prototype.getPower = function () {
	return this.power;
}
Factor.prototype.setPower = function (newPower) {
	if (newPower === 1) {
		this.power = 1;
		this.childDone("power");
	} else this.power = new Factor(newPower, 1, false, this.childDone.bind(this, "power"));
}
Factor.prototype.setPiX = function (newPiX) {
	if (newPiX === 1 || newPiX === null) {
		this.piX = newPiX;
		this.childDone("piX");
	} else this.piX = new Factor(newPiX, 1, false, this.childDone.bind(this, "piX"));
}
Factor.prototype.deepClone = function () {
	if (this.value === 1) {
		return "1";
	} else {
		var child = "";
		var ii = this.factors.length;
		var currClone = "{\"value\": " + this.value + ", \"isPrime\": " + this.isPrime + ", \"power\": " + (this.power === 1 ? this.power : this.power.deepClone()) + (this.isPrime === true && this.piX !== 1 && this.piX !== null && this.piX !== undefined ? ", \"piX\": " + this.piX.deepClone() : ", piX: " + this.piX + ", \"factors\": [");
		while (ii--) {
			currClone += this.factors[ii].deepClone();
			if (ii !== 0) currClone += ", ";
		}
		if (!(this.isPrime === true && this.piX !== 1 && this.piX !== null && this.piX !== undefined)) currClone += "]";
		return currClone + "}";
	}
}
Factor.prototype.childDone = function (type) {
	if (type === "power") this.powerDone = true;
	else if (type === "piX") this.piXDone = true;
	else this.factorsCounter = this.factorsCounter + 1;
	if (DEBUG === true) console.log("ConfirmDone of type: " + type, "factorsCounter: " + this.factorsCounter + " / " + this.factorsLength, "comparison: " + (this.factorsCounter === this.factorsLength), this.isPrime, this.value, "powerDone: " + this.powerDone, "piXDone: " + this.piXDone);
	if ((this.factorsCounter === this.factorsLength || this.isPrime === true) && this.powerDone && this.piXDone) {
		this.onCompletelyDone();
	}
}
Factor.prototype.setChildrenLength = function (newChildrenLength) {
	//console.log(newChildrenLength);
	this.factorsLength = newChildrenLength;
}
Factor.prototype.powerDone = false;
Factor.prototype.piXDone = false;
Factor.prototype.factorsCounter = 0;
Factor.prototype.factorsLength = undefined;

exports.Factor = Factor;