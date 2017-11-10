# [SolSys](http://solsys.me)
SolSys is an art / programming project that uses the fact that any given integer can be represented as a set of prime factors to turn numbers and equations into unique, recursively defined prime numbers.

By using existing prime factorization libraries such as primecount and msieve, the server-side prime factorization can handle numbers in ranges as high as 50 digits in under a second, even on low-end processors.

Everything in this program and document is set to change at any moment depending on needs.

## Solsys Client, /client
Solsys Client is the program which takes number blueprints and then produces graphics for them and presents them on a website. It also provides a UI and a number of other graphical items to help the user fully leverage the beauty of solsys. It does no processing of its own in order to obscure the actual process that solsys uses from the client.

## Solsys Lambda, /aws-lambda
Solsys Lambda is server-side program that runs on Amazon Web Services' "Lambda"  product. It produces profiles and blueprints for any given number and all of the heavy lifting for solsys calculations to produce blueprints which the client can construct graphics from.

**Usage**: Sample requests for processing can be made to the following endpoint:  
`https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=<YOUR NUMBER HERE>`  
A special header, "`x-api-key`", needs to be set to the value "`LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM`" in order to be properly authenticated for the AWS API Gateway endpoint through which data is sent.  
An example of obtaining the factorization for the number 234 through curl is as follows:  
`curl -H "x-api-key: LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM" https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=234`

## Solsys Reddit, /subreddit
Contains resources for the subreddit [r/solsys](https://reddit.com/r/solsys) styles and appearance (by no means comprehensive). The subreddit would ideally be a place for collaboration and sharing of insight or knowledge that endusers have gleaned.
