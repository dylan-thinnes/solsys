const factorize = require("./handler.js").factorize;
var number = process.argv[2];
factorize({
	"number": number,
	"piXDepth": "1"
}, null, (_, res) => {console.log(JSON.stringify(res));});
