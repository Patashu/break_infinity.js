# break_infinity.js
A replacement for decimal.js for incremental games who want to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e(9e15) ) and want to prioritize speed over accuracy.</br>
If you want to prioritize accuracy over speed, please use decimal.js instead.</br>
If you need to handle numbers as big as 1e(1.79e308), try break_break_infinity.js, which sacrifices speed to deal with such massive numbers.

https://github.com/Patashu/break_infinity.js

This library is open source and free to use/modify/fork for any purpose you want.

By Patashu.

---

Decimal has only two fields:

mantissa: A number (double) with absolute value between [1, 10) OR exactly 0. If mantissa is ever 10 or greater, it should be normalized (divide by 10 and add 1 to exponent until it is less than 10, or multiply by 10 and subtract 1 from exponent until it is 1 or greater). Infinity/-Infinity/NaN will cause bad things to happen.</br>
exponent: A number (integer) between -EXP_LIMIT and EXP_LIMIT. Non-integral/out of bounds will cause bad things to happen.

The decimal's value is simply mantissa*10^exponent.

Functions of Decimal:

fromMantissaExponent(mantissa, exponent)</br>
fromDecimal(value)</br>
fromNumber(value)</br>
fromString(value)</br>
fromValue(value)

toNumber()</br>
mantissaWithDecimalPlaces(places)</br>
toString()</br>
toFixed(places)</br>
toExponential(places)

abs(), neg(), sign()</br>
add(value), sub(value), mul(value), div(value), recip()</br>

cmp(value), eq(value), neq(value), lt(value), lte(value), gt(value), gte(value)</br>
cmp_tolerance(value, tolerance), eq_tolerance(value, tolerance), neq_tolerance(value, tolerance), lt_tolerance(value, tolerance), lte_tolerance(value, tolerance), gt_tolerance(value, tolerance), gte_tolerance(value, tolerance)

log(base), log10(), log2(), ln()</br>
pow(value, other), pow(value), pow_base(value), exp(), sqr(), sqrt(), cube(), cbrt()

---

So how much faster than decimal.js is break_infinity.js? Operations per second on my old-ish computer:</br>
pow(1.5): 5e6 (1e4 for decimal.js - 500x faster)</br>
exp: 2e7 (1e4 for decimal.js - 2000x faster)</br>
log: 3e7 (5e4 for decimal.js - 600x faster)</br>
add, mul: 1e8 (2e6 for decimal.js - 50x faster)

---

Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.

Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal
