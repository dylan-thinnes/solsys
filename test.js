const {Factor, setPiXDepth, setVerbose} = require("./factor.js");
const argv = process.argv.slice(2);
let number = parseInt(argv[argv.indexOf("-n") + 1]);
if (isNaN(number)) process.exit(-1);
let power = parseInt(argv[argv.indexOf("-p") + 1]);
if (isNaN(power)) power = 1;
setPiXDepth(argv.includes("-d"));
setVerbose(argv.includes("-v"));
const currfactor = new Factor(number, power, false, function () { console.log(this.deepClone()); });