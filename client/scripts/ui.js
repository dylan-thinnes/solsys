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

// The Seed class is a class for creating ArbNums from strings that may or may not contain single-byte, double-byte, or quad-byte unicode characters. It analyzes the given input string and determines whether it is a number (type: Seed.NUMBER), an ASCII/single-byte string (type: Seed.ASCII), double-byte string (type: Seed.UTF16), or quad-byte string (type: Seed.UTF32). Using this information, it knows how many bits to allocate to each letter and produces a corresponding ArbInt from the stringed together bits.
var Seed = function (input) {
	this.input = input;
	this.type = Seed.NUMBER;
	var inputLength = input.length;
	var codePoints = [];
	var maxCodePoint = 57;
	for (var ii = 0; ii < inputLength; ii++) {
		codePoints[ii] = input.codePointAt(ii);
		if (codePoints[ii] > maxCodePoint || codePoints[ii] < 48) maxCodePoint = codePoints[ii];
	}
	if (maxCodePoint === 57) {
		this.result = new ArbInt(this.input);
	} else {
		this.result = new ArbInt();
		var bigLength = 0;
		var smallLength = 0;
		if (maxCodePoint < 256) {
			this.type = Seed.ASCII;
			smallLength = 8;
			bigLength = 256;
		} else if (maxCodePoint < 65536) {
			this.type = Seed.UTF16;
			smallLength = 16;
			bigLength = 65536;
		} else if (maxCodePoint < 4294967296) {
			this.type = Seed.UTF32;
			smallLength = 32;
			bigLength = 4294967296;
		}
		for (var ii = 0; ii < inputLength; ii++) {
			var cursor = 0;
			var cursorMask = 1;	
			while (cursor < smallLength) {
				if (codePoints[inputLength - ii - 1] & cursorMask) this.result.add(ArbInt.POW2[ii * smallLength + cursor]);
				cursor++;
				cursorMask *= 2;
			}
		}
	}
}
Seed.NUMBER = 0;
Seed.ASCII = 1;
Seed.UTF16 = 2;
Seed.UTF32 = 3;

// The Buttons class serves to create "groups" of buttons, with each Buttons object representing a singular group, with associated functions for hiding and showing the group entirely and choosing which button in the group should be focused and visually on (others will turn off automatically).
var Buttons = function () {
	this.buttons = {}
	this.groups = {}
}
Buttons.prototype.newButton = function (name, group, element, disableDefaultHandling, onCallback, offCallback) {
	this.buttons[name] = {
		name: name,
		group: group,
		element: element,
		onCallback: onCallback,
		offCallback: offCallback,
		icon: element.getElementsByClassName("icon")[0],
		on: false
	}
	if (disableDefaultHandling !== true) element.addEventListener("mousedown", this.buttonToggle.bind(this, name));
	if (group !== undefined) {
		if (this.groups[group] === undefined) this.newGroup(group, onCallback, offCallback);
		this.groups[group].buttons.push(name);
	}
}
Buttons.prototype.newGroup = function (name, onCallback, offCallback, displayType, preserveState) {
	this.groups[name] = {
		name: name,
		onCallback: onCallback,
		offCallback: offCallback,
		on: false,
		buttons: [],
		displayType: (displayType === undefined ? "flex" : displayType),
		preserveState: (preserveState ? true : false)
	}
}
Buttons.prototype.showGroup = function (name) {
	for (var ii = 0; ii < this.groups[name].buttons.length; ii++) {
		this.buttons[this.groups[name].buttons[ii]].element.style.display = this.groups[name].displayType;
	}
}
Buttons.prototype.hideGroup = function (name) {
	for (var ii = 0; ii < this.groups[name].buttons.length; ii++) {
		this.buttons[this.groups[name].buttons[ii]].element.style.display = "";
		if (this.buttons[this.groups[name].buttons[ii]].on) {
			if (this.groups[name].preserveState) {
				if (typeof this.buttons[this.groups[name].buttons[ii]].offCallback === "function") this.buttons[this.groups[name].buttons[ii]].offCallback(this.groups[name].buttons[ii], event);
			} else {
				this.buttonOff(this.groups[name].buttons[ii]);
			}
		}
	}
}
Buttons.prototype.unfocusGroup = function (name) {
	for (var ii = 0; ii < this.groups[name].buttons.length; ii++) {
		this.buttonOff(this.groups[name].buttons[ii]);
	}
}
Buttons.prototype.unfocusButton = function (name) {
	if (name === undefined) var name = this.lastFocusedButtonName;
	this.buttons[name].icon.style.opacity = "";
}
Buttons.prototype.focusButton = function (name) {
	this.lastFocusedButtonName = name;
	this.buttons[name].icon.style.opacity = "1";
}
Buttons.prototype.buttonOn = function (name, event) {
	if (this.buttons[name].on === false) {
		if (this.groups[this.buttons[name].group] !== undefined) this.unfocusGroup(this.buttons[name].group);
		this.buttons[name].on = true;
		console.log(name, this.buttons[name].group, "button on");
		this.focusButton(name);
		if (typeof this.buttons[name].onCallback === "function") this.buttons[name].onCallback(name, event);
	}
}
Buttons.prototype.buttonOff = function (name, event) {
	if (this.buttons[name].on === true) {
		this.buttons[name].on = false;
		console.log(name, this.buttons[name].group, "button off");
		this.unfocusButton(name);
		if (typeof this.buttons[name].offCallback === "function") this.buttons[name].offCallback(name, event);
	}
}
Buttons.prototype.buttonToggle = function (name, event) {
	if (this.buttons[name].on === true) this.buttonOff(name, event);
	else this.buttonOn(name, event);
}
Buttons.prototype.groupOn = function (name, event) {
	this.groups[name].on = true;
	console.log(name, "group on");
	this.showGroup(name);
	if (typeof this.groups[name].onCallback === "function") this.groups[name].onCallback(name, event);
}
Buttons.prototype.groupOff = function (name, event) {
	this.groups[name].on = false;
	console.log(name, "group off");
	this.hideGroup(name);
	if (typeof this.groups[name].offCallback === "function") this.groups[name].offCallback(name, event);
}
Buttons.prototype.groupToggle = function (name, event) {
	if (this.groups[name].on === true) this.groupOff(name, event);
	else this.groupOn(name, event);
}

