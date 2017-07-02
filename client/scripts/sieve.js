'use strict';

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
	else if (this.sieveReader[Math.floor((number - 1) / 32)] & (1 << ((number - 1) % 32))) return false;
	else return true;
}

var SoE = SieveOfEratosthenes;