const http = require("http");
const { spawnSync } = require("child_process");
const url = require("url");

var local_node = (number) => 
    spawnSync(`node ../aws-lambda/testHandler.js ${number}`
             ,{ shell: "/bin/bash" }
             );
var local_hs   = (number) => 
    spawnSync(`./run-main ${number}`
              ,{ shell: "/bin/bash", cwd: "../../../solsys-functional/backend/" }
              );

var server = http.createServer((req,res) => {
    // Prepare response w/ correct headers
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")

    // Extract params
    var params = url.parse(req.url, true);
    var number = params.query.number;
    if (number == null) return res.end("No number specified.");

    // Try to run corresponding bash command
    if (params.pathname === "/hs")        var result = local_hs(number)
    else if (params.pathname === "/node") var result = local_node(number);
    else return res.end("Could not recognize endpoint.");

    var { stdout, stderr } = result;
    // Handle results
    if (stdout == null || (stderr != null && stderr.toString() != "")) {
        console.log("Error occurred w/ command", result);
        if (stderr != null) console.log(stderr.toString());
        res.end("");
    } else {
        stdout = stdout.toString();
        profile = JSON.parse(stdout);
        result = JSON.stringify(profile);
        console.log(new Date(), number);
        res.end(result);
    }
});

server.listen(3000);
