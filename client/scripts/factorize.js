'use strict';
// The SieveOfEratosthenes is a class used to produce sieves filled with primes by using a TypedArray. This implementation of the class can produce the first million primes in 300-400ms.
var SoEBenchmark = function (count) {
	for (var ii = 0; ii < count; ii++) {
		var test = new SoE(2000000, true);
	}
}

var SieveOfEratosthenes = function (initSize, benchmark) {
	if (!isNaN(initSize) && typeof initSize === "number") this.gen(initSize, benchmark);
};
SieveOfEratosthenes.prototype.gen = function (size, benchmark) {
	this.genSieve(size, benchmark);
	this.genList(benchmark);
}
SieveOfEratosthenes.prototype.genSieve = function (size, benchmark) {
	if (benchmark === true) var startTime = Date.now();
	this.elements = size / 4;
	this.bitSize = size * 8;
	this.sieve = new ArrayBuffer(size);
	this.sieveReader = new Uint32Array(this.sieve);
	var upperLimit = this.bitSize / 32;
	//this.list = new Uint32Array(Math.ceil(1.25506 * this.bitSize / Math.log(this.bitSize)));
	//this.list[0] = 2;
	this.sieveReader[0] = 2863311529;
	var upperLimit = Math.ceil(Math.sqrt(this.bitSize) / 32);
	var jj = 1;
	//var kk = 1;
	var prime = 1;
	var primeMultiple = 0;
	for (var ii = 0; ii < upperLimit; ii++) {
		while (jj > 0) {
			if ((this.sieveReader[ii] & jj) === 0) {
				//this.list[kk++] = prime;
				primeMultiple = (prime * prime) - 1;
				while (primeMultiple < this.bitSize) {
					/*var invertedSmallCursor = 4294967295 ^ smallCursor;
					this.sieveReader[largeCursor] = (this.sieveReader[largeCursor] & invertedSmallCursor) + smallCursor;*/
					this.sieveReader[Math.floor(primeMultiple / 32)] |= 1 << (primeMultiple % 32);
					primeMultiple += prime;
				}
			}
			jj <<= 2;
			prime += 2;
		}
		jj = 1;
	}
	if (benchmark === true) {
		var endTime = Date.now();
		console.log("genSieve:\nStarted at: " + startTime + "\nEnded at: " + endTime + "\nTime elapsed: " + (endTime - startTime));
		return (endTime - startTime);
	}
}
SieveOfEratosthenes.prototype.genList = function (benchmark) {
	if (benchmark === true) var startTime = Date.now();
	var upperLimit = this.bitSize / 32;
	this.list = new Uint32Array(Math.ceil(1.25506 * this.bitSize / Math.log(this.bitSize)));
	this.list[0] = 2;
	var kk = 1;
	var jj = 1;
	var prime = 1;
	for (var ii = 0; ii < upperLimit; ii++) {
		while (jj > 0) {
			if ((this.sieveReader[ii] & jj) === 0) {
				this.list[kk] = prime;
				kk++;
			}
			jj <<= 2;
			prime += 2;
		}
		jj = 1;
	}
	if (benchmark === true) {
		var endTime = Date.now();
		console.log("genList:\nStarted at: " + startTime + "\nEnded at: " + endTime + "\nTime elapsed: " + (endTime - startTime));
		return (endTime - startTime);
	}
}
//The pi function counts the primes up to a given number. If not passed a threshhold, it counts all of the primes in the existing sieve.
SieveOfEratosthenes.prototype.pi = function (number) {
	if (!isNaN(number)) {
		var threshold = Math.floor((number - 1) / 32);
		var small = (number - 1) % 32;
	} else var threshold = this.elements;
	if (number < 2) return 0;
	this.count = 1;
	var jj = 1;
	for (var ii = 0; ii < threshold; ii++) {
		while (jj > 0) {
			if ((this.sieveReader[ii] & jj) === 0) this.count++;
			jj <<= 2;
		}
		jj = 1;
	}
	if (small !== undefined) {
		var compare = 1;
		for (var ii = 0; ii <= small; ii+=2) {
			if ((this.sieveReader[threshold] & compare) === 0) this.count++;
			compare = compare << 2;
		}
	}
	return this.count;
}
SieveOfEratosthenes.prototype.isPrime = function (number) {
	if (number <= 1) return null;
	else if (number > this.bitSize) return null;
	else if (number % 2 === 0) return false; 
	else if (this.sieveReader[Math.floor((number - 1) / 32)] & (1 << ((number - 1) % 32))) return false;
	else return true;
}
SieveOfEratosthenes.prototype.primeAfter = function (number) {
	number++;
	while (!this.isPrime(number)) number++;
	return number;
}

