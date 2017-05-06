const http = require("http");
const url = require("url");
const {Factor} = require("./factor.js");

var server = new http.createServer();
server.on("request", function (request, response) {
	var number = parseInt(url.parse(request.url).pathname.substring(1));
	if (isNaN(number)) response.end("NaN");
	else {
		console.log(number);
		var currfactor = new Factor(number, 1, false, function () { response.end(this.deepClone()); });
	}
});
server.listen(80);