const cp = require("child_process");
const lib = cp.exec("/var/task/factorization-dependencies/aws-msieve -s /tmp/msieve.dat -q -m");
console.log("Msieve running on: " + lib.pid);
process.on("message", function (message) {lib.stdin.write(message)});
lib.stdout.on("data", function (data) {process.send(data)});