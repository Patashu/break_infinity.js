(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Decimal = factory());
}(this, (function () { 'use strict';

  var padEnd = function (string, maxLength, fillString) {

    if (string == null || maxLength == null) {
      return string;
    }

    var result    = String(string);
    var targetLen = typeof maxLength === 'number'
      ? maxLength
      : parseInt(maxLength, 10);

    if (isNaN(targetLen) || !isFinite(targetLen)) {
      return result;
    }


    var length = result.length;
    if (length >= targetLen) {
      return result;
    }


    var filled = fillString == null ? '' : String(fillString);
    if (filled === '') {
      filled = ' ';
    }


    var fillLen = targetLen - length;

    while (filled.length < fillLen) {
      filled += filled;
    }

    var truncated = filled.length > fillLen ? filled.substr(0, fillLen) : filled;

    return result + truncated;
  };

  // consider adding them together pointless, just return the larger one

  var MAX_SIGNIFICANT_DIGITS = 17; // Highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS

  var EXP_LIMIT = 9e15; // The largest exponent that can appear in a Number, though not all mantissas are valid here.

  var NUMBER_EXP_MAX = 308; // The smallest exponent that can appear in a Number, though not all mantissas are valid here.

  var NUMBER_EXP_MIN = -324; // Tolerance which is used for Number conversion to compensate floating-point error.

  var ROUND_TOLERANCE = 1e-10;

  var powerOf10 = function () {
    // We need this lookup table because Math.pow(10, exponent)
    // when exponent's absolute value is large is slightly inaccurate.
    // You can fix it with the power of math... or just make a lookup table.
    // Faster AND simpler
    var powersOf10 = [];

    for (var i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
      powersOf10.push(Number("1e" + i));
    }

    var indexOf0InPowersOf10 = 323;
    return function (power) {
      return powersOf10[power + indexOf0InPowersOf10];
    };
  }();

  var D = function D(value) {
    return value instanceof Decimal ? value : new Decimal(value);
  };

  var ME = function ME(mantissa, exponent) {
    return new Decimal().fromMantissaExponent(mantissa, exponent);
  };

  var ME_NN = function ME_NN(mantissa, exponent) {
    return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
  };

  function affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned) {
    var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
    return Decimal.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10() / priceRatio.log10());
  }

  function sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned) {
    return priceStart.mul(priceRatio.pow(currentOwned)).mul(Decimal.sub(1, priceRatio.pow(numItems))).div(Decimal.sub(1, priceRatio));
  }

  function affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned) {
    // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
    // where a is actualStart, d is priceAdd and S is resourcesAvailable
    // then floor it and you're done!
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));
    var b = actualStart.sub(priceAdd.div(2));
    var b2 = b.pow(2);
    return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
  }

  function sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned) {
    var actualStart = priceStart.add(currentOwned.mul(priceAdd)); // (n/2)*(2*a+(n-1)*d)

    return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(1).mul(priceAdd)));
  }

  function efficiencyOfPurchase(cost, currentRpS, deltaRpS) {
    return cost.div(currentRpS).add(cost.div(deltaRpS));
  }
  /**
   * The Decimal's value is simply mantissa * 10^exponent.
   */


  var Decimal =
  /** @class */
  function () {
    function Decimal(value) {
      /**
       * A number (double) with absolute value between [1, 10) OR exactly 0.
       * If mantissa is ever 10 or greater, it should be normalized
       * (divide by 10 and add 1 to exponent until it is less than 10,
       * or multiply by 10 and subtract 1 from exponent until it is 1 or greater).
       * Infinity/-Infinity/NaN will cause bad things to happen.
       */
      this.mantissa = NaN;
      /**
       * A number (integer) between -EXP_LIMIT and EXP_LIMIT.
       * Non-integral/out of bounds will cause bad things to happen.
       */

      this.exponent = NaN;

      if (value === undefined) {
        this.m = 0;
        this.e = 0;
      } else if (value instanceof Decimal) {
        this.fromDecimal(value);
      } else if (typeof value === "number") {
        this.fromNumber(value);
      } else {
        this.fromString(value);
      }
    }

    Object.defineProperty(Decimal.prototype, "m", {
      get: function get() {
        return this.mantissa;
      },
      set: function set(value) {
        this.mantissa = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal.prototype, "e", {
      get: function get() {
        return this.exponent;
      },
      set: function set(value) {
        this.exponent = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal.prototype, "s", {
      get: function get() {
        return this.sign();
      },
      set: function set(value) {
        if (value === 0) {
          this.e = 0;
          this.m = 0;
          return;
        }

        if (this.sgn() !== value) {
          this.m = -this.m;
        }
      },
      enumerable: false,
      configurable: true
    });

    Decimal.fromMantissaExponent = function (mantissa, exponent) {
      return new Decimal().fromMantissaExponent(mantissa, exponent);
    };

    Decimal.fromMantissaExponent_noNormalize = function (mantissa, exponent) {
      return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
    };

    Decimal.fromDecimal = function (value) {
      return new Decimal().fromDecimal(value);
    };

    Decimal.fromNumber = function (value) {
      return new Decimal().fromNumber(value);
    };

    Decimal.fromString = function (value) {
      return new Decimal().fromString(value);
    };

    Decimal.fromValue = function (value) {
      return new Decimal().fromValue(value);
    };

    Decimal.fromValue_noAlloc = function (value) {
      return value instanceof Decimal ? value : new Decimal(value);
    };

    Decimal.abs = function (value) {
      return D(value).abs();
    };

    Decimal.neg = function (value) {
      return D(value).neg();
    };

    Decimal.negate = function (value) {
      return D(value).neg();
    };

    Decimal.negated = function (value) {
      return D(value).neg();
    };

    Decimal.sign = function (value) {
      return D(value).sign();
    };

    Decimal.sgn = function (value) {
      return D(value).sign();
    };

    Decimal.round = function (value) {
      return D(value).round();
    };

    Decimal.floor = function (value) {
      return D(value).floor();
    };

    Decimal.ceil = function (value) {
      return D(value).ceil();
    };

    Decimal.trunc = function (value) {
      return D(value).trunc();
    };

    Decimal.add = function (value, other) {
      return D(value).add(other);
    };

    Decimal.plus = function (value, other) {
      return D(value).add(other);
    };

    Decimal.sub = function (value, other) {
      return D(value).sub(other);
    };

    Decimal.subtract = function (value, other) {
      return D(value).sub(other);
    };

    Decimal.minus = function (value, other) {
      return D(value).sub(other);
    };

    Decimal.mul = function (value, other) {
      return D(value).mul(other);
    };

    Decimal.multiply = function (value, other) {
      return D(value).mul(other);
    };

    Decimal.times = function (value, other) {
      return D(value).mul(other);
    };

    Decimal.div = function (value, other) {
      return D(value).div(other);
    };

    Decimal.divide = function (value, other) {
      return D(value).div(other);
    };

    Decimal.recip = function (value) {
      return D(value).recip();
    };

    Decimal.reciprocal = function (value) {
      return D(value).recip();
    };

    Decimal.reciprocate = function (value) {
      return D(value).reciprocate();
    };

    Decimal.cmp = function (value, other) {
      return D(value).cmp(other);
    };

    Decimal.compare = function (value, other) {
      return D(value).cmp(other);
    };

    Decimal.eq = function (value, other) {
      return D(value).eq(other);
    };

    Decimal.equals = function (value, other) {
      return D(value).eq(other);
    };

    Decimal.neq = function (value, other) {
      return D(value).neq(other);
    };

    Decimal.notEquals = function (value, other) {
      return D(value).notEquals(other);
    };

    Decimal.lt = function (value, other) {
      return D(value).lt(other);
    };

    Decimal.lte = function (value, other) {
      return D(value).lte(other);
    };

    Decimal.gt = function (value, other) {
      return D(value).gt(other);
    };

    Decimal.gte = function (value, other) {
      return D(value).gte(other);
    };

    Decimal.max = function (value, other) {
      return D(value).max(other);
    };

    Decimal.min = function (value, other) {
      return D(value).min(other);
    };

    Decimal.clamp = function (value, min, max) {
      return D(value).clamp(min, max);
    };

    Decimal.clampMin = function (value, min) {
      return D(value).clampMin(min);
    };

    Decimal.clampMax = function (value, max) {
      return D(value).clampMax(max);
    };

    Decimal.cmp_tolerance = function (value, other, tolerance) {
      return D(value).cmp_tolerance(other, tolerance);
    };

    Decimal.compare_tolerance = function (value, other, tolerance) {
      return D(value).cmp_tolerance(other, tolerance);
    };

    Decimal.eq_tolerance = function (value, other, tolerance) {
      return D(value).eq_tolerance(other, tolerance);
    };

    Decimal.equals_tolerance = function (value, other, tolerance) {
      return D(value).eq_tolerance(other, tolerance);
    };

    Decimal.neq_tolerance = function (value, other, tolerance) {
      return D(value).neq_tolerance(other, tolerance);
    };

    Decimal.notEquals_tolerance = function (value, other, tolerance) {
      return D(value).notEquals_tolerance(other, tolerance);
    };

    Decimal.lt_tolerance = function (value, other, tolerance) {
      return D(value).lt_tolerance(other, tolerance);
    };

    Decimal.lte_tolerance = function (value, other, tolerance) {
      return D(value).lte_tolerance(other, tolerance);
    };

    Decimal.gt_tolerance = function (value, other, tolerance) {
      return D(value).gt_tolerance(other, tolerance);
    };

    Decimal.gte_tolerance = function (value, other, tolerance) {
      return D(value).gte_tolerance(other, tolerance);
    };

    Decimal.log10 = function (value) {
      return D(value).log10();
    };

    Decimal.absLog10 = function (value) {
      return D(value).absLog10();
    };

    Decimal.pLog10 = function (value) {
      return D(value).pLog10();
    };

    Decimal.log = function (value, base) {
      return D(value).log(base);
    };

    Decimal.log2 = function (value) {
      return D(value).log2();
    };

    Decimal.ln = function (value) {
      return D(value).ln();
    };

    Decimal.logarithm = function (value, base) {
      return D(value).logarithm(base);
    };

    Decimal.pow10 = function (value) {
      if (Number.isInteger(value)) {
        return ME_NN(1, value);
      }

      return ME(Math.pow(10, value % 1), Math.trunc(value));
    };

    Decimal.pow = function (value, other) {
      // Fast track: 10^integer
      if (typeof value === "number" && value === 10 && typeof other === "number" && Number.isInteger(other)) {
        return ME_NN(1, other);
      }

      return D(value).pow(other);
    };

    Decimal.exp = function (value) {
      return D(value).exp();
    };

    Decimal.sqr = function (value) {
      return D(value).sqr();
    };

    Decimal.sqrt = function (value) {
      return D(value).sqrt();
    };

    Decimal.cube = function (value) {
      return D(value).cube();
    };

    Decimal.cbrt = function (value) {
      return D(value).cbrt();
    };

    Decimal.dp = function (value) {
      return D(value).dp();
    };

    Decimal.decimalPlaces = function (value) {
      return D(value).dp();
    };
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something
     * with exponentially increasing cost each purchase (start at priceStart,
     * multiply by priceRatio, already own currentOwned), how much of it can you buy?
     * Adapted from Trimps source code.
     */


    Decimal.affordGeometricSeries = function (resourcesAvailable, priceStart, priceRatio, currentOwned) {
      return affordGeometricSeries(D(resourcesAvailable), D(priceStart), D(priceRatio), currentOwned);
    };
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it multiplies by priceRatio each purchase?
     */


    Decimal.sumGeometricSeries = function (numItems, priceStart, priceRatio, currentOwned) {
      return sumGeometricSeries(numItems, D(priceStart), D(priceRatio), currentOwned);
    };
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
     * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
     * how much of it can you buy?
     */


    Decimal.affordArithmeticSeries = function (resourcesAvailable, priceStart, priceAdd, currentOwned) {
      return affordArithmeticSeries(D(resourcesAvailable), D(priceStart), D(priceAdd), D(currentOwned));
    };
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it adds priceAdd each purchase?
     * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
     */


    Decimal.sumArithmeticSeries = function (numItems, priceStart, priceAdd, currentOwned) {
      return sumArithmeticSeries(D(numItems), D(priceStart), D(priceAdd), D(currentOwned));
    };
    /**
     * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
     * the lowest efficiency score is the better one to purchase.
     * From Frozen Cookies:
     * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
     */


    Decimal.efficiencyOfPurchase = function (cost, currentRpS, deltaRpS) {
      return efficiencyOfPurchase(D(cost), D(currentRpS), D(deltaRpS));
    };

    Decimal.randomDecimalForTesting = function (absMaxExponent) {
      // NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
      // 5% of the time, have a mantissa of 0
      if (Math.random() * 20 < 1) {
        return ME_NN(0, 0);
      }

      var mantissa = Math.random() * 10; // 10% of the time, have a simple mantissa

      if (Math.random() * 10 < 1) {
        mantissa = Math.round(mantissa);
      }

      mantissa *= Math.sign(Math.random() * 2 - 1);
      var exponent = Math.floor(Math.random() * absMaxExponent * 2) - absMaxExponent;
      return ME(mantissa, exponent);
      /*
        Examples:
              randomly test pow:
              var a = Decimal.randomDecimalForTesting(1000);
        var pow = Math.random()*20-10;
        if (Math.random()*2 < 1) { pow = Math.round(pow); }
        var result = Decimal.pow(a, pow);
        ["(" + a.toString() + ")^" + pow.toString(), result.toString()]
              randomly test add:
              var a = Decimal.randomDecimalForTesting(1000);
        var b = Decimal.randomDecimalForTesting(17);
        var c = a.mul(b);
        var result = a.add(c);
        [a.toString() + "+" + c.toString(), result.toString()]
      */
    };
    /**
     * When mantissa is very denormalized, use this to normalize much faster.
     */


    Decimal.prototype.normalize = function () {
      if (this.m >= 1 && this.m < 10) {
        return this;
      } // TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter


      if (this.m === 0) {
        this.m = 0;
        this.e = 0;
        return this;
      }

      var tempExponent = Math.floor(Math.log10(Math.abs(this.m)));
      this.m = tempExponent === NUMBER_EXP_MIN ? this.m * 10 / 1e-323 : this.m / powerOf10(tempExponent);
      this.e += tempExponent;
      return this;
    };

    Decimal.prototype.fromMantissaExponent = function (mantissa, exponent) {
      // SAFETY: don't let in non-numbers
      if (!isFinite(mantissa) || !isFinite(exponent)) {
        mantissa = Number.NaN;
        exponent = Number.NaN;
        return this;
      }

      this.m = mantissa;
      this.e = exponent; // Non-normalized mantissas can easily get here, so this is mandatory.

      this.normalize();
      return this;
    };
    /**
     * Well, you know what you're doing!
     */


    Decimal.prototype.fromMantissaExponent_noNormalize = function (mantissa, exponent) {
      this.m = mantissa;
      this.e = exponent;
      return this;
    };

    Decimal.prototype.fromDecimal = function (value) {
      this.m = value.m;
      this.e = value.e;
      return this;
    };

    Decimal.prototype.fromNumber = function (value) {
      // SAFETY: Handle Infinity and NaN in a somewhat meaningful way.
      if (isNaN(value)) {
        this.m = Number.NaN;
        this.e = Number.NaN;
      } else if (value === Number.POSITIVE_INFINITY) {
        this.m = 1;
        this.e = EXP_LIMIT;
      } else if (value === Number.NEGATIVE_INFINITY) {
        this.m = -1;
        this.e = EXP_LIMIT;
      } else if (value === 0) {
        this.m = 0;
        this.e = 0;
      } else {
        this.e = Math.floor(Math.log10(Math.abs(value))); // SAFETY: handle 5e-324, -5e-324 separately

        this.m = this.e === NUMBER_EXP_MIN ? value * 10 / 1e-323 : value / powerOf10(this.e); // SAFETY: Prevent weirdness.

        this.normalize();
      }

      return this;
    };

    Decimal.prototype.fromString = function (value) {
      if (value.indexOf("e") !== -1) {
        var parts = value.split("e");
        this.m = parseFloat(parts[0]);
        this.e = parseFloat(parts[1]); // Non-normalized mantissas can easily get here, so this is mandatory.

        this.normalize();
      } else if (value === "NaN") {
        this.m = Number.NaN;
        this.e = Number.NaN;
      } else {
        this.fromNumber(parseFloat(value));

        if (isNaN(this.m)) {
          throw Error("[DecimalError] Invalid argument: " + value);
        }
      }

      return this;
    };

    Decimal.prototype.fromValue = function (value) {
      if (value instanceof Decimal) {
        return this.fromDecimal(value);
      }

      if (typeof value === "number") {
        return this.fromNumber(value);
      }

      if (typeof value === "string") {
        return this.fromString(value);
      }

      this.m = 0;
      this.e = 0;
      return this;
    };

    Decimal.prototype.toNumber = function () {
      // Problem: new Decimal(116).toNumber() returns 115.99999999999999.
      // TODO: How to fix in general case? It's clear that if toNumber() is
      //  VERY close to an integer, we want exactly the integer.
      //  But it's not clear how to specifically write that.
      //  So I'll just settle with 'exponent >= 0 and difference between rounded
      //  and not rounded < 1e-9' as a quick fix.
      // UN-SAFETY: It still eventually fails.
      // Since there's no way to know for sure we started with an integer,
      // all we can do is decide what tradeoff we want between 'yeah I think
      // this used to be an integer' and 'pfft, who needs THAT many decimal
      // places tracked' by changing ROUND_TOLERANCE.
      // https://github.com/Patashu/break_infinity.js/issues/52
      // Currently starts failing at 800002. Workaround is to do .Round()
      // AFTER toNumber() if you are confident you started with an integer.
      // var result = this.m*Math.pow(10, this.e);
      if (!isFinite(this.e)) {
        return Number.NaN;
      }

      if (this.e > NUMBER_EXP_MAX) {
        return this.m > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      }

      if (this.e < NUMBER_EXP_MIN) {
        return 0;
      } // SAFETY: again, handle 5e-324, -5e-324 separately


      if (this.e === NUMBER_EXP_MIN) {
        return this.m > 0 ? 5e-324 : -5e-324;
      }

      var result = this.m * powerOf10(this.e);

      if (!isFinite(result) || this.e < 0) {
        return result;
      }

      var resultRounded = Math.round(result);

      if (Math.abs(resultRounded - result) < ROUND_TOLERANCE) {
        return resultRounded;
      }

      return result;
    };

    Decimal.prototype.mantissaWithDecimalPlaces = function (places) {
      // https://stackoverflow.com/a/37425022
      if (isNaN(this.m) || isNaN(this.e)) {
        return Number.NaN;
      }

      if (this.m === 0) {
        return 0;
      }

      var len = places + 1;
      var numDigits = Math.ceil(Math.log10(Math.abs(this.m)));
      var rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
      return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
    };

    Decimal.prototype.toString = function () {
      if (isNaN(this.m) || isNaN(this.e)) {
        return "NaN";
      }

      if (this.e >= EXP_LIMIT) {
        return this.m > 0 ? "Infinity" : "-Infinity";
      }

      if (this.e <= -EXP_LIMIT || this.m === 0) {
        return "0";
      }

      if (this.e < 21 && this.e > -7) {
        return this.toNumber().toString();
      }

      return this.m + "e" + (this.e >= 0 ? "+" : "") + this.e;
    };

    Decimal.prototype.toExponential = function (places) {
      // https://stackoverflow.com/a/37425022
      // TODO: Some unfixed cases:
      //  new Decimal("1.2345e-999").toExponential()
      //  "1.23450000000000015e-999"
      //  new Decimal("1e-999").toExponential()
      //  "1.000000000000000000e-999"
      // TBH I'm tempted to just say it's a feature.
      // If you're doing pretty formatting then why don't you know how many decimal places you want...?
      if (isNaN(this.m) || isNaN(this.e)) {
        return "NaN";
      }

      if (this.e >= EXP_LIMIT) {
        return this.m > 0 ? "Infinity" : "-Infinity";
      }

      if (this.e <= -EXP_LIMIT || this.m === 0) {
        return "0" + (places > 0 ? padEnd(".", places + 1, "0") : "") + "e+0";
      } // two cases:
      // 1) exponent is < 308 and > -324: use basic toFixed
      // 2) everything else: we have to do it ourselves!


      if (this.e > NUMBER_EXP_MIN && this.e < NUMBER_EXP_MAX) {
        return this.toNumber().toExponential(places);
      }

      if (!isFinite(places)) {
        places = MAX_SIGNIFICANT_DIGITS;
      }

      var len = places + 1;
      var numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.m))));
      var rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
      return rounded.toFixed(Math.max(len - numDigits, 0)) + "e" + (this.e >= 0 ? "+" : "") + this.e;
    };

    Decimal.prototype.toFixed = function (places) {
      if (isNaN(this.m) || isNaN(this.e)) {
        return "NaN";
      }

      if (this.e >= EXP_LIMIT) {
        return this.m > 0 ? "Infinity" : "-Infinity";
      }

      if (this.e <= -EXP_LIMIT || this.m === 0) {
        return "0" + (places > 0 ? padEnd(".", places + 1, "0") : "");
      } // two cases:
      // 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
      // 2) exponent is 16 or less: use basic toFixed


      if (this.e >= MAX_SIGNIFICANT_DIGITS) {
        return this.m.toString().replace(".", "").padEnd(this.e + 1, "0") + (places > 0 ? padEnd(".", places + 1, "0") : "");
      }

      return this.toNumber().toFixed(places);
    };

    Decimal.prototype.toPrecision = function (places) {
      if (this.e <= -7) {
        return this.toExponential(places - 1);
      }

      if (places > this.e) {
        return this.toFixed(places - this.e - 1);
      }

      return this.toExponential(places - 1);
    };

    Decimal.prototype.valueOf = function () {
      return this.toString();
    };

    Decimal.prototype.toJSON = function () {
      return this.toString();
    };

    Decimal.prototype.toStringWithDecimalPlaces = function (places) {
      return this.toExponential(places);
    };

    Decimal.prototype.abs = function () {
      return ME_NN(Math.abs(this.m), this.e);
    };

    Decimal.prototype.neg = function () {
      return ME_NN(-this.m, this.e);
    };

    Decimal.prototype.negate = function () {
      return this.neg();
    };

    Decimal.prototype.negated = function () {
      return this.neg();
    };

    Decimal.prototype.sign = function () {
      return Math.sign(this.m);
    };

    Decimal.prototype.sgn = function () {
      return this.sign();
    };

    Decimal.prototype.round = function () {
      if (this.e < -1) {
        return new Decimal(0);
      }

      if (this.e < MAX_SIGNIFICANT_DIGITS) {
        return new Decimal(Math.round(this.toNumber()));
      }

      return this;
    };

    Decimal.prototype.floor = function () {
      if (this.e < -1) {
        return Math.sign(this.m) >= 0 ? new Decimal(0) : new Decimal(-1);
      }

      if (this.e < MAX_SIGNIFICANT_DIGITS) {
        return new Decimal(Math.floor(this.toNumber()));
      }

      return this;
    };

    Decimal.prototype.ceil = function () {
      if (this.e < -1) {
        return Math.sign(this.m) > 0 ? new Decimal(1) : new Decimal(0);
      }

      if (this.e < MAX_SIGNIFICANT_DIGITS) {
        return new Decimal(Math.ceil(this.toNumber()));
      }

      return this;
    };

    Decimal.prototype.trunc = function () {
      if (this.e < 0) {
        return new Decimal(0);
      }

      if (this.e < MAX_SIGNIFICANT_DIGITS) {
        return new Decimal(Math.trunc(this.toNumber()));
      }

      return this;
    };

    Decimal.prototype.add = function (value) {
      // figure out which is bigger, shrink the mantissa of the smaller
      // by the difference in exponents, add mantissas, normalize and return
      // TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8
      var decimal = D(value);

      if (this.m === 0) {
        return decimal;
      }

      if (decimal.m === 0) {
        return this;
      }

      var biggerDecimal;
      var smallerDecimal;

      if (this.e >= decimal.e) {
        biggerDecimal = this;
        smallerDecimal = decimal;
      } else {
        biggerDecimal = decimal;
        smallerDecimal = this;
      }

      if (biggerDecimal.e - smallerDecimal.e > MAX_SIGNIFICANT_DIGITS) {
        return biggerDecimal;
      } // Have to do this because adding numbers that were once integers but scaled down is imprecise.
      // Example: 299 + 18


      var mantissa = Math.round(1e14 * biggerDecimal.m + 1e14 * smallerDecimal.m * powerOf10(smallerDecimal.e - biggerDecimal.e));
      return ME(mantissa, biggerDecimal.e - 14);
    };

    Decimal.prototype.plus = function (value) {
      return this.add(value);
    };

    Decimal.prototype.sub = function (value) {
      return this.add(D(value).neg());
    };

    Decimal.prototype.subtract = function (value) {
      return this.sub(value);
    };

    Decimal.prototype.minus = function (value) {
      return this.sub(value);
    };

    Decimal.prototype.mul = function (value) {
      // This version avoids an extra conversion to Decimal, if possible. Since the
      // mantissa is -10...10, any number short of MAX/10 can be safely multiplied in
      if (typeof value === "number") {
        if (value < 1e307 && value > -1e307) {
          return ME(this.m * value, this.e);
        } // If the value is larger than 1e307, we can divide that out of mantissa (since it's
        // greater than 1, it won't underflow)


        return ME(this.m * 1e-307 * value, this.e + 307);
      }

      var decimal = typeof value === "string" ? new Decimal(value) : value;
      return ME(this.m * decimal.m, this.e + decimal.e);
    };

    Decimal.prototype.multiply = function (value) {
      return this.mul(value);
    };

    Decimal.prototype.times = function (value) {
      return this.mul(value);
    };

    Decimal.prototype.div = function (value) {
      return this.mul(D(value).recip());
    };

    Decimal.prototype.divide = function (value) {
      return this.div(value);
    };

    Decimal.prototype.divideBy = function (value) {
      return this.div(value);
    };

    Decimal.prototype.dividedBy = function (value) {
      return this.div(value);
    };

    Decimal.prototype.recip = function () {
      return ME(1 / this.m, -this.e);
    };

    Decimal.prototype.reciprocal = function () {
      return this.recip();
    };

    Decimal.prototype.reciprocate = function () {
      return this.recip();
    };
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */


    Decimal.prototype.cmp = function (value) {
      var decimal = D(value); // TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12

      /*
      from smallest to largest:
            -3e100
      -1e100
      -3e99
      -1e99
      -3e0
      -1e0
      -3e-99
      -1e-99
      -3e-100
      -1e-100
      0
      1e-100
      3e-100
      1e-99
      3e-99
      1e0
      3e0
      1e99
      3e99
      1e100
      3e100
            */

      if (this.m === 0) {
        if (decimal.m === 0) {
          return 0;
        }

        if (decimal.m < 0) {
          return 1;
        }

        if (decimal.m > 0) {
          return -1;
        }
      }

      if (decimal.m === 0) {
        if (this.m < 0) {
          return -1;
        }

        if (this.m > 0) {
          return 1;
        }
      }

      if (this.m > 0) {
        if (decimal.m < 0) {
          return 1;
        }

        if (this.e > decimal.e) {
          return 1;
        }

        if (this.e < decimal.e) {
          return -1;
        }

        if (this.m > decimal.m) {
          return 1;
        }

        if (this.m < decimal.m) {
          return -1;
        }

        return 0;
      }

      if (this.m < 0) {
        if (decimal.m > 0) {
          return -1;
        }

        if (this.e > decimal.e) {
          return -1;
        }

        if (this.e < decimal.e) {
          return 1;
        }

        if (this.m > decimal.m) {
          return 1;
        }

        if (this.m < decimal.m) {
          return -1;
        }

        return 0;
      }

      throw Error("Unreachable code");
    };

    Decimal.prototype.compare = function (value) {
      return this.cmp(value);
    };

    Decimal.prototype.eq = function (value) {
      var decimal = D(value);
      return this.e === decimal.e && this.m === decimal.m;
    };

    Decimal.prototype.equals = function (value) {
      return this.eq(value);
    };

    Decimal.prototype.neq = function (value) {
      return !this.eq(value);
    };

    Decimal.prototype.notEquals = function (value) {
      return this.neq(value);
    };

    Decimal.prototype.lt = function (value) {
      var decimal = D(value);

      if (this.m === 0) {
        return decimal.m > 0;
      }

      if (decimal.m === 0) {
        return this.m <= 0;
      }

      if (this.e === decimal.e) {
        return this.m < decimal.m;
      }

      if (this.m > 0) {
        return decimal.m > 0 && this.e < decimal.e;
      }

      return decimal.m > 0 || this.e > decimal.e;
    };

    Decimal.prototype.lte = function (value) {
      return !this.gt(value);
    };

    Decimal.prototype.gt = function (value) {
      var decimal = D(value);

      if (this.m === 0) {
        return decimal.m < 0;
      }

      if (decimal.m === 0) {
        return this.m > 0;
      }

      if (this.e === decimal.e) {
        return this.m > decimal.m;
      }

      if (this.m > 0) {
        return decimal.m < 0 || this.e > decimal.e;
      }

      return decimal.m < 0 && this.e < decimal.e;
    };

    Decimal.prototype.gte = function (value) {
      return !this.lt(value);
    };

    Decimal.prototype.max = function (value) {
      var decimal = D(value);
      return this.lt(decimal) ? decimal : this;
    };

    Decimal.prototype.min = function (value) {
      var decimal = D(value);
      return this.gt(decimal) ? decimal : this;
    };

    Decimal.prototype.clamp = function (min, max) {
      return this.max(min).min(max);
    };

    Decimal.prototype.clampMin = function (min) {
      return this.max(min);
    };

    Decimal.prototype.clampMax = function (max) {
      return this.min(max);
    };

    Decimal.prototype.cmp_tolerance = function (value, tolerance) {
      var decimal = D(value);
      return this.eq_tolerance(decimal, tolerance) ? 0 : this.cmp(decimal);
    };

    Decimal.prototype.compare_tolerance = function (value, tolerance) {
      return this.cmp_tolerance(value, tolerance);
    };
    /**
     * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
     * For example, if you put in 1e-9, then any number closer to the
     * larger number than (larger number)*1e-9 will be considered equal.
     */


    Decimal.prototype.eq_tolerance = function (value, tolerance) {
      var decimal = D(value); // https://stackoverflow.com/a/33024979
      // return abs(a-b) <= tolerance * max(abs(a), abs(b))

      return Decimal.lte(this.sub(decimal).abs(), Decimal.max(this.abs(), decimal.abs()).mul(tolerance));
    };

    Decimal.prototype.equals_tolerance = function (value, tolerance) {
      return this.eq_tolerance(value, tolerance);
    };

    Decimal.prototype.neq_tolerance = function (value, tolerance) {
      return !this.eq_tolerance(value, tolerance);
    };

    Decimal.prototype.notEquals_tolerance = function (value, tolerance) {
      return this.neq_tolerance(value, tolerance);
    };

    Decimal.prototype.lt_tolerance = function (value, tolerance) {
      var decimal = D(value);
      return !this.eq_tolerance(decimal, tolerance) && this.lt(decimal);
    };

    Decimal.prototype.lte_tolerance = function (value, tolerance) {
      var decimal = D(value);
      return this.eq_tolerance(decimal, tolerance) || this.lt(decimal);
    };

    Decimal.prototype.gt_tolerance = function (value, tolerance) {
      var decimal = D(value);
      return !this.eq_tolerance(decimal, tolerance) && this.gt(decimal);
    };

    Decimal.prototype.gte_tolerance = function (value, tolerance) {
      var decimal = D(value);
      return this.eq_tolerance(decimal, tolerance) || this.gt(decimal);
    };

    Decimal.prototype.log10 = function () {
      return this.e + Math.log10(this.m);
    };

    Decimal.prototype.absLog10 = function () {
      return this.e + Math.log10(Math.abs(this.m));
    };

    Decimal.prototype.pLog10 = function () {
      return this.m <= 0 || this.e < 0 ? 0 : this.log10();
    };

    Decimal.prototype.log = function (base) {
      // UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater).
      // We assume this to be true and thus only need to return a number, not a Decimal,
      // and don't do any other kind of error checking.
      return Math.LN10 / Math.log(base) * this.log10();
    };

    Decimal.prototype.log2 = function () {
      return 3.321928094887362 * this.log10();
    };

    Decimal.prototype.ln = function () {
      return 2.302585092994045 * this.log10();
    };

    Decimal.prototype.logarithm = function (base) {
      return this.log(base);
    };

    Decimal.prototype.pow = function (value) {
      // UN-SAFETY: Accuracy not guaranteed beyond ~9~11 decimal places.
      // TODO: Decimal.pow(new Decimal(0.5), 0); or Decimal.pow(new Decimal(1), -1);
      //  makes an exponent of -0! Is a negative zero ever a problem?
      var numberValue = value instanceof Decimal ? value.toNumber() : value; // TODO: Fast track seems about neutral for performance.
      //  It might become faster if an integer pow is implemented,
      //  or it might not be worth doing (see https://github.com/Patashu/break_infinity.js/issues/4 )
      // Fast track: If (this.e*value) is an integer and mantissa^value
      // fits in a Number, we can do a very fast method.

      var temp = this.e * numberValue;
      var newMantissa;

      if (Number.isSafeInteger(temp)) {
        newMantissa = Math.pow(this.m, numberValue);

        if (isFinite(newMantissa) && newMantissa !== 0) {
          return ME(newMantissa, temp);
        }
      } // Same speed and usually more accurate.


      var newExponent = Math.trunc(temp);
      var residue = temp - newExponent;
      newMantissa = Math.pow(10, numberValue * Math.log10(this.m) + residue);

      if (isFinite(newMantissa) && newMantissa !== 0) {
        return ME(newMantissa, newExponent);
      } // return Decimal.exp(value*this.ln());


      var result = Decimal.pow10(numberValue * this.absLog10()); // this is 2x faster and gives same values AFAIK

      if (this.sign() === -1) {
        if (Math.abs(numberValue % 2) === 1) {
          return result.neg();
        } else if (Math.abs(numberValue % 2) === 0) {
          return result;
        }

        return new Decimal(Number.NaN);
      }

      return result;
    };

    Decimal.prototype.pow_base = function (value) {
      return D(value).pow(this);
    };

    Decimal.prototype.factorial = function () {
      // Using Stirling's Approximation.
      // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
      var n = this.toNumber() + 1;
      return Decimal.pow(n / Math.E * Math.sqrt(n * Math.sinh(1 / n) + 1 / (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
    };

    Decimal.prototype.exp = function () {
      var x = this.toNumber(); // Fast track: if -706 < this < 709, we can use regular exp.

      if (-706 < x && x < 709) {
        return Decimal.fromNumber(Math.exp(x));
      }

      return Decimal.pow(Math.E, x);
    };

    Decimal.prototype.sqr = function () {
      return ME(Math.pow(this.m, 2), this.e * 2);
    };

    Decimal.prototype.sqrt = function () {
      if (this.m < 0) {
        return new Decimal(Number.NaN);
      }

      if (this.e % 2 !== 0) {
        return ME(Math.sqrt(this.m) * 3.16227766016838, Math.floor(this.e / 2));
      } // Mod of a negative number is negative, so != means '1 or -1'


      return ME(Math.sqrt(this.m), Math.floor(this.e / 2));
    };

    Decimal.prototype.cube = function () {
      return ME(Math.pow(this.m, 3), this.e * 3);
    };

    Decimal.prototype.cbrt = function () {
      var sign = 1;
      var mantissa = this.m;

      if (mantissa < 0) {
        sign = -1;
        mantissa = -mantissa;
      }

      var newMantissa = sign * Math.pow(mantissa, 1 / 3);
      var mod = this.e % 3;

      if (mod === 1 || mod === -1) {
        return ME(newMantissa * 2.154434690031883, Math.floor(this.e / 3));
      }

      if (mod !== 0) {
        return ME(newMantissa * 4.641588833612778, Math.floor(this.e / 3));
      } // mod != 0 at this point means 'mod == 2 || mod == -2'


      return ME(newMantissa, Math.floor(this.e / 3));
    }; // Some hyperbolic trig functions that happen to be easy


    Decimal.prototype.sinh = function () {
      return this.exp().sub(this.negate().exp()).div(2);
    };

    Decimal.prototype.cosh = function () {
      return this.exp().add(this.negate().exp()).div(2);
    };

    Decimal.prototype.tanh = function () {
      return this.sinh().div(this.cosh());
    };

    Decimal.prototype.asinh = function () {
      return Decimal.ln(this.add(this.sqr().add(1).sqrt()));
    };

    Decimal.prototype.acosh = function () {
      return Decimal.ln(this.add(this.sqr().sub(1).sqrt()));
    };

    Decimal.prototype.atanh = function () {
      if (this.abs().gte(1)) {
        return Number.NaN;
      }

      return Decimal.ln(this.add(1).div(new Decimal(1).sub(this))) / 2;
    };
    /**
     * Joke function from Realm Grinder
     */


    Decimal.prototype.ascensionPenalty = function (ascensions) {
      if (ascensions === 0) {
        return this;
      }

      return this.pow(Math.pow(10, -ascensions));
    };
    /**
     * Joke function from Cookie Clicker. It's 'egg'
     */


    Decimal.prototype.egg = function () {
      return this.add(9);
    };

    Decimal.prototype.lessThanOrEqualTo = function (other) {
      return this.cmp(other) < 1;
    };

    Decimal.prototype.lessThan = function (other) {
      return this.cmp(other) < 0;
    };

    Decimal.prototype.greaterThanOrEqualTo = function (other) {
      return this.cmp(other) > -1;
    };

    Decimal.prototype.greaterThan = function (other) {
      return this.cmp(other) > 0;
    };

    Decimal.prototype.decimalPlaces = function () {
      return this.dp();
    };

    Decimal.prototype.dp = function () {
      if (!isFinite(this.mantissa)) {
        return NaN;
      }

      if (this.exponent >= MAX_SIGNIFICANT_DIGITS) {
        return 0;
      }

      var mantissa = this.mantissa;
      var places = -this.exponent;
      var e = 1;

      while (Math.abs(Math.round(mantissa * e) / e - mantissa) > ROUND_TOLERANCE) {
        e *= 10;
        places++;
      }

      return places > 0 ? places : 0;
    };

    Object.defineProperty(Decimal, "MAX_VALUE", {
      get: function get() {
        return MAX_VALUE;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "MIN_VALUE", {
      get: function get() {
        return MIN_VALUE;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "NUMBER_MAX_VALUE", {
      get: function get() {
        return NUMBER_MAX_VALUE;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "NUMBER_MIN_VALUE", {
      get: function get() {
        return NUMBER_MIN_VALUE;
      },
      enumerable: false,
      configurable: true
    });
    return Decimal;
  }();
  var MAX_VALUE = ME_NN(1, EXP_LIMIT);
  var MIN_VALUE = ME_NN(1, -EXP_LIMIT);
  var NUMBER_MAX_VALUE = D(Number.MAX_VALUE);
  var NUMBER_MIN_VALUE = D(Number.MIN_VALUE);

  return Decimal;

})));
