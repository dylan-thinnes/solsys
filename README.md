# [SolSys](http://solsys.me)
SolSys is an art / programming project that uses the fact that any given integer can be represented as a set of prime factors to turn numbers and equations into unique, recursively defined prime numbers.

By using existing prime factorization libraries such as primecount and msieve, the server-side prime factorization can handle numbers in ranges as high as 50 digits in under a second, even on low-end processors.

Everything in this program and document is set to change at any moment depending on needs.

## Solsys Client, /client
Solsys Client is the program which takes number blueprints and then produces graphics for them. It also provides a UI and a number of other graphical items to help the user fully leverage the beauty of solsys.

## Solsys Lambda, /aws-lambda
Solsys Lambda is stripped-down and specially compiled program that runs on Amazon Web Services' "Lambda" and "API Gateway" products. It produces profiles and blueprints for any given number and does practically all of the heavy lifting for solsys calculations.

It can be accessed through a GET request to the following endpoint:
`https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=<YOUR NUMBER HERE>`
A special header, "`x-api-key`", needs to be set to the value "`LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM`" in order to be properly authenticated for this AWS API Gateway endpoint.

An example of obtaining the factorization for the number 234 through curl is as follows:
`curl -H "x-api-key: LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM" https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=234`

## Solsys Reddit, /subreddit
Contains resources for the subreddit styles and appearance.
