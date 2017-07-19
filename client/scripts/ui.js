var ArbNum = function (value, length) {
	this.length = length === undefined ? 100 : length;
	this.buffer = new ArrayBuffer(this.length);
	this.reader = new Uint8Array(this.buffer);
	this.value = value;
}
Object.defineProperties(ArbNum.prototype, {
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
ArbNum.prototype.setDigit = function (place, newDigit) {
	if (place < this.length) this.reader[place] = newDigit;
}
ArbNum.prototype.getDigit = function (place) {
	if (place >= this.length) return 0;
	return this.reader[place];
}
ArbNum.prototype.addDigit = function (place, operand) {
	var res = this.getDigit(place) + operand;
	if (res > 9) {
		this.setDigit(place, res - 10);
		this.addDigit(place + 1, 1);
	} else {
		this.setDigit(place, res);
	}
}
ArbNum.prototype.subtractDigit = function (place, operand) {
	var res = this.getDigit(place) - operand;
	if (res < 0) {
		this.setDigit(place, 10 + res);
		this.subtractDigit(place + 1, 1);
	} else {
		this.setDigit(place, res);
	}
}
ArbNum.prototype.add = function (operand) {
	if (operand.constructor !== ArbNum) var operand = new ArbNum(operand);
	var minLength = operand.length > this.length ? this.length : operand.length;
	for (var ii = 0; ii < minLength; ii++) {
		this.addDigit(ii, operand.getDigit(ii));
	}
}
ArbNum.prototype.subtract = function (operand) {
	if (operand.constructor !== ArbNum) var operand = new ArbNum(operand);
	var minLength = operand.length > this.length ? this.length : operand.length;
	for (var ii = 0; ii < minLength; ii++) {
		this.subtractDigit(ii, operand.getDigit(ii));
	}
}
ArbNum.POW2 = [
	new ArbNum("1"),
	new ArbNum("2"),
	new ArbNum("4"),
	new ArbNum("8"),
	new ArbNum("16"),
	new ArbNum("32"),
	new ArbNum("64"),
	new ArbNum("128"),
	new ArbNum("256"),
	new ArbNum("512"),
	new ArbNum("1024"),
	new ArbNum("2048"),
	new ArbNum("4096"),
	new ArbNum("8192"),
	new ArbNum("16384"),
	new ArbNum("32768"),
	new ArbNum("65536"),
	new ArbNum("131072"),
	new ArbNum("262144"),
	new ArbNum("524288"),
	new ArbNum("1048576"),
	new ArbNum("2097152"),
	new ArbNum("4194304"),
	new ArbNum("8388608"),
	new ArbNum("16777216"),
	new ArbNum("33554432"),
	new ArbNum("67108864"),
	new ArbNum("134217728"),
	new ArbNum("268435456"),
	new ArbNum("536870912"),
	new ArbNum("1073741824"),
	new ArbNum("2147483648"),
	new ArbNum("4294967296"),
	new ArbNum("8589934592"),
	new ArbNum("17179869184"),
	new ArbNum("34359738368"),
	new ArbNum("68719476736"),
	new ArbNum("137438953472"),
	new ArbNum("274877906944"),
	new ArbNum("549755813888"),
	new ArbNum("1099511627776"),
	new ArbNum("2199023255552"),
	new ArbNum("4398046511104"),
	new ArbNum("8796093022208"),
	new ArbNum("17592186044416"),
	new ArbNum("35184372088832"),
	new ArbNum("70368744177664"),
	new ArbNum("140737488355328"),
	new ArbNum("281474976710656"),
	new ArbNum("562949953421312"),
	new ArbNum("1125899906842624"),
	new ArbNum("2251799813685248"),
	new ArbNum("4503599627370496"),
	new ArbNum("9007199254740992"),
	new ArbNum("18014398509481984"),
	new ArbNum("36028797018963968"),
	new ArbNum("72057594037927936"),
	new ArbNum("144115188075855872"),
	new ArbNum("288230376151711744"),
	new ArbNum("576460752303423488"),
	new ArbNum("1152921504606846976"),
	new ArbNum("2305843009213693952"),
	new ArbNum("4611686018427387904"),
	new ArbNum("9223372036854775808"),
	new ArbNum("18446744073709551616"),
	new ArbNum("36893488147419103232"),
	new ArbNum("73786976294838206464"),
	new ArbNum("147573952589676412928"),
	new ArbNum("295147905179352825856"),
	new ArbNum("590295810358705651712"),
	new ArbNum("1180591620717411303424"),
	new ArbNum("2361183241434822606848"),
	new ArbNum("4722366482869645213696"),
	new ArbNum("9444732965739290427392"),
	new ArbNum("18889465931478580854784"),
	new ArbNum("37778931862957161709568"),
	new ArbNum("75557863725914323419136"),
	new ArbNum("151115727451828646838272"),
	new ArbNum("302231454903657293676544"),
	new ArbNum("604462909807314587353088"),
	new ArbNum("1208925819614629174706176"),
	new ArbNum("2417851639229258349412352"),
	new ArbNum("4835703278458516698824704"),
	new ArbNum("9671406556917033397649408"),
	new ArbNum("19342813113834066795298816"),
	new ArbNum("38685626227668133590597632"),
	new ArbNum("77371252455336267181195264"),
	new ArbNum("154742504910672534362390528"),
	new ArbNum("309485009821345068724781056"),
	new ArbNum("618970019642690137449562112"),
	new ArbNum("1237940039285380274899124224"),
	new ArbNum("2475880078570760549798248448"),
	new ArbNum("4951760157141521099596496896"),
	new ArbNum("9903520314283042199192993792"),
	new ArbNum("19807040628566084398385987584"),
	new ArbNum("39614081257132168796771975168"),
	new ArbNum("79228162514264337593543950336"),
	new ArbNum("158456325028528675187087900672"),
	new ArbNum("316912650057057350374175801344"),
	new ArbNum("633825300114114700748351602688"),
	new ArbNum("1267650600228229401496703205376"),
	new ArbNum("2535301200456458802993406410752"),
	new ArbNum("5070602400912917605986812821504"),
	new ArbNum("10141204801825835211973625643008"),
	new ArbNum("20282409603651670423947251286016"),
	new ArbNum("40564819207303340847894502572032"),
	new ArbNum("81129638414606681695789005144064"),
	new ArbNum("162259276829213363391578010288128"),
	new ArbNum("324518553658426726783156020576256"),
	new ArbNum("649037107316853453566312041152512"),
	new ArbNum("1298074214633706907132624082305024"),
	new ArbNum("2596148429267413814265248164610048"),
	new ArbNum("5192296858534827628530496329220096"),
	new ArbNum("10384593717069655257060992658440192"),
	new ArbNum("20769187434139310514121985316880384"),
	new ArbNum("41538374868278621028243970633760768"),
	new ArbNum("83076749736557242056487941267521536"),
	new ArbNum("166153499473114484112975882535043072"),
	new ArbNum("332306998946228968225951765070086144"),
	new ArbNum("664613997892457936451903530140172288"),
	new ArbNum("1329227995784915872903807060280344576"),
	new ArbNum("2658455991569831745807614120560689152"),
	new ArbNum("5316911983139663491615228241121378304"),
	new ArbNum("10633823966279326983230456482242756608"),
	new ArbNum("21267647932558653966460912964485513216"),
	new ArbNum("42535295865117307932921825928971026432"),
	new ArbNum("85070591730234615865843651857942052864"),
	new ArbNum("170141183460469231731687303715884105728"),
	new ArbNum("340282366920938463463374607431768211456"),
	new ArbNum("680564733841876926926749214863536422912"),
	new ArbNum("1361129467683753853853498429727072845824"),
	new ArbNum("2722258935367507707706996859454145691648"),
	new ArbNum("5444517870735015415413993718908291383296"),
	new ArbNum("10889035741470030830827987437816582766592"),
	new ArbNum("21778071482940061661655974875633165533184"),
	new ArbNum("43556142965880123323311949751266331066368"),
	new ArbNum("87112285931760246646623899502532662132736"),
	new ArbNum("174224571863520493293247799005065324265472"),
	new ArbNum("348449143727040986586495598010130648530944"),
	new ArbNum("696898287454081973172991196020261297061888"),
	new ArbNum("1393796574908163946345982392040522594123776"),
	new ArbNum("2787593149816327892691964784081045188247552"),
	new ArbNum("5575186299632655785383929568162090376495104"),
	new ArbNum("11150372599265311570767859136324180752990208"),
	new ArbNum("22300745198530623141535718272648361505980416"),
	new ArbNum("44601490397061246283071436545296723011960832"),
	new ArbNum("89202980794122492566142873090593446023921664"),
	new ArbNum("178405961588244985132285746181186892047843328"),
	new ArbNum("356811923176489970264571492362373784095686656"),
	new ArbNum("713623846352979940529142984724747568191373312"),
	new ArbNum("1427247692705959881058285969449495136382746624"),
	new ArbNum("2854495385411919762116571938898990272765493248"),
	new ArbNum("5708990770823839524233143877797980545530986496"),
	new ArbNum("11417981541647679048466287755595961091061972992"),
	new ArbNum("22835963083295358096932575511191922182123945984"),
	new ArbNum("45671926166590716193865151022383844364247891968"),
	new ArbNum("91343852333181432387730302044767688728495783936"),
	new ArbNum("182687704666362864775460604089535377456991567872"),
	new ArbNum("365375409332725729550921208179070754913983135744"),
	new ArbNum("730750818665451459101842416358141509827966271488"),
	new ArbNum("1461501637330902918203684832716283019655932542976"),
	new ArbNum("2923003274661805836407369665432566039311865085952"),
	new ArbNum("5846006549323611672814739330865132078623730171904"),
	new ArbNum("11692013098647223345629478661730264157247460343808"),
	new ArbNum("23384026197294446691258957323460528314494920687616"),
	new ArbNum("46768052394588893382517914646921056628989841375232"),
	new ArbNum("93536104789177786765035829293842113257979682750464")
];

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
		this.result = new ArbNum(this.input);
	} else {
		this.result = new ArbNum();
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
				if (codePoints[inputLength - ii - 1] & cursorMask) this.result.add(ArbNum.POW2[ii * smallLength + cursor]);
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
document.body.onload = function () {
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
	stage2.newButton("reddit", "share", document.getElementById("reddit"));
	stage2.newButton("facebook", "share", document.getElementById("facebook"));
	stage2.newButton("twitter", "share", document.getElementById("twitter"));

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