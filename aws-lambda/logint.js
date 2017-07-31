const cp = require("child_process");
const lib = cp.exec("/var/task/factorization-dependencies/aws-logint");
console.log("Logint running on: " + lib.pid);
process.on("message", function (message) {lib.stdin.write(message)});
lib.stdout.on("data", function (data) {process.send(data)});