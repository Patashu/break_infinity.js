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

The library is a single JavaScript file *break_infinity.js* (or minified, *break_infinity.min.js*)
which can be found on https://github.com/Patashu/break_infinity.js/releases page.

It can be loaded using a script tag in an HTML document for the browser

```html
    <script src="path/to/break_infinity.js"></script>
```

or as a Node.js module using require.

```javascript
    var Decimal = require("break_infinity.js");
```

For Node, the library is available from the npm registry

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
[Typescript definitions](https://github.com/Patashu/break_infinity.js/blob/master/break_infinity.d.ts),
[decimal.js docs](http://mikemcl.github.io/decimal.js/)
or check out
[generated API docs](https://patashu.github.io/break_infinity.js/classes/decimal.html) 

## Benchmarks

So how much faster than decimal.js is break_infinity.js?
Operations per second comparison using the same computer:

| Project | decimal.js | break_infinity.js | Speedup |
|---------|------------|-------------------|---------|
| `new Decimal("1.23456789e987654321")` | 1.5e6 | 3e6   | 2x     |
| `Decimal.add("1e999", "9e998")`       | 1.5e6 | 3e6   | 15x    |
| `Decimal.mul("1e999", "9e998")`       | 1.5e6 | 3e6   | 66x    |
| `Decimal.pow(987.789, 123.321)`       | 8e3   | 2e6   | 250x   |
| `Decimal.exp(1e10)`                   | 4e4   | 4.5e8 | 11250x |
| `Decimal.log10("987.654e789")`        | 3e4   | 5e8   | 16666x |

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
npm install
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
