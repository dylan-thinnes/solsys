var WheelSieve = function (initSize, benchmark) {
	if (!isNaN(initSize) && typeof initSize === "number") this.gen(initSize, benchmark);
}
WheelSieve.prototype.gen = function (initSize, benchmark) {
	this.genSieve(initSize, benchmark);
	//this.genList(benchmark);
}
WheelSieve.prototype.genSieve = function (size, benchmark) {
	if (benchmark === true) var startTime = Date.now();
	this.elements = size / 4;
	this.bitSize = size * 8;
	this.sieve = new ArrayBuffer(size);
	this.sieveReader = new Uint32Array(this.sieve);
	this.sieveReader[0] = 2863311529;
	var upperLimit = Math.ceil(Math.sqrt(this.bitSize) / 32);
	var currPrime = 3;
	var segmentWidth = 6;

	/*while (currPrime < upperLimit) {
		currPrime = this.primeAfter(currPrime);
		if 
		segmentWidth *= currPrime;
	}*/



	if (benchmark === true) {
		var endTime = Date.now();
		console.log("genList:\nStarted at: " + startTime + "\nEnded at: " + endTime + "\nTime elapsed: " + (endTime - startTime));
		return (endTime - startTime);
	}
}
WheelSieve.prototype.primeAfter = function (number) {
	number++;
	while (!this.isPrime(number)) number++;
	return number;
}
WheelSieve.prototype.isPrime = function (number) {
	if (number <= 1) return null;
	else if (number > this.bitSize) return null;
	else if (number % 2 === 0) return false;
	else if (this.sieveReader[Math.floor((number - 1) / 32)] & (1 << ((number - 1) % 32))) return false;
	else return true;
}
WheelSieve.prototype.copySegment = function (segmentWidth, multiple) {
	var largeOffset = Math.floor(segmentWidth / 32);
	var smallOffset = segmentWidth % 32;
	var inverseSmallOffset = 32 - smallOffset;
	var largeWidth = largeOffset;
	var smallWidth = smallOffset;
	largeOffset--;
	console.log(largeWidth, smallWidth);
	for (var ii = 1; ii < multiple; ii++) {
		/*for (var jj = 1; jj < largeWidth; jj++) {
			console.log("jj", jj, smallOffset);
			console.log(this.sieveReader[jj], this.sieveReader[jj] << smallOffset);
			if (smallOffset === 0) {
				this.sieveReader[largeOffset + jj] += this.sieveReader[jj];
			} else {
				this.sieveReader[largeOffset + jj] += this.sieveReader[jj] << smallOffset;
				this.sieveReader[largeOffset + jj + 1] += this.sieveReader[jj] >>> inverseSmallOffset;
			}
		}
		if (smallOffset === 0) {
			this.sieveReader[largeOffset + largeWidth - 1] += this.sieveReader[largeWidth - 1];
		} else {
			this.sieveReader[largeOffset + largeWidth - 1] += (this.sieveReader[largeWidth] & ((1 << smallOffset) - 1)) >>> inverseSmallOffset;
			this.sieveReader[largeOffset + largeWidth] += (this.sieveReader[largeWidth] & ((1 << smallOffset) - 1)) << smallOffset;
			//this.sieveReader[largeOffset + jj] += this.sieveReader[jj] << smallOffset;
			//this.sieveReader[largeOffset + jj + 1] += this.sieveReader[jj] >>> inverseSmallOffset;
		}*/
		for (var jj = 1; jj < largeWidth; jj++) {
			console.log(largeOffset + jj);
			this.sieveReader[largeOffset + jj] = this.sieveReader[jj - 1];	
		}
		if (smallOffset === 0) {
			this.sieveReader[largeOffset + largeWidth] = this.sieveReader[largeWidth - 1];
		} else {
			
		}
		smallOffset = smallOffset * 2;
		largeOffset += largeWidth;
		//console.log(largeOffset, smallOffset);
	}
}