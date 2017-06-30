console.log("Start time: " + (startTime = Date.now()).toString());
const {RootFactor, setPiXDepth, setVerbose, setPaths} = require("./factor.js");
const argv = process.argv.slice(2);
let random = argv.includes("-r");
if (random) {
	var number = (Math.floor(Math.random()*9) + 1).toString();
	for (var ii = 0; ii < 49; ii++) {
		number += (Math.floor(Math.random()*10)).toString();
	}
	console.log("Random number chosen: " + number);
} else {
	var number = argv[argv.indexOf("-n") + 1];
}
if (isNaN(number)) process.exit(-1);
let power = parseInt(argv[argv.indexOf("-p") + 1]);
if (isNaN(power)) power = 1;
setVerbose(argv.includes("-v"));
var piXDepthPos = argv.indexOf("-d");
if (piXDepthPos > -1) setPiXDepth(parseInt(argv[piXDepthPos + 1]));
setPaths(!argv.includes("-l"));
const currfactor = new RootFactor(number, power, function () {
	console.log("Time elapsed: " + (Date.now() - startTime).toString());
});