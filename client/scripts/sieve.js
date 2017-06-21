var SieveOfEratosthenes = function (initSize, benchmark) {
	this.primeList = [];
	this.setMultiples = function (prime) {
		this.primeList.push(prime);
		var primeMultiple = (prime * 2) - 1;
		while (primeMultiple < this.bitSize) {
			var largeCursor = Math.floor(primeMultiple / 32);
			var smallCursor = 1 << (primeMultiple % 32);
			var invertedSmallCursor = 4294967295 ^ smallCursor;
			this.sieveReader[largeCursor] = (this.sieveReader[largeCursor] & invertedSmallCursor) + smallCursor;
			primeMultiple += prime;
		}
	}
	this.genSieve = function (size, benchmark) {
		if (benchmark === true) var startTime = Date.now();
		this.elements = size / 4;
		this.bitSize = size * 8;
		this.sieve = new ArrayBuffer(size);
		this.sieveReader = new Uint32Array(this.sieve);
		this.sieveReader.fill(2863311530);
		this.sieveReader[0] = 2863311529;
		this.upperLimit = Math.ceil(Math.sqrt(this.bitSize) / 32);
		for (var ii = 0; ii < this.upperLimit; ii++) {
			if ((this.sieveReader[ii] & 1) === 0)          this.setMultiples(ii * 32 + 1);
			if ((this.sieveReader[ii] & 4) === 0)          this.setMultiples(ii * 32 + 3);
			if ((this.sieveReader[ii] & 16) === 0)         this.setMultiples(ii * 32 + 5);
			if ((this.sieveReader[ii] & 64) === 0)         this.setMultiples(ii * 32 + 7);
			if ((this.sieveReader[ii] & 256) === 0)        this.setMultiples(ii * 32 + 9);
			if ((this.sieveReader[ii] & 1024) === 0)       this.setMultiples(ii * 32 + 11);
			if ((this.sieveReader[ii] & 4096) === 0)       this.setMultiples(ii * 32 + 13);
			if ((this.sieveReader[ii] & 16384) === 0)      this.setMultiples(ii * 32 + 15);
			if ((this.sieveReader[ii] & 65536) === 0)      this.setMultiples(ii * 32 + 17);
			if ((this.sieveReader[ii] & 262144) === 0)     this.setMultiples(ii * 32 + 19);
			if ((this.sieveReader[ii] & 1048576) === 0)    this.setMultiples(ii * 32 + 21);
			if ((this.sieveReader[ii] & 4194304) === 0)    this.setMultiples(ii * 32 + 23);
			if ((this.sieveReader[ii] & 16777216) === 0)   this.setMultiples(ii * 32 + 25);
			if ((this.sieveReader[ii] & 67108864) === 0)   this.setMultiples(ii * 32 + 27);
			if ((this.sieveReader[ii] & 268435456) === 0)  this.setMultiples(ii * 32 + 29);
			if ((this.sieveReader[ii] & 1073741824) === 0) this.setMultiples(ii * 32 + 31);
		}
		if (benchmark === true) {
			var endTime = Date.now();
			console.log("Started at: " + startTime + "\nEnded at: " + endTime + "\nTime elapsed: " + (endTime - startTime));
		}
	}
	this.piX = 0;
	this.tempFactorsCount = 0;
	this.piXCount = function () {
		this.piX = 1;
		for (var ii = 0; ii < this.elements; ii++) {
			if ((this.sieveReader[ii] & 1) === 0)          this.piX++;
			if ((this.sieveReader[ii] & 4) === 0)          this.piX++;
			if ((this.sieveReader[ii] & 16) === 0)         this.piX++;
			if ((this.sieveReader[ii] & 64) === 0)         this.piX++;
			if ((this.sieveReader[ii] & 256) === 0)        this.piX++;
			if ((this.sieveReader[ii] & 1024) === 0)       this.piX++;
			if ((this.sieveReader[ii] & 4096) === 0)       this.piX++;
			if ((this.sieveReader[ii] & 16384) === 0)      this.piX++;
			if ((this.sieveReader[ii] & 65536) === 0)      this.piX++;
			if ((this.sieveReader[ii] & 262144) === 0)     this.piX++;
			if ((this.sieveReader[ii] & 1048576) === 0)    this.piX++;
			if ((this.sieveReader[ii] & 4194304) === 0)    this.piX++;
			if ((this.sieveReader[ii] & 16777216) === 0)   this.piX++;
			if ((this.sieveReader[ii] & 67108864) === 0)   this.piX++;
			if ((this.sieveReader[ii] & 268435456) === 0)  this.piX++;
			if ((this.sieveReader[ii] & 1073741824) === 0) this.piX++;
		}
	}
	if (!isNaN(initSize) && typeof initSize === "number") this.genSieve(initSize, benchmark);
};
var SOE = SieveOfEratosthenes;