var SoE = SieveOfEratosthenes;

var Factorizer = function (sieveSize) {
	if (isNaN(sieveSize) || typeof sieveSize !== "number") return;
	this.sieve = new SoE(sieveSize);
	this.limit = Math.min(Math.pow(this.sieve.list[this.sieve.pi() - 1], 2), Number.MAX_SAFE_INTEGER);
	this.lowerLimit = this.sieve.pi();
	this.factorize = function (number, prevPiX) {
		number = parseInt(number);
		var result = {value: number};
		if (number === NaN || number > this.limit) return;
		if (this.sieve.isPrime(number)) {
			result.piX = this.factorize(this.sieve.pi(number));
		} else {
			var tempFactors = this.primeFactorize(number);
			result.factors = [];

		}
	}
	this.getRemoteFactorization = function (number, piXDepth, callback) {
		piXDepth = (!isNaN(piXDepth) && piXDepth !== null) ? piXDepth.toString() : piXDepth;
		number = (!isNaN(number) && number !== null) ? number.toString() : "1";
		if (isNaN(number)) throw "Can't get remote factorization, " + Array.from(arguments).toString();
		var req = new XMLHttpRequest();
		req.open("GET", "https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=" + number.toString() + "&piXDepth=" + piXDepth);
		req.setRequestHeader("x-api-key", "LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM");
		req.onreadystatechange = function (event) {
			if (this.readyState === 4) {
				callback(JSON.parse(this.response)["body"]);
			}
		}
		req.send();
	}
	this.getFactors = function (numerator, callback) {
		//Input sanitation begins here
		if (isNaN(numerator) || numerator === 0) {
			numerator = 1;
			return callback([]);
		}
		numerator = Math.abs(numerator);
		if (this.factorHistory[numerator.toString()] !== undefined) return callback(this.factorHistory[numerator.toString()]);
		//Input sanitation ends here
		var factors = [];
		var remainder = numerator;
		var lastIndex = -1;
		var index = 0;
		var maxFactor = Math.floor(Math.sqrt(numerator));
		var divisor = this.sieve.list[0];
		while (divisor <= maxFactor && remainder > 1) {
			if (numerator % divisor === 0) {
				//factors[index] = (factors[index] === undefined) ? 0 : factors[index];
				//console.log(divisor);
				var power = 0;
				while (remainder % divisor === 0 && remainder > 1) {
					remainder /= divisor;
					power++;
				}
				factors.push({value: divisor, power: power});
			}
			index++;
			/*if (index === this.sieve.list.length) { // If we have reached the end of sieve.list, throw an error declaring the number as too large
				throw "Number too large to prime factorize!";
			}*/
			divisor = this.sieve.list[index]; // Prepare the next potential prime divisor
			// if (divisor > 1000000 && divisor != 20000526) throw {divisor: divisor};
		}
		//var rootTime = Date.now();
		//console.log("Done finding factors under sqrt(x) at " + rootTime + ", Delta: " + (rootTime - startTime));
		if (remainder > 1) {
			// We have exceeded the square root of the numerator, yet there is a remainder, which must therefore be prime. We return it in a special index titled "remainder".
			if (remainder > this.sieve.bitSize) factors["remainder"] = remainder;
			else factors.push({value: remainder, power: 1});
		}
		this.factorHistory[numerator.toString()] = factors;
		callback(factors);
		//var remainderTime = Date.now();
		//console.log("Done finding remainder at " + remainderTime + ", Delta: " + (remainderTime - startTime));
	}
	this.newPiXChain = function (newFactors) {
		var id = this.piXChains.push(newFactors) - 1;
		return id;
	}
	this.piXChains = [];
	this.factorHistory = {};
	this.piXHistory = {
		"2":  1,
		"3":  2,
		"5":  3,
		"7":  4,
		"11": 5
	};
	this.getPiX = function (x, callback) {
		//console.log("Getting piX for " + x, typeof x);
		if (x <= 1 || isNaN(x)) callback(1);
		else if (this.piXHistory[x.toString()] !== undefined) {
			//console.log("Using pre-processed callback for x: " + x + "with piX value: " + this.piXHistory[x]);
			callback(this.piXHistory[x.toString()]);
		} else {
			if (x > this.lowerLimit) callback(null);
			var res = this.sieve.pi(x);
			this.piXHistory[x.toString()] = res;
			callback(res);
		}
		//console.log("Exiting getPiX");
	}
}
var Prime = new Factorizer(2000000);

