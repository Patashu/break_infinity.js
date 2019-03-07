# break_infinity.js
A replacement for decimal.js for incremental games which need to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e(9e15) ) and want to prioritize speed over accuracy.</br>
If you want to prioritize accuracy over speed, please use decimal.js instead.</br>

https://github.com/Patashu/break_infinity.js

This library is open source and free to use/modify/fork for any purpose you want.

By Patashu.

NEW: C# port BreakInfinity.js / BigDouble.cs, for your C#/Unity incremental games: https://github.com/Razenpok/BreakInfinity.cs

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
toExponential(places)</br>
toPrecision(places)

abs(), neg(), sign()</br>
add(value), sub(value), mul(value), div(value), recip()</br>

cmp(value), eq(value), neq(value), lt(value), lte(value), gt(value), gte(value)</br>
cmp_tolerance(value, tolerance), eq_tolerance(value, tolerance), neq_tolerance(value, tolerance), lt_tolerance(value, tolerance), lte_tolerance(value, tolerance), gt_tolerance(value, tolerance), gte_tolerance(value, tolerance)

log(base), log10(), log2(), ln()</br>
pow(value, other), pow(value), pow_base(value), exp(), sqr(), sqrt(), cube(), cbrt()

affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned), sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned), affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned), sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned)

---

So how much faster than decimal.js is break_infinity.js? Operations per second comparison using the same computer:</br>
new Decimal("1.23456789e987654321") : 1.5e6 to to 3e6 (2x speedup)</br>
Decimal.add("1e999", "9e998") : 1e6 to 1.5e7 (15x speedup)</br>
Decimal.mul("1e999", "9e998") : 1.5e6 to 1e8 (66x speedup)</br>
Decimal.pow(987.789, 123.321) : 8e3 to 2e6 (250x speedup)</br>
Decimal.exp(1e10) : 5e3 to 3.8e7 (7600x speedup)</br>
Decimal.ln("987.654e789") : 4e4 to 4.5e8 (11250x speedup)</br>
Decimal.log10("987.654e789") : 3e4 to 5e8 (16666x speedup)</br>

Antimatter Dimensions script time improved by 4.5x after swapping from decimal.js to break_infinity.js. This could be your incremental game:

![image](https://user-images.githubusercontent.com/666597/33364256-b0dfb7da-d537-11e7-9469-b2857568a468.png)

---

Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.

Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal

Thanks to https://github.com/MikeMcl/decimal.js/ , https://github.com/Yaffle/BigInteger and SpeedCrunch from which I have sourced code or ideas from.

# Load

The library is the single JavaScript file *break_infinity.js* (or minified, *break_infinity.min.js*). If you are already using decimal.js, just swap out for break_infinity.js and everything will work the same (if there's a missing function or behavioural difference, open an issue and I'll take a look).

It can be loaded using a script tag in an HTML document for the browser

```html
    <script src='path/to/break_infinity.js'></script>
```

or as a Node.js module using require.

```javascript
    var Decimal = require('break_infinity.js');
```

For Node, the library is available from the npm registry

```bash
    $ npm install --save break_infinity.js
```

# Use

The library exports a single function object, Decimal, the constructor of Decimal instances.

It accepts a value of type number, string or Decimal.

```javascript
    x = new Decimal(123.4567)
    y = new Decimal('123456.7e-3')
    z = new Decimal(x)
    x.equals(y) && y.equals(z) && x.equals(z)        // true
```
    
The methods that return a Decimal can be chained.

```javascript
    x.dividedBy(y).plus(z).times(9).floor()
    x.times('1.23456780123456789e+9').plus(9876.5432321).dividedBy('4444562598.111772').ceil()
````
    
A list of functions is provided earlier in this readme, or you can use autocomplete or read through the js file to see for yourself.

---

# Build

First, clone the repo
```
git clone git://github.com/Patashu/break_infinity.js.git
cd break_infinity.js
```

Then install npm dependencies
```
npm install
```

And then run build command which will build all targets to the dist directory.
```
npm run build
```

---

Need something even bigger? Take a look at SpectralFlame's WIP HugeNumber.java. It can reach up to 10 ↑↑ 100000000 and may give you some ideas.

https://github.com/cyip92/HugeNumber/blob/master/HugeNumber.java
