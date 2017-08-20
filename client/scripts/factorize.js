'use strict';
// The SieveOfEratosthenes is a class used to produce sieves filled with primes by using a TypedArray. This implementation of the class can produce the first million primes in 300-400ms.
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
	this.sieveReader[0] = 2863311529;
	var upperLimit = Math.ceil(Math.sqrt(this.bitSize) / 32);
	var jj = 1;
	var prime = 1;
	var primeMultiple = 0;
	for (var ii = 0; ii < upperLimit; ii++) {
		while (jj > 0) {
			if ((this.sieveReader[ii] & jj) === 0) {
				primeMultiple = (prime * prime) - 1;
				while (primeMultiple < this.bitSize) {
					var largeCursor = Math.floor(primeMultiple / 32);
					var smallCursor = 1 << (primeMultiple % 32);
					var invertedSmallCursor = 4294967295 ^ smallCursor;
					this.sieveReader[largeCursor] = (this.sieveReader[largeCursor] & invertedSmallCursor) + smallCursor;
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
	this.remoteGetFactorization = function (number, basePiX, callback) {
		
	}
	this.getPiX = function (x, callback) {
		if (x > this.limit) this.remoteGetFactorization(x, callback);
		else {

		}
	}
	this.getFactors = function (numerator, callback) {
		//Input sanitation begins here
		if (isNaN(numerator) || numerator === 0) {
			numerator = 1;
			return [];
		}
		numerator = Math.abs(numerator);
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
			if (remainder > this.sieve.bitSize) this.remoteGetFactorization(remainder, );
			else factors.push({value: this.sieve.pi(remainder) - 1, power: 1});
		} else callback(factors);
		//var remainderTime = Date.now();
		//console.log("Done finding remainder at " + remainderTime + ", Delta: " + (remainderTime - startTime));
	}
}
var Prime = new Factorizer(2000000);

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
Factor.prototype.setFactors = function (newFactors, remainder) {
	var newFactorsLength = newFactors.length;
	if (newFactorsLength === 0 || (newFactorsLength === 1 && newFactors[0].power === "1")) {
		//console.log("Setting empty factors");
		this.factorsLength = null;
		this.factors = [];
		this.isPrime = true;
		//console.log("Calling getPiX for Factor with the following value: " + this.value, typeof this.value);
		this.setPiX(Prime.getPiX(this.value));
	} else {
		this.factorsLength = newFactorsLength;
		this.isPrime = false;
		this.childDone("piX");
		for (var ii = 0; ii < newFactorsLength; ii++) {
			this.factors.push(new Factor(newFactors[ii].value, newFactors[ii].power, true, this.childDone.bind(this)));
			console.log("getting server factors...");
			this.factors.push();
			Prime.getServerFactorizations(this.setServerFactors.bind(this));
		}
	}
	this.childDone("factorsInit");
}
Factor.prototype.setServerFactors = function () {
	console.log("setting server factors...");
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
	if (parseInt(newPiX) === 1 || newPiX === null) {
		this.piX = newPiX;
		this.childDone("piX");
	} else this.piX = new Factor(newPiX, "1", false, this.childDone.bind(this, "piX"));
	//console.log("Exiting piX");
}
Factor.prototype.deepClone = function () {
	if (this.value === 1) {
		return "1";
	} else {
		var child = "";
		var ii = this.factors.length;
		var currClone = "{\"value\": \"" + this.value + "\", \"isPrime\": " + this.isPrime + ", \"power\": " + (this.power === "1" ? "1" : this.power.deepClone()) + (this.isPrime === true && this.piX !== "1" && this.piX !== null && this.piX !== undefined ? ", \"piX\": " + this.piX.deepClone() : ", \"piX\": " + (this.piX !== undefined ? this.piX : "\"undefined\"") + ", \"factors\": [");
		while (ii--) {
			currClone += this.factors[ii].deepClone();
			if (ii !== 0) currClone += ", ";
		}
		if (!(this.isPrime === true && this.piX !== "1" && this.piX !== null && this.piX !== undefined)) currClone += "]";
		return currClone + "}";
	}
}
Factor.prototype.childDone = function (type) {
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
Factor.prototype.powerDone = false;
Factor.prototype.piXDone = false;
Factor.prototype.factorsCounter = 0;
Factor.prototype.factorsLength = undefined;
Factor.prototype.factorsInitDone = false;

const RootFactor = function (value, AWSCallback) {
	//console.log("Root factorization beginning...");
	this.callback = AWSCallback;
	this.onCompletelyDone = function () {
		Prime.close();
		//console.log("Root factorization ending...");
		this.callback(null, {
			statusCode: 200,
			body: this.deepClone()
		});
	}
	this.isPrime = false;
	this.factors = new Array();
	this.setValue(value);
	this.setPower("1");
}
RootFactor.prototype = Factor.prototype;
//var currfactor = new RootFactor(number, AWSCallback);