const Factor = function (value, power, isPrime, onCompletelyDone, piXChainID) {
	this.onCompletelyDone = onCompletelyDone;
	this.isPrime = isPrime;
	this.factors = new Array();
	this.piXChainID = piXChainID;
	if (value > Prime.limit) {
		console.log("setting filled remote...")
		this.isFilledRemote = true;
		this.tempValue = value;
		this.tempPower = power;
		Prime.getRemoteFactorization(this.tempValue.toString(), null, this.fillRemoteFactorization.bind(this));
	} else {
		this.setValue(value);
		this.setPower(power);
	}
}
Factor.prototype.getValue = function () {
	return this.value;
}
Factor.prototype.setValue = function (newValue) {
	//console.log("Starting setValue");
	if (parseInt(newValue) <= 1 || isNaN(newValue)) {
		this.value = 1;
		this.setFactors([]);
	} else {
		this.value = newValue;
		if (this.isPrime !== true) Prime.getFactors(this.value, this.setFactors.bind(this));
		else this.setFactors([]);
	}
	//console.log("Exiting setValue");
}
Factor.prototype.setFactors = function (newFactors) {
	if (newFactors["remainder"] !== undefined) {
		this.isFilledRemote = true;
		Prime.getRemoteFactorization(this.value.toString(), null, this.fillRemoteFactorization.bind(this));
	} else {
		var newFactorsLength = newFactors.length;
		if (newFactorsLength === 0 || (newFactorsLength === 1 && newFactors[0].power === "1")) {
			//console.log("Setting empty factors");
			this.factorsLength = null;
			this.factors = [];
			this.isPrime = true;
			//console.log("Calling getPiX for Factor with the following value: " + this.value, typeof this.value);
			Prime.getPiX(this.value, this.setPiX.bind(this));
		} else {
			this.factorsLength = newFactorsLength;
			//console.log(newFactors);
			this.isPrime = false;
			this.childDone("piX");
			var factorList = [];
			for (var ii = 0; ii < newFactorsLength; ii++) {
				factorList[ii] = newFactors[ii].value;
			}
			var piXChainID = Prime.newPiXChain(factorList);
			for (var ii = 0; ii < newFactorsLength; ii++) {
				this.factors.push(new Factor(newFactors[ii].value, newFactors[ii].power, true, this.childDone.bind(this), piXChainID));
			}
		}
		this.childDone("factorsInit");
	}
}
Factor.prototype.getPower = function () {
	return this.power;
}
Factor.prototype.setPower = function (newPower) {
	//console.log("Setting power " + newPower);
	if (parseInt(newPower) === 1) {
		this.power = "1";
		this.childDone("power");
	} else this.power = new Factor(newPower, "1", false, this.childDone.bind(this, "power"));
	//console.log("Exiting setPower");
}
Factor.prototype.setPiX = function (newPiX) {
	//console.log("Setting piX " + newPiX);
	//console.log(newPiX, typeof newPiX, newPiX === null);
	//console.log("subtracting pix", newPiX);
	if (newPiX === null) console.log("null output from getPiX");
	var postponePiX = false;
	if (parseInt(newPiX) <= 1) {
		//console.log("caught terminating piX...", this.value, newPiX);
		this.piX = (parseInt(newPiX) - 1).toString();
		this.childDone("piX");
	} else if (newPiX === null) {
		this.piX = null;
		this.childDone("piX");
	} else {
		if (this.piXChainID !== undefined) {
			var pos = Prime.piXChains[this.piXChainID].indexOf(this.value);
			//console.log(pos, (newPiX)).value);
			if (pos > 0) {
				var previousPiX = Prime.piXChains[this.piXChainID][pos - 1];
				if (Prime.piXHistory[previousPiX] !== undefined) {
					newPiX--;
					newPiX -= Prime.piXHistory[previousPiX];
				} else {
					this.tempPiX = newPiX;
					postponePiX = true;
					Prime.getPiX(previousPiX, this.subtractPiX.bind(this), true);
				}
			} else {
				newPiX--;
			}
		}
		//console.log("postponePiX: " + postponePiX);
		if (!postponePiX) {
			if (parseInt(newPiX) <= 1 || newPiX === null) {
				this.piX = newPiX;
				this.childDone("piX");
			} else this.piX = new Factor(newPiX, "1", false, this.childDone.bind(this, "piX"));
		}
	}

	//console.log("Exiting piX");
}
Factor.prototype.subtractPiX = function (subtraction) {
	console.log("subtracting pix");
	var newPiX = this.tempPiX - subtraction - 1;
	if (parseInt(newPiX) <= 1 || newPiX === null) {
		this.piX = newPiX;
		this.childDone("piX");
	} else this.piX = new Factor(newPiX, "1", false, this.childDone.bind(this, "piX"));
}
Factor.prototype.deepClone = function () {
	if (this.isFilledRemote) {
		console.log("filled remote being printed.");
		return this.filledRemoteFactorization;
	} else {
		if (this.value === 1) {
			return "1";
		} else if (this.factors.length === 1) {
			return this.factors[0].deepClone();
		} else {
			var child = "";
			var ii = this.factors.length;
			var currClone = "{";
			if (this.isPrime === true) {
				currClone += "\"value\": \"" + this.value.toString() + "\", ";
				currClone += "\"isPrime\": true, ";
				currClone += "\"power\": " + (isNaN(this.power) && this.power !== null ? this.power.deepClone() : "\"" + (this.power !== null ? this.power.toString() : "null") + "\"") + ", ";
				currClone += "\"piX\": " + (isNaN(this.piX) && this.piX !== null ? this.piX.deepClone() : "\"" + (this.piX !== null ? this.piX.toString() : "null") + "\"");
			} else {
				currClone += "\"value\": \"" + this.value.toString() + "\", ";
				currClone += "\"isPrime\": false, ";
				currClone += "\"factors\": [";
				var ii = this.factors.length;
				while (ii--) {
					currClone += this.factors[ii].deepClone();
					if (ii !== 0) currClone += ", ";
				}
				currClone += "]";
			}
			/*var currClone = "{\"value\": \"" + this.value + "\", \"isPrime\": " + this.isPrime + ", \"power\": " + (this.power === "1" ? "1" : this.power.deepClone()) + (this.isPrime === true && this.piX !== "1" && this.piX !== null && this.piX !== undefined ? ", \"piX\": " + this.piX.deepClone() : ", \"piX\": " + (this.piX !== undefined ? this.piX : "\"undefined\"") + ", \"factors\": [");
			while (ii--) {
				currClone += this.factors[ii].deepClone();
				if (ii !== 0) currClone += ", ";
			}
			if (!(this.isPrime === true && this.piX !== "1" && this.piX !== null && this.piX !== undefined)) currClone += "]";*/
			return currClone + "}";
		}
	}
}
Factor.prototype.childDone = function (type) {
	//console.log("childDone of type: " + type);
	if (type === "power") this.powerDone = true;
	else if (type === "piX") this.piXDone = true;
	else if (type === "factorsInit") this.factorsInitDone = true;
	else this.factorsCounter = this.factorsCounter + 1;
	if ((this.factorsCounter === this.factorsLength || this.isPrime === true) && this.powerDone && this.piXDone && this.factorsInitDone) {
		this.onCompletelyDone();
	}
}
Factor.prototype.setChildrenLength = function (newChildrenLength) {
	this.factorsLength = newChildrenLength;
}
Factor.prototype.fillRemoteFactorization = function (remoteOutput) {
	console.log("starting factorProfile...");
	this.factorProfile = new FactorProfile(remoteOutput, this.remoteFactorizationFilled.bind(this));
}
Factor.prototype.remoteFactorizationFilled = function (finalOutput) {
	console.log("filling remote factorization with: ", finalOutput);
	this.filledRemoteFactorization = finalOutput;
	this.childDone("piX");
	this.childDone("power");
	this.childDone("factorsInit");
	while (this.factorsCounter !== this.factorsLength) this.childDone();
}
Factor.prototype.powerDone = false;
Factor.prototype.piXDone = false;
Factor.prototype.factorsCounter = 0;
Factor.prototype.factorsLength = undefined;
Factor.prototype.factorsInitDone = false;
Factor.prototype.isRootFactor = false;
Factor.prototype.isFilledRemote = false;

