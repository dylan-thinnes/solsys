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
	this.primeFactorize = function (numerator) {
		//Input sanitation begins here
		//var startTime = Date.now();
		//console.log("Factorize started at " + startTime);
		if (isNaN(numerator) || numerator === 0) numerator = 1;
		numerator = Math.abs(numerator);
		if (numerator === 1) return [];
		//Input sanitation ends here
		var factors = [];
		if (numerator !== Math.floor(numerator)) {
			var decimalLength = numerator.toString().length-2;
			factors[0] = (factors[0] ? factors[0] : 0) - decimalLength;
			factors[2] = (factors[2] ? factors[2] : 0) - decimalLength;
			numerator = Math.floor(numerator*Math.pow(10,decimalLength));
		}
		//var decimalTime = Date.now();
		//console.log("Done shifting decimal point at " + decimalTime + ", Delta: " + (decimalTime - startTime));
		var remainder = numerator;
		var lastIndex = -1;
		var index = 0;
		var maxFactor = Math.floor(Math.sqrt(numerator));
		var divisor = this.sieve.list[0];
		while (divisor <= maxFactor && remainder > 1) {
			if (numerator % divisor === 0) {
				factors[index] = (factors[index] === undefined) ? 0 : factors[index];
				while (remainder % divisor === 0 && remainder > 1) {
					remainder /= divisor;
					factors[index]++;
				}
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
			else factors[this.sieve.pi(remainder) - 1] = 1;
		}
		//var remainderTime = Date.now();
		//console.log("Done finding remainder at " + remainderTime + ", Delta: " + (remainderTime - startTime));
		return factors;
	}
}
var F = new Factorizer(2000000);