'use strict';

module.exports.factorize = (event, context, AWSCallback) => {
	var number = event.number;
	if (isNaN(number) || number === "") {
		number = "1";
		//console.log("Factorization being done with 1");
		AWSCallback(null, {
			statusCode: 200,
			body: "{\"value\": \"1\"}"
		})
		return;
	}
	//console.log("Factorization being done with number: " + number);
	//console.log("Current permissions of tmp " + fs.statSync("/tmp/").mode.toString(8));
	const cp = require("child_process");
	var PIXDEPTH = 999999;
	var msievePath = "/var/task/factorization-dependencies/aws-msieve -s /tmp/msieve.dat -q -m";
	var primecountPath = "/var/task/factorization-dependencies/aws-primecount -c 1";
	var logintPath = "/var/task/factorization-dependencies/aws-logint";
	const factorsRegex = new RegExp(/p\d+: (\d+)/gm);
	const numberRegex = new RegExp(/\d+/gm);
	const piXRegex = new RegExp(/\d+/gm);
	var output = {};
	const Prime = new (function Prime () {
		this.launchAsyncProcesses = function () {
			this.msieveProcess = cp.exec(msievePath);
			this.logintProcess = cp.exec(logintPath);
			this.primecountProcess = cp.exec(primecountPath);
			this.msieveProcess.stdout.on("data", this.parseMSieveOutput.bind(this));
			this.logintProcess.stdout.on("data", this.parseLogintOutput.bind(this));
			this.primecountProcess.stdout.on("data", this.parsePrimecountOutput.bind(this));
		}
		this.getFactors = function (number, callback) {
			//console.log("Getting factors for " + number);
			if (this.factorHistory[number] !== undefined) callback(this.factorHistory[number]);
			else {
				if (this.msieveQueueCurrentIndex === this.msieveQueueCeilingIndex) {
					this.msieveQueueCeilingIndex++;
					this.msieveQueueInputs.push(number);
					this.msieveQueueCallbacks.push(callback);
					this.msieveProcess.stdin.write(number+"\n");
				} else {
					this.msieveQueueCeilingIndex++;
					this.msieveQueueInputs.push(number);
					this.msieveQueueCallbacks.push(callback);
				}
			}
			//console.log("Exiting getFactors for number " + number)
		}
		this.parseMSieveOutput = function (stdout) {
			var number = stdout.match(numberRegex);
			if (number === null) return;
			//console.log("output from msieve: " + number);
			number = number[0];
			var factorsArray = [];
			var factorsArrayIndex = 0;
			var currPrime = "";
			var tempPrime = factorsRegex.exec(stdout);
			factorsArray.push({value: (currPrime = tempPrime[1]), power: 1});
			while (tempPrime = factorsRegex.exec(stdout)) {
				if (tempPrime[1] === currPrime) factorsArray[factorsArrayIndex].power++;
				else factorsArrayIndex = factorsArray.push({value: (currPrime = tempPrime[1]), power: 1}) - 1;
			}
			this.factorHistory[number] = factorsArray;
			if (typeof this.msieveQueueCallbacks[this.msieveQueueCurrentIndex] === "function") {
				this.msieveQueueCallbacks[this.msieveQueueCurrentIndex](factorsArray);
				this.msieveQueueCurrentIndex++;
				if (this.msieveQueueCeilingIndex > this.msieveQueueCurrentIndex) {
					this.msieveProcess.stdin.write(this.msieveQueueInputs[this.msieveQueueCurrentIndex]+"\n");
				}
			}
		}
		this.parsePrimecountOutput = function (stdout) {
			var output = stdout.match(piXRegex);
			if (this.piXHistory[output[0]] === undefined) this.piXHistory[output[0]] = output[1];
			else AWSCallback("overwrite error!");
			//console.log("output from primecount: " + output[0] + " " + output[1]);
			if (typeof this.primecountQueueCallbacks[this.primecountQueueCurrentIndex] === "function") {
				this.primecountQueueCallbacks[this.primecountQueueCurrentIndex](output[1]);
				this.primecountQueueCurrentIndex++;
				if (this.primecountQueueCeilingIndex > this.primecountQueueCurrentIndex) {
					this.primecountProcess.stdin.write(this.primecountQueueInputs[this.primecountQueueCurrentIndex]+"\n");
				}
			}
		}
		this.parseLogintOutput = function (stdout) {
			var output = stdout.match(piXRegex);
			if (this.piXHistory[output[0]] === undefined) this.piXHistory[output[0]] = output[1];
			else AWSCallback("overwrite error!");
			//console.log("output from logint: " + output[0] + " " + output[1]);
			if (typeof this.logintQueueCallbacks[this.logintQueueCurrentIndex] === "function") {
				this.logintQueueCallbacks[this.logintQueueCurrentIndex](output[1]);
				this.logintQueueCurrentIndex++;
				if (this.logintQueueCeilingIndex > this.logintQueueCurrentIndex) {
					this.logintProcess.stdin.write(this.logintQueueInputs[this.logintQueueCurrentIndex]+"\n");
				}
			}
		}
		this.primecountQueueCallbacks = [];
		this.primecountQueueInputs = [];
		this.primecountQueueCeilingIndex = 0;
		this.primecountQueueCurrentIndex = 0;
		this.logintQueueCallbacks = [];
		this.logintQueueInputs = [];
		this.logintQueueCeilingIndex = 0;
		this.logintQueueCurrentIndex = 0;
		this.msieveQueueCallbacks = [];
		this.msieveQueueInputs = [];
		this.msieveQueueCeilingIndex = 0;
		this.msieveQueueCurrentIndex = 0;
		this.msieveCallbacks = {};
		this.factorHistory = {};
		this.piXHistory = {
			"2":  "1",
			"3":  "2",
			"5":  "3",
			"7":  "4",
			"11": "5"
		};
		this.piXHistory["2"] = "1";
		this.getPiX = function (number, callback) {
			//console.log("Getting piX for " + number, typeof number);
			if (number <= 1) callback(1);
			else if (this.piXHistory[number] !== undefined) {
				//console.log("Using pre-processed callback for number: " + number + "with piX value: " + this.piXHistory[number]);
				callback(this.piXHistory[number]);
			} else if (number > 9999999999999) {
				//console.log("Using logint for number: " + number);
				if (this.logintQueueCurrentIndex === this.logintQueueCeilingIndex) {
					this.logintQueueCeilingIndex++;
					this.logintQueueInputs.push(number.toString());
					this.logintQueueCallbacks.push(callback);
					this.logintProcess.stdin.write(number.toString()+"\n");
				} else {
					this.logintQueueCeilingIndex++;
					this.logintQueueInputs.push(number.toString());
					this.logintQueueCallbacks.push(callback);
				}
			} else if (number >= PIXDEPTH) {
				//console.log("Using primecount for number: " + number);
				if (this.primecountQueueCurrentIndex === this.primecountQueueCeilingIndex) {
					this.primecountQueueCeilingIndex++;
					this.primecountQueueInputs.push(number.toString());
					this.primecountQueueCallbacks.push(callback);
					this.primecountProcess.stdin.write(number.toString()+"\n");
				} else {
					this.primecountQueueCeilingIndex++;
					this.primecountQueueInputs.push(number.toString());
					this.primecountQueueCallbacks.push(callback);
				}
			} else callback(null);
			//console.log("Exiting getPiX");
		}
		this.close = function () {
			//console.log("Closing primes...");
			this.msieveProcess.kill();
			this.logintProcess.stdin.write("a\n");
			this.primecountProcess.stdin.write("a\n");
			//console.log("Primes closed...");
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
			this.isPrime = false;
			this.childDone("piX");
			for (var ii = 0; ii < newFactorsLength; ii++) {
				this.factors.push(new Factor(newFactors[ii].value, newFactors[ii].power, true, this.childDone.bind(this)));
			}
		}
		this.childDone("factorsInit");
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
	Prime.launchAsyncProcesses();
	var currfactor = new RootFactor(number, AWSCallback);
};
