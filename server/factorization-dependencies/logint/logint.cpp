//This is a logarithmic integral function lifted directly from primecount's own logarithmic integral code. It is fully precise in the larger ranges it is designed to operate in (>1e13) thanks to 512-bit floating point formats provided by mpfr.
#include <stdio.h>
#include <string>
#include <gmp.h>
#include <mpfr.h>

mpfr_t GAMMA;
mpfr_t LI2;
mpfr_t LIMIT;
mpfr_t sum;
mpfr_t inner_sum;
mpfr_t inner_increment;
mpfr_t factorial;
mpfr_t p;
mpfr_t q;
mpfr_t power2;
mpfr_t term;
mpfr_t abs_term;
int k;
mpfr_t logx;
mpfr_t sqrtx;
mpfr_t result;

void Li(mpfr_t output, mpfr_t x)
{
	if (mpfr_cmp_ui (x, 2) >= 0)
	{
		mpfr_init_set_si (sum, 0, MPFR_RNDN);
		mpfr_init_set_si (inner_sum, 0, MPFR_RNDN);
		mpfr_init_set_si (inner_increment, 1, MPFR_RNDN);
		mpfr_init_set_si (factorial, 1, MPFR_RNDN);
		mpfr_init_set_si (p, -1, MPFR_RNDN);
		mpfr_init_set_si (q, 0, MPFR_RNDN);
		mpfr_init_set_si (power2, 1, MPFR_RNDN);
		mpfr_init_set_si (term, 0, MPFR_RNDN);
		mpfr_init_set_si (abs_term, 0, MPFR_RNDN);
		k = 0;

		mpfr_init_set_ui (logx, 0, MPFR_RNDN);
		mpfr_log(logx, x, MPFR_RNDN);

		mpfr_init_set_ui (sqrtx, 0, MPFR_RNDN);
		mpfr_sqrt(sqrtx, x, MPFR_RNDN);

		for (int n = 1; n < 200; n++)
		{
			mpfr_mul (p, p, logx, MPFR_RNDN);
			mpfr_neg (p, p, MPFR_RNDN);
			mpfr_mul_si (factorial, factorial, n, MPFR_RNDN);
			mpfr_mul (q, factorial, power2, MPFR_RNDN);
			mpfr_mul_si (power2, power2, 2, MPFR_RNDN);
			for (; k <= (n - 1) / 2; k++)
			{
				mpfr_set_ui (inner_increment, 1, MPFR_RNDN);
				mpfr_div_ui (inner_increment, inner_increment, 2 * k + 1, MPFR_RNDN);
				mpfr_add (inner_sum, inner_sum, inner_increment, MPFR_RNDN);
			}
			mpfr_div (term, p, q, MPFR_RNDN);
			mpfr_mul (term, term, inner_sum, MPFR_RNDN);
			mpfr_add (sum, sum, term, MPFR_RNDN);
			mpfr_abs (abs_term, term, MPFR_RNDN);
			if (mpfr_cmp (abs_term, LIMIT) < 0)
				break;
		}

		mpfr_init_set_si (result, 0, MPFR_RNDN);
		mpfr_mul (result, sqrtx, sum, MPFR_RNDN);
		mpfr_log (logx, logx, MPFR_RNDN);
		mpfr_add (result, result, logx, MPFR_RNDN);
		mpfr_add (result, result, GAMMA, MPFR_RNDN);
		mpfr_sub (result, result, LI2, MPFR_RNDN);
		mpfr_floor (result, result);

		mpfr_set (output, result, MPFR_RNDN);
	}
	else
	{
		mpfr_set_ui (output, 0, MPFR_RNDN);
	}
}

int main ()
{
	mpfr_set_default_prec(512);
	mpfr_init_set_str (GAMMA, "0.577215664901532860606512090082402431042159335939923598805767234884867726777664670936947063291746749", 10, MPFR_RNDN);
	mpfr_init_set_str (LI2, "1.04516378011749278484458888919461313652261557815120157583290914407501320521035953017271740562638335630602", 10, MPFR_RNDN);
	mpfr_init_set_str (LIMIT, "0.000000000000000000000000000000000000000000000000001", 10, MPFR_RNDN);
	mpfr_t input;
	mpfr_init_set_ui (input, 0, MPFR_RNDN);
	mpfr_inp_str (input, stdin, 10, MPFR_RNDN);
	while (mpfr_zero_p(input) == 0)
	{
		Li(input, input);
		mpfr_printf ("%.0Rf\n", input);
		mpfr_inp_str (input, stdin, 10, MPFR_RNDN);
	}
}