const RootFactor = function (value, callback) {
	//console.log("Root factorization beginning...");
	this.isRootFactor = true;
	this.callback = callback;
	this.onCompletelyDone = function () {
		//console.log(this.deepClone());
		this.callback(this.deepClone());
	}
	this.isPrime = false;
	this.factors = new Array();
	if (value > Prime.limit) {
		console.log("getting remote...");
		this.isFilledRemote = true;
		this.tempValue = value;
		this.tempPower = "1";
		Prime.getRemoteFactorization(this.tempValue.toString(), null, this.fillRemoteFactorization.bind(this));
	} else {
		this.setValue(value);
		this.setPower("1");
	}
}
RootFactor.prototype = Factor.prototype;

var FactorProfile = function (profileString, onCompletelyDone) {
	this.parsedValue = JSON.parse(profileString);
	//console.log(this.parsedValue);
	this.nodeCount = 0;
	this.piXsChecked = 0;
	this.powersChecked = 0;
	this.factorListsChecked = 0;
	this.callbacksSet = 0;
	this.callbacksDone = 0;
	this.onCompletelyDone = onCompletelyDone;
	this.deepCloneSearchNull(this.parsedValue);
}
FactorProfile.prototype.deepCloneSearchNull = function (input, prevValue) {
	this.nodeCount++;
	if (isNaN(prevValue) || prevValue === null) prevValue = 0;
	console.log("input is: ", input);
	if (input.piX === null) {
		//console.log("input.piX is convertable null");
		Prime.getPiX(parseInt(input.value), this.parsePiX.bind(this, input, prevValue));
	} else if (typeof input.piX === "object") {
		this.deepCloneSearchNull(input.piX);
	}
	this.piXsChecked++;
	if (input.power !== null && typeof input.power === "object") {
		this.deepCloneSearchNull(input.power);
	}
	this.powersChecked++;
	if (input.factors !== undefined) {
		var factorsLength = input.factors.length;
		/*var factorsList = [];
		for (var ii = 0; ii < factorslength; ii++) {
			factorsList[factorsLength - 1 - ii] = this.factors[ii].value;
		}*/
		var prevValue = 0;
		for (var ii = 0; ii < factorsLength; ii++) {
			//console.log("current factors is: ", input.factors[ii])
			this.deepCloneSearchNull(input.factors[factorsLength - ii - 1], prevValue);
			prevValue = parseInt(input.factors[factorsLength - ii - 1].value);
		}
	}
	this.factorListsChecked++;
	console.log("state of this 1: ", this.nodeCount, this.piXsChecked, this.powersChecked, this.factorListsChecked, this.callbacksSet, this.callbacksDone);
	this.checkDone();
}
FactorProfile.prototype.parsePiX = function (input, prevValue, piX) {
	this.callbacksSet++;
	//value, power, isPrime, onCompletelyDone, piXChainID
	var dpx = piX - Prime.sieve.pi(prevValue) - 1;
	if (dpx <= 1) this.replaceNullWithPiX(input, dpx);
	else new RootFactor(dpx, this.replaceNullWithPiX.bind(this, input));
}
FactorProfile.prototype.replaceNullWithPiX = function (input, res) {
	//console.log("replacing null with piX, searching for factors...", piX.factors);
	/*if (piX.factors !== undefined) {
		for (var ii = 0; ii < piX.factors.length; ii++) {
			console.log("current factors is: ", piX.factors[ii]);
			this.deepCloneSearchNull(piX.factors[ii]);
		}
	}*/
	this.callbacksDone++;
	console.log("res", res);
	if (res <= 1) input.piX = res.toString();
	else input.piX = JSON.parse(res);
	this.checkDone();
}
FactorProfile.prototype.checkDone = function () {
	console.log("checking done...");
	if (this.callbacksSet === this.callbacksDone && this.nodeCount === this.factorListsChecked && this.nodeCount === this.powersChecked && this.nodeCount === this.piXsChecked) {
		console.log("state of this 2: ", this.nodeCount, this.piXsChecked, this.powersChecked, this.factorListsChecked);
		console.log("checkDone has passed");
		this.onCompletelyDone(/*JSON.stringify(*/this.parsedValue/*)*/);
	}
}