// This function runs once the body loads and sets up the stages and modes and their associated buttons. Will be replaced with a better, compatible implementation.
var loadUI = function () {
	var stage1 = new Buttons();
	var stage2 = new Buttons();

	stage1.newGroup("root");
	stage1.newButton("view", "root", document.getElementById("view"), false, stage2.groupToggle.bind(stage2, "view"), stage2.groupToggle.bind(stage2, "view"));
	stage1.newButton("edit", "root", document.getElementById("edit"), false, stage2.groupToggle.bind(stage2, "edit"), stage2.groupToggle.bind(stage2, "edit"));
	stage1.newButton("share", "root", document.getElementById("share"), false, stage2.groupToggle.bind(stage2, "share"), stage2.groupToggle.bind(stage2, "share"));

	stage2.newButton("orbit", "view", document.getElementById("orbit"));
	stage2.newButton("move", "view", document.getElementById("move"));
	stage2.newButton("zoom-in", "view", document.getElementById("zoom-in"));
	stage2.newButton("zoom-out", "view", document.getElementById("zoom-out"));
	stage2.newButton("rotate", "edit", document.getElementById("rotate"));
	stage2.newButton("paint", "edit", document.getElementById("paint"));
	stage2.newButton("seed", "edit", document.getElementById("seed"), true);
	stage2.newButton("link", "share", document.getElementById("link"));
	stage2.newButton("download", "share", document.getElementById("download"));
	/*stage2.newButton("reddit", "share", document.getElementById("reddit"));
	stage2.newButton("facebook", "share", document.getElementById("facebook"));
	stage2.newButton("twitter", "share", document.getElementById("twitter"));*/

	stage1.showGroup("root");

	/*var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
	var seed = MQ.MathField(document.getElementById("seed"), {
		supSubsRequireOperand: true,
		substituteTextarea: function () {
			var sub = document.createElement("textarea");
			var newAttr = document.createAttribute("autocapitalize");
			newAttr.value = "off";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("autocomplete");
			newAttr.value = "off";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("autocorrect");
			newAttr.value = "off";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("spellcheck");
			newAttr.value = "false";
			sub.setAttributeNode(newAttr);
			newAttr = document.createAttribute("x-palm-disable-ste-all");
			newAttr.value = "true";
			sub.setAttributeNode(newAttr);
			var escapeBackslash = function (event) {
				console.log(event.key);
				if (event.key === "\\") {
					console.log("stopping propagation");
					console.log(document.activeElement === event.target);
					event.stopPropagation();
					event.stopImmediatePropagation();
				}
			}
			return sub;
		}
	});*/
	document.getElementById("seed").addEventListener("keypress", function (event) {
		if (event.keyCode === 13 || event.charCode === 13) {
			event.preventDefault();
			console.log(currSeed = new Seed(event.target.innerHTML));
		}
	});
}
document.body.onload = loadUI;