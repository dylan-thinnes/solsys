# [SolSys](http://solsys.me)
SolSys is an art / programming project that uses the fact that any given integer can be represented as a set of prime factors to turn numbers and equations into unique, recursively defined prime numbers.

By using existing prime factorization libraries such as primecount and msieve, the server-side prime factorization can handle numbers in ranges as high as 50 digits in under a second, even on low-end processors.

Everything in this program and document is set to change at any moment depending on needs.

# Usage
Solsys Server is the only currently (rudimentarily) operational part of this program. There are three files of note: `factors.js`, `server.js`, and `test.js`. `factor.js` is a node module that does all of the heavy lifting and processing by using command line requests to primecount and msieve in server/factorization-dependencies/. test.js is a node program which allows you to run the module a total of once with command line arguments, whereas server.js is a node program that runs a server which will respond to http requests with the JSON representation of any number in the request url. server.js has only been tested for Windows 10, it might not work elsewhere.

The command line arguments are as follows:  
`-n <number>` (REQUIRED & ONLY FOR test.js) Tells test.js the number you want to factorize.  
`-p <power>` (ONLY FOR test.js) Tells test.js which power to attribute to the factorized number. Defaults to 1.  
`-d <minNumber>` The minimum number for which to find π(\<number\>). Defaults to 999999.  
`-v` Runs the program in VERBOSE mode, akin to debug mode for now.  
`-l` Runs the program with linux command line arguments, necessary to run on linux.

Server example:  
The request \<domain name here\>.com/23 will factor the number 23 and return its JSON representation as its response.
