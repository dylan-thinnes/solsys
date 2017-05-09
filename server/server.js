const http = require("http");
const url = require("url");
const {Factor, setPiXDepth, setVerbose, setWindowsPaths} = require("./factor.js");
const argv = process.argv.slice(2);
setVerbose(argv.includes("-v"));
var piXDepthPos = argv.indexOf("-d");
if (piXDepthPos > -1) setPiXDepth(parseInt(argv[piXDepthPos + 1]));
setWindowsPaths(!argv.includes("-l"));

var server = new http.createServer();
server.on("request", function (request, response) {
	var number = parseInt(url.parse(request.url).pathname.substring(1));
	console.log(number);
	if (isNaN(number)) response.end("NaN");
	else var currfactor = new Factor(number, 1, false, function () { response.end(this.deepClone()); });
});
server.listen(80);
