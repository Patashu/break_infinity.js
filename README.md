[![NPM](https://img.shields.io/npm/v/break_infinity.js.svg)](https://www.npmjs.com/package/break_infinity.js)

A replacement for https://github.com/MikeMcl/decimal.js/ for incremental games which need
to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e9e15)
and want to prioritize speed over accuracy.

If you want to prioritize accuracy over speed, please use decimal.js instead.

NEW:

- https://github.com/Razenpok/BreakInfinity.cs - C# port, for your C#/Unity incremental games
- https://github.com/Patashu/break_eternity.js - the sequel to break_infinity.js that goes to
10^^3, 10^^4, 10^^5 and far beyond

## Load

You can use break_infinity.js directly from a CDN via a script tag:

```html
    <!-- You can load it as a minified file (recommended) -->
    <script src="https://cdn.jsdelivr.net/npm/break_infinity.js@2"></script>

    <!-- ...or as a non-minified file (for debugging) -->
    <script src="https://cdn.jsdelivr.net/npm/break_infinity.js@2/dist/break_infinity.js"></script>
```

or as a JS module using import

```javascript
    import Decimal from "break_infinity.js";
```

or as a Node.js module using require.

```javascript
    var Decimal = require("break_infinity.js");
```

For the module approaches, the library is available from the npm registry

```bash
    $ npm install --save break_infinity.js
```

If you are already using decimal.js, just swap out for break_infinity.js and everything will work
the same (if there's a missing function or behavioural difference, open an issue and I'll take a look).

## Use

The library exports a single class Decimal, constructor of which accepts a
`Number`, `String` or `Decimal`.

```javascript
    const x = new Decimal(123.4567);
    const y = new Decimal("123456.7e-3");
    const z = new Decimal(x);
    const equals = x.equals(y) && y.equals(z) && x.equals(z); // true
```
    
The methods that return a Decimal can be chained.

```javascript
    const short = x.dividedBy(y).plus(z).times(9).floor();
    const long = x.times("1.23456780123456789e+9")
      .plus(9876.5432321)
      .dividedBy("4444562598.111772")
      .ceil();
````

For the complete list of functions refer to
[API docs](https://patashu.github.io/break_infinity.js/classes/default.html),
[decimal.js docs](http://mikemcl.github.io/decimal.js/)
or check out
[Typescript definitions](https://cdn.jsdelivr.net/npm/break_infinity.js@2/dist/index.d.ts)

## Benchmarks

So how much faster than decimal.js is break_infinity.js?
Operations per second comparison using the same computer with these benchmarks
[link](https://jsbench.me/3ckwankwz8/1) [link](https://jsbench.me/3ckwankwz8/2):

| Project | decimal.js | break_infinity.js | Speedup |
|---------|------------|-------------------|---------|
| `new Decimal("1.23456789e987654321")` | 1.6e6 | 4.5e6 | 2.8x |
| `Decimal.add("1e999", "9e998")`       | 1.3e6 | 3.2e6 | 2.5x |
| `Decimal.mul("1e999", "9e998")`       | 1.3e6 | 3.8e6 | 2.9x |
| `Decimal.log10("987.654e789")`        | 3.9e4 | 4.7e6 | 121x |
| `Decimal.exp(1e10)`                   | 1.1e4 | 4.3e6 | 401x |
| `Decimal.pow(987.789, 123.321)`       | 1.3e4 | 5.8e6 | 442x |

[Antimatter Dimensions](https://github.com/IvarK/IvarK.github.io) script time
improved by 4.5x after swapping from decimal.js to break_infinity.js.
This could be your incremental game:

![image](https://user-images.githubusercontent.com/666597/33364256-b0dfb7da-d537-11e7-9469-b2857568a468.png)

## Build

First, clone the repo
```
git clone git://github.com/Patashu/break_infinity.js.git
cd break_infinity.js
```

Then install npm dependencies
```
npm ci
```

And then run build command which will build all targets to the dist directory.
```
npm run build
```

## Acknowledgements

Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.

Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal

Special thanks to projects from which I have sourced code or ideas from:

- https://github.com/MikeMcl/decimal.js
- https://github.com/Yaffle/BigInteger
- https://bitbucket.org/heldercorreia/speedcrunchand

Additional thanks to https://github.com/Razenpok for
porting the code to TypeScript and cleaning up this README.

## Other Number Libraries

- https://github.com/munrocket/double.js double.js, a wasm/typescript implementation of 128-bit floating point with a focus on performance and accuracy
- https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/logarithmica_numerus_lite.js logarithmica_numerus_lite.js, an alternate take on break_infinity.js where there's just one field, exponent. Roughly 2x faster but can't represent negative numbers
- https://github.com/Razenpok/BreakInfinity.cs/blob/master/BreakInfinity.Benchmarks/Quadruple/Quad.cs Quad.cs, a C# implementation of 128-bit floating point with a focus on performance and accuracy
- https://naruyoko.github.io/ExpantaNum.js/index.html https://github.com/Naruyoko/OmegaNum.js ExpantaNum.js and OmegaNum.js, numerical libraries that have low performance but can represent insanely large googological numbers like {10,9e15,1,2} and 10{1000}9e15
- break_infinity.js and break_eternity.js have been ported to other languages by various other developers: https://github.com/Noobly-Walker/expol.py Python, https://github.com/AD417/BreakInfinity.java/tree/main Java, https://github.com/Redfire75369/break-infinity.rs https://github.com/cozyGalvinism/break-eternity Rust, https://github.com/Razenpok/BreakInfinity.cs https://github.com/SWCreeperKing/break_eternity.cs C#, https://github.com/AmmoniumX/BigNumPlusPlus C++.
