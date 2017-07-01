# [SolSys](http://solsys.me)
SolSys is an art / programming project that uses the fact that any given integer can be represented as a set of prime factors to turn numbers and equations into unique, recursively defined prime numbers.

By using existing prime factorization libraries such as primecount and msieve, the server-side prime factorization can handle numbers in ranges as high as 50 digits in under a second, even on low-end processors.

Everything in this program and document is set to change at any moment depending on needs.

# Usage
## Solsys Standalone
Solsys Standalone runs locally on the client's computer, and is located in solsys/server. It contains two files of note: `factor.js` and `cmd.js`. `factor.js` is a node module that does all of the heavy lifting and processing by running `primecount` and `msieve` executables in separate child process. The executables can be found in `server/factorization-dependencies/`. `cmd.js` is a node program which allows you to run the module a total of once with command line arguments.

The command line arguments are as follows:  
`-n <number>` (REQUIRED & ONLY FOR cmd.js) Tells cmd.js the number you want to factorize.  
`-p <power>` (ONLY FOR cmd.js) Tells cmd.js which power to attribute to the factorized number. Defaults to 1.  
`-d <minNumber>` The minimum number for which to find π(\<number\>). Defaults to 999999.  
`-v` Runs the program in VERBOSE mode, akin to debug mode for now.  
`-l` Runs the program with linux command line arguments, necessary to run on linux.  
`-r` Runs the program with a random 50 digit number.

## Solsys Lambda
Solsys Lambda is stripped-down and specially compiled derivative of Solsys Standalone that runs on Amazon Web Services' "Lambda" and "API Gateway" products. It can be accessed through a GET request to the following endpoint:
`https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=<YOUR NUMBER HERE>`
A special header, "`x-api-key`", needs to be set to the value "`LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM`" in order to be properly authenticated for this AWS API Gateway endpoint.

An example of obtaining the factorization for the number 234 through curl is as follows:
`curl -H "x-api-key: LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM" https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=234`