//This is a logarithmic integral function lifted directly from primecount's own logarithmic integral code. It is not fully precise in the larger ranges it is designed to operate in (>1e13), however the error in the logarithmic integral is large anyways so this is not a concern. Copying this code into a separate executable is an easy way to circumvent the unnecessary 2^63 limit imposed by primecount's parser.

#include <iostream>
#include <cmath>
#include <limits>
#include <iomanip>
using namespace std;
long double li(long double x)
{
  long double gamma = 0.57721566490153286061;
  long double sum = 0;
  long double inner_sum = 0;
  long double factorial = 1;
  long double p = -1;
  long double q = 0;
  long double power2 = 1;
  long double term;
  int k = 0;

  for (int n = 1; n < 200; n++)
  {
    p *= -log(x);
    factorial *= n;
    q = factorial * power2;
    power2 *= 2;
    for (; k <= (n - 1) / 2; k++)
      inner_sum += 1.0L / (2 * k + 1);
    term = (p / q) * inner_sum;
    sum += term;
    if (abs(term) < numeric_limits<double>::epsilon())
      break;
  }

  return gamma + log(log(x)) + sqrt(x) * sum;
}

/// Calculate the offset logarithmic integral which is a very
/// accurate approximation of the number of primes <= x.
/// Li(x) > pi(x) for 24 <= x <= ~ 10^316
long double Li(long double x)
{
  if (x < 2)
    return 0;

  long double li2 = 1.04516378011749278484;

  return li(x) - li2;
}

int main (int argc, char* argv[]) {
    long double userNum;
    long double result;
    cout.precision(0);
    cin >> userNum;
    cin.ignore(1000, '\n');
    do
    {
      if (userNum == 0) break;
      long double result = Li(userNum);
      cout << fixed << result << endl;
      cin >> userNum;
      cin.ignore(1000,'\n');
    }
    while (userNum != 0);
}