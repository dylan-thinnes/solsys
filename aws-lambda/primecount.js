const cp = require("child_process");
const lib = cp.exec("/var/task/factorization-dependencies/aws-primecount -c 1");
console.log("Primecount running on: " + lib.pid);
process.on("message", function (message) {lib.stdin.write(message)});
lib.stdout.on("data", function (data) {process.send(data)});