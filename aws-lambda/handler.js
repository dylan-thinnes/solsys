'use strict';

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
ArbInt.POW2 = [
	new ArbInt("1"),
	new ArbInt("2"),
	new ArbInt("4"),
	new ArbInt("8"),
	new ArbInt("16"),
	new ArbInt("32"),
	new ArbInt("64"),
	new ArbInt("128"),
	new ArbInt("256"),
	new ArbInt("512"),
	new ArbInt("1024"),
	new ArbInt("2048"),
	new ArbInt("4096"),
	new ArbInt("8192"),
	new ArbInt("16384"),
	new ArbInt("32768"),
	new ArbInt("65536"),
	new ArbInt("131072"),
	new ArbInt("262144"),
	new ArbInt("524288"),
	new ArbInt("1048576"),
	new ArbInt("2097152"),
	new ArbInt("4194304"),
	new ArbInt("8388608"),
	new ArbInt("16777216"),
	new ArbInt("33554432"),
	new ArbInt("67108864"),
	new ArbInt("134217728"),
	new ArbInt("268435456"),
	new ArbInt("536870912"),
	new ArbInt("1073741824"),
	new ArbInt("2147483648"),
	new ArbInt("4294967296"),
	new ArbInt("8589934592"),
	new ArbInt("17179869184"),
	new ArbInt("34359738368"),
	new ArbInt("68719476736"),
	new ArbInt("137438953472"),
	new ArbInt("274877906944"),
	new ArbInt("549755813888"),
	new ArbInt("1099511627776"),
	new ArbInt("2199023255552"),
	new ArbInt("4398046511104"),
	new ArbInt("8796093022208"),
	new ArbInt("17592186044416"),
	new ArbInt("35184372088832"),
	new ArbInt("70368744177664"),
	new ArbInt("140737488355328"),
	new ArbInt("281474976710656"),
	new ArbInt("562949953421312"),
	new ArbInt("1125899906842624"),
	new ArbInt("2251799813685248"),
	new ArbInt("4503599627370496"),
	new ArbInt("9007199254740992"),
	new ArbInt("18014398509481984"),
	new ArbInt("36028797018963968"),
	new ArbInt("72057594037927936"),
	new ArbInt("144115188075855872"),
	new ArbInt("288230376151711744"),
	new ArbInt("576460752303423488"),
	new ArbInt("1152921504606846976"),
	new ArbInt("2305843009213693952"),
	new ArbInt("4611686018427387904"),
	new ArbInt("9223372036854775808"),
	new ArbInt("18446744073709551616"),
	new ArbInt("36893488147419103232"),
	new ArbInt("73786976294838206464"),
	new ArbInt("147573952589676412928"),
	new ArbInt("295147905179352825856"),
	new ArbInt("590295810358705651712"),
	new ArbInt("1180591620717411303424"),
	new ArbInt("2361183241434822606848"),
	new ArbInt("4722366482869645213696"),
	new ArbInt("9444732965739290427392"),
	new ArbInt("18889465931478580854784"),
	new ArbInt("37778931862957161709568"),
	new ArbInt("75557863725914323419136"),
	new ArbInt("151115727451828646838272"),
	new ArbInt("302231454903657293676544"),
	new ArbInt("604462909807314587353088"),
	new ArbInt("1208925819614629174706176"),
	new ArbInt("2417851639229258349412352"),
	new ArbInt("4835703278458516698824704"),
	new ArbInt("9671406556917033397649408"),
	new ArbInt("19342813113834066795298816"),
	new ArbInt("38685626227668133590597632"),
	new ArbInt("77371252455336267181195264"),
	new ArbInt("154742504910672534362390528"),
	new ArbInt("309485009821345068724781056"),
	new ArbInt("618970019642690137449562112"),
	new ArbInt("1237940039285380274899124224"),
	new ArbInt("2475880078570760549798248448"),
	new ArbInt("4951760157141521099596496896"),
	new ArbInt("9903520314283042199192993792"),
	new ArbInt("19807040628566084398385987584"),
	new ArbInt("39614081257132168796771975168"),
	new ArbInt("79228162514264337593543950336"),
	new ArbInt("158456325028528675187087900672"),
	new ArbInt("316912650057057350374175801344"),
	new ArbInt("633825300114114700748351602688"),
	new ArbInt("1267650600228229401496703205376"),
	new ArbInt("2535301200456458802993406410752"),
	new ArbInt("5070602400912917605986812821504"),
	new ArbInt("10141204801825835211973625643008"),
	new ArbInt("20282409603651670423947251286016"),
	new ArbInt("40564819207303340847894502572032"),
	new ArbInt("81129638414606681695789005144064"),
	new ArbInt("162259276829213363391578010288128"),
	new ArbInt("324518553658426726783156020576256"),
	new ArbInt("649037107316853453566312041152512"),
	new ArbInt("1298074214633706907132624082305024"),
	new ArbInt("2596148429267413814265248164610048"),
	new ArbInt("5192296858534827628530496329220096"),
	new ArbInt("10384593717069655257060992658440192"),
	new ArbInt("20769187434139310514121985316880384"),
	new ArbInt("41538374868278621028243970633760768"),
	new ArbInt("83076749736557242056487941267521536"),
	new ArbInt("166153499473114484112975882535043072"),
	new ArbInt("332306998946228968225951765070086144"),
	new ArbInt("664613997892457936451903530140172288"),
	new ArbInt("1329227995784915872903807060280344576"),
	new ArbInt("2658455991569831745807614120560689152"),
	new ArbInt("5316911983139663491615228241121378304"),
	new ArbInt("10633823966279326983230456482242756608"),
	new ArbInt("21267647932558653966460912964485513216"),
	new ArbInt("42535295865117307932921825928971026432"),
	new ArbInt("85070591730234615865843651857942052864"),
	new ArbInt("170141183460469231731687303715884105728"),
	new ArbInt("340282366920938463463374607431768211456"),
	new ArbInt("680564733841876926926749214863536422912"),
	new ArbInt("1361129467683753853853498429727072845824"),
	new ArbInt("2722258935367507707706996859454145691648"),
	new ArbInt("5444517870735015415413993718908291383296"),
	new ArbInt("10889035741470030830827987437816582766592"),
	new ArbInt("21778071482940061661655974875633165533184"),
	new ArbInt("43556142965880123323311949751266331066368"),
	new ArbInt("87112285931760246646623899502532662132736"),
	new ArbInt("174224571863520493293247799005065324265472"),
	new ArbInt("348449143727040986586495598010130648530944"),
	new ArbInt("696898287454081973172991196020261297061888"),
	new ArbInt("1393796574908163946345982392040522594123776"),
	new ArbInt("2787593149816327892691964784081045188247552"),
	new ArbInt("5575186299632655785383929568162090376495104"),
	new ArbInt("11150372599265311570767859136324180752990208"),
	new ArbInt("22300745198530623141535718272648361505980416"),
	new ArbInt("44601490397061246283071436545296723011960832"),
	new ArbInt("89202980794122492566142873090593446023921664"),
	new ArbInt("178405961588244985132285746181186892047843328"),
	new ArbInt("356811923176489970264571492362373784095686656"),
	new ArbInt("713623846352979940529142984724747568191373312"),
	new ArbInt("1427247692705959881058285969449495136382746624"),
	new ArbInt("2854495385411919762116571938898990272765493248"),
	new ArbInt("5708990770823839524233143877797980545530986496"),
	new ArbInt("11417981541647679048466287755595961091061972992"),
	new ArbInt("22835963083295358096932575511191922182123945984"),
	new ArbInt("45671926166590716193865151022383844364247891968"),
	new ArbInt("91343852333181432387730302044767688728495783936"),
	new ArbInt("182687704666362864775460604089535377456991567872"),
	new ArbInt("365375409332725729550921208179070754913983135744"),
	new ArbInt("730750818665451459101842416358141509827966271488"),
	new ArbInt("1461501637330902918203684832716283019655932542976"),
	new ArbInt("2923003274661805836407369665432566039311865085952"),
	new ArbInt("5846006549323611672814739330865132078623730171904"),
	new ArbInt("11692013098647223345629478661730264157247460343808"),
	new ArbInt("23384026197294446691258957323460528314494920687616"),
	new ArbInt("46768052394588893382517914646921056628989841375232"),
	new ArbInt("93536104789177786765035829293842113257979682750464")
];

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
	if (process.cp === undefined) {
		process.cp = require("child_process");
	}
	var PIXDEPTH = 1;
	var msievePath = "/var/task/factorization-dependencies/aws-msieve -s /tmp/msieve.dat -q -m";
	var primecountPath = "/var/task/factorization-dependencies/aws-primecount -c 1";
	var logintPath = "/var/task/factorization-dependencies/aws-logint";
	const factorsRegex = new RegExp(/p\d+: (\d+)/gm);
	const numberRegex = new RegExp(/\d+/gm);
	const piXRegex = new RegExp(/\d+/gm);
	var output = {};
	const Prime = new (function Prime () {
		this.launchAsyncProcesses = function () {
			this.msieveProcess = process.cp.exec(msievePath);
			this.logintProcess = process.cp.exec(logintPath);
			this.primecountProcess = process.cp.exec(primecountPath);
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
		this.newPiXChain = function (newFactors) {
			var id = this.piXChains.push(newFactors) - 1;
			return id;
		}
		this.parsePrimecountOutput = function (stdout) {
			var output = stdout.match(piXRegex);
			if (this.piXHistory[output[0]] === undefined) this.piXHistory[output[0]] = new ArbInt(output[1]);
			else AWSCallback("overwrite error!");
			//console.log("output from primecount: " + output[0] + " " + output[1]);
			if (typeof this.primecountQueueCallbacks[this.primecountQueueCurrentIndex] === "function") {
				this.primecountQueueCallbacks[this.primecountQueueCurrentIndex](output[1]);
				this.primecountQueueCurrentIndex++;
				this.parseNextPiX();
				/*if (this.primecountQueueCeilingIndex > this.primecountQueueCurrentIndex) {
					this.primecountProcess.stdin.write(this.primecountQueueInputs[this.primecountQueueCurrentIndex]+"\n");
				}*/
			}
		}
		this.parseLogintOutput = function (stdout) {
			var output = stdout.match(piXRegex);
			if (this.piXHistory[output[0]] === undefined) this.piXHistory[output[0]] = new ArbInt(output[1]);
			else AWSCallback("overwrite error!");
			//console.log("output from logint: " + output[0] + " " + output[1]);
			if (typeof this.logintQueueCallbacks[this.logintQueueCurrentIndex] === "function") {
				this.logintQueueCallbacks[this.logintQueueCurrentIndex](output[1]);
				this.logintQueueCurrentIndex++;
				this.parseNextPiX();
				/*if (this.logintQueueCeilingIndex > this.logintQueueCurrentIndex) {
					this.logintProcess.stdin.write(this.logintQueueInputs[this.logintQueueCurrentIndex]+"\n");
				}*/
			}
		}
		this.parseNextPiX = function () {
			if (this.piXSwitchCursor === this.piXSwitch.length) return;
			if (this.piXSwitch[this.piXSwitchCursor] === true) {
				if (this.logintQueueCeilingIndex > this.logintQueueCurrentIndex) {
					this.logintProcess.stdin.write(this.logintQueueInputs[this.logintQueueCurrentIndex]+"\n");
				}
			} else {
				if (this.primecountQueueCeilingIndex > this.primecountQueueCurrentIndex) {
					this.primecountProcess.stdin.write(this.primecountQueueInputs[this.primecountQueueCurrentIndex]+"\n");
				}
			}
			this.piXSwitchCursor++;
		}
		this.piXSwitch = []; //True means logint, false means primecount
		this.piXSwitchCursor = 0;
		this.piXChains = [];
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
			"2":  new ArbInt("1"),
			"3":  new ArbInt("2"),
			"5":  new ArbInt("3"),
			"7":  new ArbInt("4"),
			"11": new ArbInt("5")
		};
		this.getPiX = function (number, callback, ignoreDepth) {
			//console.log("Getting piX for " + number, typeof number);
			if (number <= 1) callback(1);
			else if (number >= PIXDEPTH && this.piXHistory[number] !== undefined) {
				//console.log("Using pre-processed callback for number: " + number + "with piX value: " + this.piXHistory[number]);
				callback(this.piXHistory[number].value);
			} else if (number > 9999999999999) {
				this.piXSwitch.push(true);
				this.logintQueueCeilingIndex++;
				this.logintQueueInputs.push(number.toString());
				this.logintQueueCallbacks.push(callback);
				//console.log("Using logint for number: " + number);
				if ((this.logintQueueCurrentIndex + 1) === this.logintQueueCeilingIndex && this.primecountQueueCurrentIndex === this.primecountQueueCeilingIndex) {
					//this.logintProcess.stdin.write(number.toString()+"\n");
					this.parseNextPiX();
				}
			} else if (number >= PIXDEPTH || ignoreDepth === true) {
				//console.log("Using primecount for number: " + number);
				this.piXSwitch.push(false);
				this.primecountQueueCeilingIndex++;
				this.primecountQueueInputs.push(number.toString());
				this.primecountQueueCallbacks.push(callback);
				if (this.logintQueueCurrentIndex === this.logintQueueCeilingIndex && (this.primecountQueueCurrentIndex + 1) === this.primecountQueueCeilingIndex) {
					//this.primecountProcess.stdin.write(number.toString()+"\n");
					this.parseNextPiX();
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

	const Factor = function (value, power, isPrime, onCompletelyDone, piXChainID) {
		this.onCompletelyDone = onCompletelyDone;
		this.isPrime = isPrime;
		this.factors = new Array();
		this.piXChainID = piXChainID;
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
		var postponePiX = false;
		if (parseInt(newPiX) <= 1 || newPiX === null) {
			console.log("caught terminating piX...", this.value, newPiX);
			this.piX = newPiX;
			this.childDone("piX");
		} else {
			if (this.piXChainID !== undefined) {
				var pos = Prime.piXChains[this.piXChainID].indexOf(this.value);
				//console.log(pos, (new ArbInt(newPiX)).value);
				if (pos > 0) {
					var previousPiX = Prime.piXChains[this.piXChainID][pos - 1];
					if (Prime.piXHistory[previousPiX] !== undefined) {
						console.log(this.piXChainID, Prime.piXChains[this.piXChainID], this.value, "pos: " + pos);
						//console.log(pos, Prime.piXHistory[Prime.piXChains[this.piXChainID][pos - 1]].value);
						var deltaNewPiX = (new ArbInt(newPiX));
						//console.log(deltaNewPiX.value, Prime.piXHistory[previousPiX].value);
						deltaNewPiX.subtract(Prime.piXHistory[previousPiX]);
						//console.log(deltaNewPiX.value);
						newPiX = deltaNewPiX.value;
					} else {
						this.tempPiX = newPiX;
						postponePiX = true;
						Prime.getPiX(previousPiX, this.subtractPiX.bind(this), true);
					}
				}
			}
			console.log("postponePiX: " + postponePiX);
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
		var deltaNewPiX = new ArbInt(this.tempPiX);
		deltaNewPiX.subtract(new ArbInt(subtraction));
		var newPiX = deltaNewPiX.value;
		if (parseInt(newPiX) <= 1 || newPiX === null) {
			this.piX = newPiX;
			this.childDone("piX");
		} else this.piX = new Factor(newPiX, "1", false, this.childDone.bind(this, "piX"));
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

module.exports.factorize({number: "99999999999999999999999999999999999999999999999943"}, null, console.log);