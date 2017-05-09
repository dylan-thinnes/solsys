const http = require("http");
const url = require("url");
const {Factor, setPiXDepth, setVerbose, setWindowsPaths} = require("./factor.js");
const argv = process.argv.slice(2);
setVerbose(argv.includes("-v"));
setPiXDepth(argv.includes("-d"));
setWindowsPaths(!argv.includes("-l"));

var server = new http.createServer();
server.on("request", function (request, response) {
	var number = parseInt(url.parse(request.url).pathname.substring(1));
	console.log(number);
	if (isNaN(number)) response.end("NaN");
	else var currfactor = new Factor(number, 1, false, function () { response.end(this.deepClone()); });
});
server.listen(80);
