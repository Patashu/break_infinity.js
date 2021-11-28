(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Decimal = factory());
}(this, (function () { 'use strict';

  // For example: if two exponents are more than 17 apart,
  // consider adding them together pointless, just return the larger one
  var MAX_SIGNIFICANT_DIGITS = 17; // Highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS

  var EXP_LIMIT = 9e15; // The largest exponent that can appear in a Number, though not all mantissas are valid here.

  var NUMBER_EXP_MAX = 308; // The smallest exponent that can appear in a Number, though not all mantissas are valid here.

  var NUMBER_EXP_MIN = -324; // Tolerance which is used for Number conversion to compensate floating-point error.

  var ROUND_TOLERANCE = 1e-10;

  // when exponent's absolute value is large is slightly inaccurate.
  // You can fix it with the power of math... or just make a lookup table.
  // Faster AND simpler

  var powersOf10 = [];

  for (var i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
    powersOf10.push(Number("1e" + i));
  }

  var indexOf0InPowersOf10 = 323;
  function powerOf10(power) {
    return powersOf10[power + indexOf0InPowersOf10];
  }

  function assignFromMantissaExponent(target, mantissa, exponent) {
    // SAFETY: don't let in non-numbers
    if (!isFinite(mantissa) || !isFinite(exponent)) {
      assignFromDecimal(target, Decimal.NaN);
      return;
    }

    target.__set__(mantissa, exponent);

    target.normalize();
  }
  function assignFromDecimal(target, source) {
    target.__set__(source.m, source.e);
  }
  function assignFromNumber(target, source) {
    if (!isFinite(source)) {
      target.__set__(source, 0);

      return;
    }

    if (source === 0) {
      target.__set__(0, 0);

      return;
    }

    var e = Math.floor(Math.log10(Math.abs(source))); // SAFETY: handle 5e-324, -5e-324 separately

    var m = e === NUMBER_EXP_MIN ? source * 10 / 1e-323 : source / powerOf10(e);
    assignFromMantissaExponent(target, m, e);
  }
  function assignFromString(target, source) {
    if (source.indexOf("e") !== -1) {
      var parts = source.split("e");
      var m = parseFloat(parts[0]);
      var e = parseFloat(parts[1]);
      assignFromMantissaExponent(target, m, e);
      return;
    }

    if (source === "NaN") {
      assignFromDecimal(target, Decimal.NaN);
      return;
    }

    var number = parseFloat(source);

    if (isNaN(number)) {
      throw Error("[DecimalError] Invalid argument: " + source);
    }

    assignFromNumber(target, number);
  }
  function assignFromValue(target, value) {
    if (value === undefined) {
      target.__set__(0, 0);
    } else if (value instanceof Decimal) {
      assignFromDecimal(target, value);
    } else if (typeof value === "number") {
      assignFromNumber(target, value);
    } else if (typeof value === "string") {
      assignFromString(target, value);
    }
  }

  function fromRawMantissaExponent(mantissa, exponent) {
    var decimal = new Decimal();

    decimal.__set__(mantissa, exponent);

    return decimal;
  }
  function fromMantissaExponent(mantissa, exponent) {
    var decimal = new Decimal();
    assignFromMantissaExponent(decimal, mantissa, exponent);
    return decimal;
  }
  function fromDecimal(value) {
    var decimal = new Decimal();
    assignFromDecimal(decimal, value);
    return decimal;
  }
  function fromNumber(value) {
    var decimal = new Decimal();
    assignFromNumber(decimal, value);
    return decimal;
  }
  function fromString(value) {
    var decimal = new Decimal();
    assignFromString(decimal, value);
    return decimal;
  }
  function fromValue(value) {
    var decimal = new Decimal();
    assignFromValue(decimal, value);
    return decimal;
  }
  function fromValueNoAlloc(value) {
    return value instanceof Decimal ? value : new Decimal(value);
  }

  function isZero(decimal) {
    return decimal.m === 0;
  }
  function isFinite$1(decimal) {
    return Number.isFinite(decimal.m);
  }
  function isNaN$1(decimal) {
    return Number.isNaN(decimal.m);
  }

  function negate_S(value) {
    var decimal = new Decimal(value);
    decimal.m = -decimal.m;
    return decimal;
  }
  function negate_D(value) {
    return fromRawMantissaExponent(-value.m, value.e);
  }

  function reciprocate_S(value) {
    var decimal = new Decimal(value);

    decimal.__set__(1 / decimal.m, -decimal.e);

    return decimal;
  }
  function reciprocate_D(value) {
    return fromMantissaExponent(1 / value.m, -value.e);
  }

  function abs_S(value) {
    var decimal = new Decimal(value);
    decimal.m = Math.abs(decimal.m);
    return decimal;
  }
  function abs_D(value) {
    return fromRawMantissaExponent(Math.abs(value.m), value.e);
  }

  function sign_S(value) {
    if (typeof value === "number") {
      return Math.sign(value);
    }

    var decimal = fromValueNoAlloc(value);
    return sign_D(decimal);
  }
  function sign_D(value) {
    return Math.sign(value.m);
  }

  function round_S(value) {
    if (typeof value === "number") {
      return fromNumber(Math.round(value));
    }

    var decimal = fromValueNoAlloc(value);
    return round_D(decimal);
  }
  function round_D(value) {
    if (!isFinite$1(value)) {
      return value;
    }

    if (value.e < -1) {
      return Decimal.ZERO;
    }

    if (value.e < MAX_SIGNIFICANT_DIGITS) {
      return fromNumber(Math.round(value.toNumber()));
    }

    return value;
  }

  function floor_S(value) {
    if (typeof value === "number") {
      return fromNumber(Math.floor(value));
    }

    var decimal = fromValueNoAlloc(value);
    return floor_D(decimal);
  }
  function floor_D(value) {
    if (!isFinite$1(value)) {
      return value;
    }

    if (value.e < -1) {
      return Math.sign(value.m) >= 0 ? Decimal.ZERO : Decimal.MINUS_ONE;
    }

    if (value.e < MAX_SIGNIFICANT_DIGITS) {
      return fromNumber(Math.floor(value.toNumber()));
    }

    return value;
  }

  function ceil_S(value) {
    if (typeof value === "number") {
      return fromNumber(Math.ceil(value));
    }

    var decimal = fromValueNoAlloc(value);
    return ceil_D(decimal);
  }
  function ceil_D(value) {
    if (!isFinite$1(value)) {
      return value;
    }

    if (value.e < -1) {
      return Math.sign(value.m) > 0 ? Decimal.ONE : Decimal.ZERO;
    }

    if (value.e < MAX_SIGNIFICANT_DIGITS) {
      return fromNumber(Math.ceil(value.toNumber()));
    }

    return value;
  }

  function trunc_S(value) {
    if (typeof value === "number") {
      return fromNumber(Math.trunc(value));
    }

    var decimal = fromValueNoAlloc(value);
    return trunc_D(decimal);
  }
  function trunc_D(value) {
    if (!isFinite$1(value)) {
      return value;
    }

    if (value.e < 0) {
      return Decimal.ZERO;
    }

    if (value.e < MAX_SIGNIFICANT_DIGITS) {
      return fromNumber(Math.trunc(value.toNumber()));
    }

    return value;
  }

  function add_SS(left, right) {
    return add_DS(fromValueNoAlloc(left), right);
  }
  function add_DS(left, right) {
    if (!isFinite$1(left)) {
      return left;
    }

    var decimal = fromValueNoAlloc(right);

    if (!isFinite$1(decimal)) {
      return decimal;
    }

    return add_DD(left, decimal);
  }
  function add_DD(left, right) {
    // figure out which is bigger, shrink the mantissa of the smaller
    // by the difference in exponents, add mantissas, normalize and return
    // TODO: Optimizations and simplification may be possible
    // see https://github.com/Patashu/break_infinity.js/issues/8
    if (isZero(left)) {
      return right;
    }

    if (isZero(right)) {
      return left;
    }

    var bigger;
    var smaller;

    if (left.e >= right.e) {
      bigger = left;
      smaller = right;
    } else {
      bigger = right;
      smaller = left;
    }

    if (bigger.e - smaller.e > MAX_SIGNIFICANT_DIGITS) {
      return bigger;
    } // Have to do this because adding numbers that were once integers but scaled down is imprecise.
    // Example: 299 + 18


    var mantissa = Math.round(1e14 * bigger.m + 1e14 * smaller.m * powerOf10(smaller.e - bigger.e));
    return fromMantissaExponent(mantissa, bigger.e - 14);
  }

  function subtract_SS(left, right) {
    return subtract_DS(fromValueNoAlloc(left), right);
  }
  function subtract_DS(left, right) {
    if (!isFinite$1(left)) {
      return left;
    }

    var decimal = fromValueNoAlloc(right);

    if (!isFinite$1(decimal)) {
      return decimal;
    }

    return subtract_DD(left, decimal);
  }

  function subtract_DD(left, right) {
    return add_DD(left, negate_D(right));
  }

  function multiply_SS(left, right) {
    return multiply_DS(fromValueNoAlloc(left), right);
  }
  function multiply_DS(left, right) {
    if (!isFinite$1(left)) {
      return left;
    } // This version avoids an extra conversion to Decimal, if possible. Since the
    // mantissa is -10...10, any number short of MAX/10 can be safely multiplied in


    if (typeof right === "number") {
      if (right < 1e307 && right > -1e307) {
        return fromMantissaExponent(left.m * right, left.e);
      } // If the value is larger than 1e307, we can divide that out of mantissa (since it's
      // greater than 1, it won't underflow)


      return fromMantissaExponent(left.m * 1e-307 * right, left.e + 307);
    }

    var decimal = typeof right === "string" ? fromString(right) : right;

    if (!isFinite$1(decimal)) {
      return decimal;
    }

    return multiply_DD(left, decimal);
  }
  function multiply_DD(left, right) {
    return fromMantissaExponent(left.m * right.m, left.e + right.e);
  }

  function divide_SS(left, right) {
    return divide_DS(fromValueNoAlloc(left), right);
  }
  function divide_DS(left, right) {
    if (!isFinite$1(left)) {
      return left;
    }

    var decimal = fromValueNoAlloc(right);

    if (!isFinite$1(decimal)) {
      return decimal;
    }

    return divide_DD(left, decimal);
  }

  function divide_DD(left, right) {
    return multiply_DD(left, reciprocate_D(right));
  }

  function compare_SS(left, right) {
    return compare_DS(fromValueNoAlloc(left), right);
  }
  function compare_DS(left, right) {
    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(left)) {
      if (isNaN$1(decimal)) {
        return 0;
      }

      return -1;
    }

    if (isNaN$1(decimal)) {
      return 1;
    }

    return compare_DD(left, decimal);
  }
  function compare_DD(left, right) {
    // TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12
    if (left.m === 0) {
      if (right.m === 0) {
        return 0;
      }

      if (right.m < 0) {
        return 1;
      }

      if (right.m > 0) {
        return -1;
      }
    }

    if (right.m === 0) {
      if (left.m < 0) {
        return -1;
      }

      if (left.m > 0) {
        return 1;
      }
    }

    if (left.m > 0) {
      if (right.m < 0) {
        return 1;
      }

      if (left.e > right.e) {
        return 1;
      }

      if (left.e < right.e) {
        return -1;
      }

      if (left.m > right.m) {
        return 1;
      }

      if (left.m < right.m) {
        return -1;
      }

      return 0;
    }

    if (left.m < 0) {
      if (right.m > 0) {
        return -1;
      }

      if (left.e > right.e) {
        return -1;
      }

      if (left.e < right.e) {
        return 1;
      }

      if (left.m > right.m) {
        return 1;
      }

      if (left.m < right.m) {
        return -1;
      }

      return 0;
    }

    throw Error("Unreachable code");
  }

  function equals_SS(left, right) {
    return equals_DS(fromValueNoAlloc(left), right);
  }
  function equals_DS(left, right) {
    if (isNaN$1(left)) {
      return false;
    }

    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(decimal)) {
      return false;
    }

    return equals_DD(left, decimal);
  }
  function equals_DD(left, right) {
    return left.e === right.e && left.m === right.m;
  }

  function notEquals_SS(left, right) {
    return notEquals_DS(fromValueNoAlloc(left), right);
  }
  function notEquals_DS(left, right) {
    if (isNaN$1(left)) {
      return true;
    }

    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(decimal)) {
      return true;
    }

    return notEquals_DD(left, decimal);
  }

  function notEquals_DD(left, right) {
    return !equals_DD(left, right);
  }

  function lessThan_SS(left, right) {
    return lessThan_DS(fromValueNoAlloc(left), right);
  }
  function lessThan_DS(left, right) {
    if (isNaN$1(left)) {
      return false;
    }

    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(decimal)) {
      return true;
    }

    return lessThan_DD(left, decimal);
  }
  function lessThan_DD(left, right) {
    if (left.m === 0) {
      return right.m > 0;
    }

    if (right.m === 0) {
      return left.m <= 0;
    }

    if (left.e === right.e) {
      return left.m < right.m;
    }

    if (left.m > 0) {
      return right.m > 0 && left.e < right.e;
    }

    return right.m > 0 || left.e > right.e;
  }

  function greaterThan_SS(left, right) {
    return greaterThan_DS(fromValueNoAlloc(left), right);
  }
  function greaterThan_DS(left, right) {
    if (isNaN$1(left)) {
      return false;
    }

    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(decimal)) {
      return true;
    }

    return greaterThan_DD(left, decimal);
  }
  function greaterThan_DD(left, right) {
    if (left.m === 0) {
      return right.m < 0;
    }

    if (right.m === 0) {
      return left.m > 0;
    }

    if (left.e === right.e) {
      return left.m > right.m;
    }

    if (left.m > 0) {
      return right.m < 0 || left.e > right.e;
    }

    return right.m < 0 && left.e < right.e;
  }

  function lessThanOrEquals_SS(left, right) {
    return lessThanOrEquals_DS(fromValueNoAlloc(left), right);
  }
  function lessThanOrEquals_DS(left, right) {
    if (isNaN$1(left)) {
      return false;
    }

    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(decimal)) {
      return true;
    }

    return lessThanOrEquals_DD(left, decimal);
  }

  function lessThanOrEquals_DD(left, right) {
    return !greaterThan_DD(left, right);
  }

  function greaterThanOrEquals_SS(left, right) {
    return greaterThanOrEquals_DS(fromValueNoAlloc(left), right);
  }
  function greaterThanOrEquals_DS(left, right) {
    if (isNaN$1(left)) {
      return false;
    }

    var decimal = fromValueNoAlloc(right);

    if (isNaN$1(decimal)) {
      return true;
    }

    return greaterThanOrEquals_DD(left, decimal);
  }

  function greaterThanOrEquals_DD(left, right) {
    return !lessThan_DD(left, right);
  }

  function createZeroes(count) {
    var result = "";

    while (result.length < count) {
      result += "0";
    }

    return result;
  }

  var cache = [];
  function repeatZeroes(count) {
    if (count <= 0) {
      return "";
    }

    var cached = cache[count];

    if (cached !== undefined) {
      return cached;
    }

    var computed = createZeroes(count);
    cache[count] = computed;
    return computed;
  }
  function trailZeroes(places) {
    return places > 0 ? "." + repeatZeroes(places) : "";
  }

  var D = fromValueNoAlloc;

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
   * @public
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
      assignFromValue(this, value);
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
      return fromMantissaExponent(mantissa, exponent);
    };
    /**
     * Well, you know what you're doing!
     */


    Decimal.fromMantissaExponent_noNormalize = function (mantissa, exponent) {
      return fromRawMantissaExponent(mantissa, exponent);
    };

    Decimal.fromDecimal = function (value) {
      return fromDecimal(value);
    };

    Decimal.fromNumber = function (value) {
      return fromNumber(value);
    };

    Decimal.fromString = function (value) {
      return fromString(value);
    };

    Decimal.fromValue = function (value) {
      return fromValue(value);
    };

    Decimal.fromValue_noAlloc = function (value) {
      return fromValueNoAlloc(value);
    };

    Decimal.abs = function (value) {
      return abs_S(value);
    };

    Decimal.neg = function (value) {
      return negate_S(value);
    };

    Decimal.negate = function (value) {
      return negate_S(value);
    };

    Decimal.negated = function (value) {
      return negate_S(value);
    };

    Decimal.sign = function (value) {
      return sign_S(value);
    };

    Decimal.sgn = function (value) {
      return sign_S(value);
    };

    Decimal.round = function (value) {
      return round_S(value);
    };

    Decimal.floor = function (value) {
      return floor_S(value);
    };

    Decimal.ceil = function (value) {
      return ceil_S(value);
    };

    Decimal.trunc = function (value) {
      return trunc_S(value);
    };

    Decimal.add = function (value, other) {
      return add_SS(value, other);
    };

    Decimal.plus = function (value, other) {
      return add_SS(value, other);
    };

    Decimal.sub = function (value, other) {
      return subtract_SS(value, other);
    };

    Decimal.subtract = function (value, other) {
      return subtract_SS(value, other);
    };

    Decimal.minus = function (value, other) {
      return subtract_SS(value, other);
    };

    Decimal.mul = function (value, other) {
      return multiply_SS(value, other);
    };

    Decimal.multiply = function (value, other) {
      return multiply_SS(value, other);
    };

    Decimal.times = function (value, other) {
      return multiply_SS(value, other);
    };

    Decimal.div = function (value, other) {
      return divide_SS(value, other);
    };

    Decimal.divide = function (value, other) {
      return divide_SS(value, other);
    };

    Decimal.recip = function (value) {
      return reciprocate_S(value);
    };

    Decimal.reciprocal = function (value) {
      return reciprocate_S(value);
    };

    Decimal.reciprocate = function (value) {
      return reciprocate_S(value);
    };

    Decimal.cmp = function (value, other) {
      return compare_SS(value, other);
    };

    Decimal.compare = function (value, other) {
      return compare_SS(value, other);
    };

    Decimal.eq = function (value, other) {
      return equals_SS(value, other);
    };

    Decimal.equals = function (value, other) {
      return equals_SS(value, other);
    };

    Decimal.neq = function (value, other) {
      return notEquals_SS(value, other);
    };

    Decimal.notEquals = function (value, other) {
      return notEquals_SS(value, other);
    };

    Decimal.lt = function (value, other) {
      return lessThan_SS(value, other);
    };

    Decimal.lte = function (value, other) {
      return lessThanOrEquals_SS(value, other);
    };

    Decimal.gt = function (value, other) {
      return greaterThan_SS(value, other);
    };

    Decimal.gte = function (value, other) {
      return greaterThanOrEquals_SS(value, other);
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
        return fromRawMantissaExponent(1, value);
      }

      return fromMantissaExponent(Math.pow(10, value % 1), Math.trunc(value));
    };

    Decimal.pow = function (value, other) {
      // Fast track: 10^integer
      if (typeof value === "number" && value === 10 && typeof other === "number" && Number.isInteger(other)) {
        return fromRawMantissaExponent(1, other);
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
        return fromRawMantissaExponent(0, 0);
      }

      var mantissa = Math.random() * 10; // 10% of the time, have a simple mantissa

      if (Math.random() * 10 < 1) {
        mantissa = Math.round(mantissa);
      }

      mantissa *= Math.sign(Math.random() * 2 - 1);
      var exponent = Math.floor(Math.random() * absMaxExponent * 2) - absMaxExponent;
      return fromMantissaExponent(mantissa, exponent);
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
     * @internal
     */


    Decimal.prototype.__set__ = function (mantissa, exponent) {
      this.m = mantissa;
      this.e = exponent;
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
      if (!this.isFinite()) {
        return this.mantissa;
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
      if (!this.isFinite()) {
        return this.mantissa;
      }

      if (this.m === 0) {
        return 0;
      } // https://stackoverflow.com/a/37425022


      var len = places + 1;
      var numDigits = Math.ceil(Math.log10(Math.abs(this.m)));
      var rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
      return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
    };

    Decimal.prototype.toString = function () {
      if (!this.isFinite()) {
        return this.mantissa.toString();
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
      if (!this.isFinite()) {
        return this.mantissa.toString();
      }

      if (this.e <= -EXP_LIMIT || this.m === 0) {
        return "0" + trailZeroes(places) + "e+0";
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
      if (!this.isFinite()) {
        return this.mantissa.toString();
      }

      if (this.e <= -EXP_LIMIT || this.m === 0) {
        return "0" + trailZeroes(places);
      } // two cases:
      // 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
      // 2) exponent is 16 or less: use basic toFixed


      if (this.e >= MAX_SIGNIFICANT_DIGITS) {
        var mantissa = this.m.toString().replace(".", ""); //, this.e + 1, "0");

        var mantissaZeroes = repeatZeroes(this.e - mantissa.length + 1);
        return mantissa + mantissaZeroes + trailZeroes(places);
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
      return abs_D(this);
    };

    Decimal.prototype.neg = function () {
      return negate_D(this);
    };

    Decimal.prototype.negate = function () {
      return negate_D(this);
    };

    Decimal.prototype.negated = function () {
      return negate_D(this);
    };

    Decimal.prototype.sign = function () {
      return sign_D(this);
    };

    Decimal.prototype.sgn = function () {
      return sign_D(this);
    };

    Decimal.prototype.round = function () {
      return round_D(this);
    };

    Decimal.prototype.floor = function () {
      return floor_D(this);
    };

    Decimal.prototype.ceil = function () {
      return ceil_D(this);
    };

    Decimal.prototype.trunc = function () {
      return trunc_D(this);
    };

    Decimal.prototype.add = function (value) {
      return add_DS(this, value);
    };

    Decimal.prototype.plus = function (value) {
      return add_DS(this, value);
    };

    Decimal.prototype.sub = function (value) {
      return subtract_DS(this, value);
    };

    Decimal.prototype.subtract = function (value) {
      return subtract_DS(this, value);
    };

    Decimal.prototype.minus = function (value) {
      return subtract_DS(this, value);
    };

    Decimal.prototype.mul = function (value) {
      return multiply_DS(this, value);
    };

    Decimal.prototype.multiply = function (value) {
      return multiply_DS(this, value);
    };

    Decimal.prototype.times = function (value) {
      return multiply_DS(this, value);
    };

    Decimal.prototype.div = function (value) {
      return divide_DS(this, value);
    };

    Decimal.prototype.divide = function (value) {
      return divide_DS(this, value);
    };

    Decimal.prototype.divideBy = function (value) {
      return divide_DS(this, value);
    };

    Decimal.prototype.dividedBy = function (value) {
      return divide_DS(this, value);
    };

    Decimal.prototype.recip = function () {
      return reciprocate_D(this);
    };

    Decimal.prototype.reciprocal = function () {
      return reciprocate_D(this);
    };

    Decimal.prototype.reciprocate = function () {
      return reciprocate_D(this);
    };
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */


    Decimal.prototype.cmp = function (value) {
      return compare_DS(this, value);
    };

    Decimal.prototype.compare = function (value) {
      return compare_DS(this, value);
    };

    Decimal.prototype.eq = function (value) {
      return equals_DS(this, value);
    };

    Decimal.prototype.equals = function (value) {
      return equals_DS(this, value);
    };

    Decimal.prototype.neq = function (value) {
      return notEquals_DS(this, value);
    };

    Decimal.prototype.notEquals = function (value) {
      return notEquals_DS(this, value);
    };

    Decimal.prototype.lt = function (value) {
      return lessThan_DS(this, value);
    };

    Decimal.prototype.lte = function (value) {
      return lessThanOrEquals_DS(this, value);
    };

    Decimal.prototype.gt = function (value) {
      return greaterThan_DS(this, value);
    };

    Decimal.prototype.gte = function (value) {
      return greaterThanOrEquals_DS(this, value);
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
          return fromMantissaExponent(newMantissa, temp);
        }
      } // Same speed and usually more accurate.


      var newExponent = Math.trunc(temp);
      var residue = temp - newExponent;
      newMantissa = Math.pow(10, numberValue * Math.log10(this.m) + residue);

      if (isFinite(newMantissa) && newMantissa !== 0) {
        return fromMantissaExponent(newMantissa, newExponent);
      } // return Decimal.exp(value*this.ln());


      var result = Decimal.pow10(numberValue * this.absLog10()); // this is 2x faster and gives same values AFAIK

      if (this.sign() === -1) {
        if (Math.abs(numberValue % 2) === 1) {
          return result.neg();
        } else if (Math.abs(numberValue % 2) === 0) {
          return result;
        }

        return DECIMAL_NaN;
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
      return fromMantissaExponent(Math.pow(this.m, 2), this.e * 2);
    };

    Decimal.prototype.sqrt = function () {
      if (this.m < 0) {
        return DECIMAL_NaN;
      }

      if (this.e % 2 !== 0) {
        return fromMantissaExponent(Math.sqrt(this.m) * 3.16227766016838, Math.floor(this.e / 2));
      } // Mod of a negative number is negative, so != means '1 or -1'


      return fromMantissaExponent(Math.sqrt(this.m), Math.floor(this.e / 2));
    };

    Decimal.prototype.cube = function () {
      return fromMantissaExponent(Math.pow(this.m, 3), this.e * 3);
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
        return fromMantissaExponent(newMantissa * 2.154434690031883, Math.floor(this.e / 3));
      }

      if (mod !== 0) {
        return fromMantissaExponent(newMantissa * 4.641588833612778, Math.floor(this.e / 3));
      } // mod != 0 at this point means 'mod == 2 || mod == -2'


      return fromMantissaExponent(newMantissa, Math.floor(this.e / 3));
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
      if (this.isNaN()) {
        return false;
      }

      var decimal = D(other);

      if (decimal.isNaN()) {
        return false;
      }

      return compare_DD(this, decimal) < 1;
    };

    Decimal.prototype.lessThan = function (other) {
      if (this.isNaN()) {
        return false;
      }

      var decimal = D(other);

      if (decimal.isNaN()) {
        return false;
      }

      return compare_DD(this, decimal) < 0;
    };

    Decimal.prototype.greaterThanOrEqualTo = function (other) {
      if (this.isNaN()) {
        return false;
      }

      var decimal = D(other);

      if (decimal.isNaN()) {
        return false;
      }

      return compare_DD(this, decimal) > -1;
    };

    Decimal.prototype.greaterThan = function (other) {
      if (this.isNaN()) {
        return false;
      }

      var decimal = D(other);

      if (decimal.isNaN()) {
        return false;
      }

      return compare_DD(this, decimal) > 0;
    };

    Decimal.prototype.decimalPlaces = function () {
      return this.dp();
    };

    Decimal.prototype.dp = function () {
      if (!this.isFinite()) {
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

    Decimal.prototype.isZero = function () {
      return isZero(this);
    };

    Decimal.prototype.isFinite = function () {
      return isFinite(this.mantissa);
    };

    Decimal.prototype.isNaN = function () {
      return isNaN(this.mantissa);
    };

    Decimal.prototype.isPositiveInfinity = function () {
      return this.mantissa === POSITIVE_INFINITY.mantissa;
    };

    Decimal.prototype.isNegativeInfinity = function () {
      return this.mantissa === NEGATIVE_INFINITY.mantissa;
    };

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
    Object.defineProperty(Decimal, "NaN", {
      get: function get() {
        return DECIMAL_NaN;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "POSITIVE_INFINITY", {
      get: function get() {
        return POSITIVE_INFINITY;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "NEGATIVE_INFINITY", {
      get: function get() {
        return NEGATIVE_INFINITY;
      },
      enumerable: false,
      configurable: true
    });
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
    Object.defineProperty(Decimal, "ZERO", {
      get: function get() {
        return ZERO;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "ONE", {
      get: function get() {
        return ONE;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Decimal, "MINUS_ONE", {
      get: function get() {
        return MINUS_ONE;
      },
      enumerable: false,
      configurable: true
    });
    return Decimal;
  }();
  // not being able to load ES modules lazily. If you try to use
  // fromRawMantissaExponent here you will get shit on with the
  // "Decimal is not a constructor" message and you just go hang yourself
  // on a ceiling fan because it is such a pain in the ass to debug
  // this kind of error.

  function ME(mantissa, exponent) {
    var decimal = new Decimal();

    decimal.__set__(mantissa, exponent);

    return decimal;
  }

  function FN(value) {
    var decimal = new Decimal();
    assignFromNumber(decimal, value);
    return decimal;
  }

  var MAX_VALUE = ME(1, EXP_LIMIT);
  var MIN_VALUE = ME(1, -EXP_LIMIT);
  var DECIMAL_NaN = ME(NaN, 0);
  var POSITIVE_INFINITY = ME(Number.POSITIVE_INFINITY, 0);
  var NEGATIVE_INFINITY = ME(Number.NEGATIVE_INFINITY, 0);
  var NUMBER_MAX_VALUE = FN(Number.MAX_VALUE);
  var NUMBER_MIN_VALUE = FN(Number.MIN_VALUE);
  var ZERO = FN(0);
  var ONE = FN(1);
  var MINUS_ONE = FN(-1);

  return Decimal;

})));
