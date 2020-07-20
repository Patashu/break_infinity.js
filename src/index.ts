import padEnd from "pad-end";

// For example: if two exponents are more than 17 apart,
// consider adding them together pointless, just return the larger one
const MAX_SIGNIFICANT_DIGITS = 17;

// Highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS
const EXP_LIMIT = 9e15;

// The largest exponent that can appear in a Number, though not all mantissas are valid here.
const NUMBER_EXP_MAX = 308;

// The smallest exponent that can appear in a Number, though not all mantissas are valid here.
const NUMBER_EXP_MIN = -324;

// Tolerance which is used for Number conversion to compensate floating-point error.
const ROUND_TOLERANCE = 1e-10;

const powerOf10 = (() => {
  // We need this lookup table because Math.pow(10, exponent)
  // when exponent's absolute value is large is slightly inaccurate.
  // You can fix it with the power of math... or just make a lookup table.
  // Faster AND simpler
  const powersOf10: number[] = [];
  for (let i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
    powersOf10.push(Number("1e" + i));
  }
  const indexOf0InPowersOf10 = 323;
  return (power: number) => powersOf10[power + indexOf0InPowersOf10];
})();

const D = (value: DecimalSource) =>
  value instanceof Decimal ? value : new Decimal(value);
const ME = (mantissa: number, exponent: number) =>
  new Decimal().fromMantissaExponent(mantissa, exponent);
const ME_NN = (mantissa: number, exponent: number) =>
  new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);

function affordGeometricSeries(
  resourcesAvailable: Decimal, priceStart: Decimal, priceRatio: Decimal, currentOwned: number | Decimal,
) {
  const actualStart = priceStart.mul(priceRatio.pow(currentOwned));

  return Decimal.floor(
    resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10()
    / priceRatio.log10());
}

function sumGeometricSeries(
  numItems: number | Decimal, priceStart: Decimal, priceRatio: Decimal, currentOwned: number | Decimal,
) {
  return priceStart
    .mul(priceRatio.pow(currentOwned))
    .mul(Decimal.sub(1, priceRatio.pow(numItems)))
    .div(Decimal.sub(1, priceRatio));
}

function affordArithmeticSeries(
  resourcesAvailable: Decimal, priceStart: Decimal, priceAdd: Decimal, currentOwned: Decimal,
) {
  // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
  // where a is actualStart, d is priceAdd and S is resourcesAvailable
  // then floor it and you're done!

  const actualStart = priceStart.add(currentOwned.mul(priceAdd));
  const b = actualStart.sub(priceAdd.div(2));
  const b2 = b.pow(2);

  return b.neg()
    .add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt())
    .div(priceAdd)
    .floor();
}

function sumArithmeticSeries(
  numItems: Decimal, priceStart: Decimal, priceAdd: Decimal, currentOwned: Decimal,
) {

  const actualStart = priceStart.add(currentOwned.mul(priceAdd));

  // (n/2)*(2*a+(n-1)*d)
  return numItems
    .div(2)
    .mul(actualStart.mul(2).plus(numItems.sub(1).mul(priceAdd)));
}

function efficiencyOfPurchase(cost: Decimal, currentRpS: Decimal, deltaRpS: Decimal) {
  return cost.div(currentRpS).add(cost.div(deltaRpS));
}

export type DecimalSource = Decimal | number | string;

/**
 * The Decimal's value is simply mantissa * 10^exponent.
 */
export default class Decimal {

  get m() {
    return this.mantissa;
  }

  set m(value) {
    this.mantissa = value;
  }

  get e() {
    return this.exponent;
  }

  set e(value) {
    this.exponent = value;
  }

  get s() {
    return this.sign();
  }

  set s(value) {
    if (value === 0) {
      this.e = 0;
      this.m = 0;
      return;
    }
    if (this.sgn() !== value) {
      this.m = -this.m;
    }
  }

  public static fromMantissaExponent(mantissa: number, exponent: number) {
    return new Decimal().fromMantissaExponent(mantissa, exponent);
  }

  public static fromMantissaExponent_noNormalize(mantissa: number, exponent: number) {
    return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
  }

  public static fromDecimal(value: Decimal) {
    return new Decimal().fromDecimal(value);
  }

  public static fromNumber(value: number) {
    return new Decimal().fromNumber(value);
  }

  public static fromString(value: string) {
    return new Decimal().fromString(value);
  }

  public static fromValue(value: DecimalSource) {
    return new Decimal().fromValue(value);
  }

  public static fromValue_noAlloc(value: DecimalSource) {
    return value instanceof Decimal ? value : new Decimal(value);
  }

  public static abs(value: DecimalSource) {
    return D(value).abs();
  }

  public static neg(value: DecimalSource) {
    return D(value).neg();
  }

  public static negate(value: DecimalSource) {
    return D(value).neg();
  }

  public static negated(value: DecimalSource) {
    return D(value).neg();
  }

  public static sign(value: DecimalSource) {
    return D(value).sign();
  }

  public static sgn(value: DecimalSource) {
    return D(value).sign();
  }

  public static round(value: DecimalSource) {
    return D(value).round();
  }

  public static floor(value: DecimalSource) {
    return D(value).floor();
  }

  public static ceil(value: DecimalSource) {
    return D(value).ceil();
  }

  public static trunc(value: DecimalSource) {
    return D(value).trunc();
  }

  public static add(value: DecimalSource, other: DecimalSource) {
    return D(value).add(other);
  }

  public static plus(value: DecimalSource, other: DecimalSource) {
    return D(value).add(other);
  }

  public static sub(value: DecimalSource, other: DecimalSource) {
    return D(value).sub(other);
  }

  public static subtract(value: DecimalSource, other: DecimalSource) {
    return D(value).sub(other);
  }

  public static minus(value: DecimalSource, other: DecimalSource) {
    return D(value).sub(other);
  }

  public static mul(value: DecimalSource, other: DecimalSource) {
    return D(value).mul(other);
  }

  public static multiply(value: DecimalSource, other: DecimalSource) {
    return D(value).mul(other);
  }

  public static times(value: DecimalSource, other: DecimalSource) {
    return D(value).mul(other);
  }

  public static div(value: DecimalSource, other: DecimalSource) {
    return D(value).div(other);
  }

  public static divide(value: DecimalSource, other: DecimalSource) {
    return D(value).div(other);
  }

  public static recip(value: DecimalSource) {
    return D(value).recip();
  }

  public static reciprocal(value: DecimalSource) {
    return D(value).recip();
  }

  public static reciprocate(value: DecimalSource) {
    return D(value).reciprocate();
  }

  public static cmp(value: DecimalSource, other: DecimalSource) {
    return D(value).cmp(other);
  }

  public static compare(value: DecimalSource, other: DecimalSource) {
    return D(value).cmp(other);
  }

  public static eq(value: DecimalSource, other: DecimalSource) {
    return D(value).eq(other);
  }

  public static equals(value: DecimalSource, other: DecimalSource) {
    return D(value).eq(other);
  }

  public static neq(value: DecimalSource, other: DecimalSource) {
    return D(value).neq(other);
  }

  public static notEquals(value: DecimalSource, other: DecimalSource) {
    return D(value).notEquals(other);
  }

  public static lt(value: DecimalSource, other: DecimalSource) {
    return D(value).lt(other);
  }

  public static lte(value: DecimalSource, other: DecimalSource) {
    return D(value).lte(other);
  }

  public static gt(value: DecimalSource, other: DecimalSource) {
    return D(value).gt(other);
  }

  public static gte(value: DecimalSource, other: DecimalSource) {
    return D(value).gte(other);
  }

  public static max(value: DecimalSource, other: DecimalSource) {
    return D(value).max(other);
  }

  public static min(value: DecimalSource, other: DecimalSource) {
    return D(value).min(other);
  }

  public static clamp(value: DecimalSource, min: DecimalSource, max: DecimalSource) {
    return D(value).clamp(min, max);
  }

  public static clampMin(value: DecimalSource, min: DecimalSource) {
    return D(value).clampMin(min);
  }

  public static clampMax(value: DecimalSource, max: DecimalSource) {
    return D(value).clampMax(max);
  }

  public static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).cmp_tolerance(other, tolerance);
  }

  public static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).cmp_tolerance(other, tolerance);
  }

  public static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).eq_tolerance(other, tolerance);
  }

  public static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).eq_tolerance(other, tolerance);
  }

  public static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).neq_tolerance(other, tolerance);
  }

  public static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).notEquals_tolerance(other, tolerance);
  }

  public static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).lt_tolerance(other, tolerance);
  }

  public static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).lte_tolerance(other, tolerance);
  }

  public static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).gt_tolerance(other, tolerance);
  }

  public static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    return D(value).gte_tolerance(other, tolerance);
  }

  public static log10(value: DecimalSource) {
    return D(value).log10();
  }

  public static absLog10(value: DecimalSource) {
    return D(value).absLog10();
  }

  public static pLog10(value: DecimalSource) {
    return D(value).pLog10();
  }

  public static log(value: DecimalSource, base: number) {
    return D(value).log(base);
  }

  public static log2(value: DecimalSource) {
    return D(value).log2();
  }

  public static ln(value: DecimalSource) {
    return D(value).ln();
  }

  public static logarithm(value: DecimalSource, base: number) {
    return D(value).logarithm(base);
  }

  public static pow10(value: number) {
    if (Number.isInteger(value)) {
      return ME_NN(1, value);
    }
    return ME(Math.pow(10, value % 1), Math.trunc(value));
  }

  public static pow(value: DecimalSource, other: number | Decimal) {
    // Fast track: 10^integer
    if (typeof value === "number" && value === 10 && typeof other === "number" && Number.isInteger(other)) {
      return ME_NN(1, other);
    }

    return D(value).pow(other);
  }

  public static exp(value: DecimalSource) {
    return D(value).exp();
  }

  public static sqr(value: DecimalSource) {
    return D(value).sqr();
  }

  public static sqrt(value: DecimalSource) {
    return D(value).sqrt();
  }

  public static cube(value: DecimalSource) {
    return D(value).cube();
  }

  public static cbrt(value: DecimalSource) {
    return D(value).cbrt();
  }

  public static dp(value: DecimalSource) {
    return D(value).dp();
  }

  public static decimalPlaces(value: DecimalSource) {
    return D(value).dp();
  }

  /**
   * If you're willing to spend 'resourcesAvailable' and want to buy something
   * with exponentially increasing cost each purchase (start at priceStart,
   * multiply by priceRatio, already own currentOwned), how much of it can you buy?
   * Adapted from Trimps source code.
   */
  public static affordGeometricSeries(
    resourcesAvailable: DecimalSource, priceStart: DecimalSource,
    priceRatio: DecimalSource, currentOwned: number | Decimal) {

    return affordGeometricSeries(
      D(resourcesAvailable),
      D(priceStart),
      D(priceRatio),
      currentOwned,
    );
  }

  /**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it multiplies by priceRatio each purchase?
   */
  public static sumGeometricSeries(
    numItems: number | Decimal, priceStart: DecimalSource,
    priceRatio: DecimalSource, currentOwned: number | Decimal) {

    return sumGeometricSeries(
      numItems,
      D(priceStart),
      D(priceRatio),
      currentOwned,
    );
  }

  /**
   * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
   * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
   * how much of it can you buy?
   */
  public static affordArithmeticSeries(
    resourcesAvailable: DecimalSource, priceStart: DecimalSource,
    priceAdd: DecimalSource, currentOwned: DecimalSource) {

    return affordArithmeticSeries(
      D(resourcesAvailable),
      D(priceStart),
      D(priceAdd),
      D(currentOwned),
    );
  }

  /**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it adds priceAdd each purchase?
   * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
   */
  public static sumArithmeticSeries(
    numItems: DecimalSource, priceStart: DecimalSource,
    priceAdd: DecimalSource, currentOwned: DecimalSource) {

    return sumArithmeticSeries(
      D(numItems),
      D(priceStart),
      D(priceAdd),
      D(currentOwned),
    );
  }

  /**
   * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
   * the lowest efficiency score is the better one to purchase.
   * From Frozen Cookies:
   * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
   */
  public static efficiencyOfPurchase(cost: DecimalSource, currentRpS: DecimalSource, deltaRpS: DecimalSource) {
    return efficiencyOfPurchase(
      D(cost),
      D(currentRpS),
      D(deltaRpS),
    );
  }

  public static randomDecimalForTesting(absMaxExponent: number) {
    // NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
    // 5% of the time, have a mantissa of 0
    if (Math.random() * 20 < 1) {
      return ME_NN(0, 0);
    }
    let mantissa = Math.random() * 10;
    // 10% of the time, have a simple mantissa
    if (Math.random() * 10 < 1) {
      mantissa = Math.round(mantissa);
    }
    mantissa *= Math.sign(Math.random() * 2 - 1);
    const exponent = Math.floor(Math.random() * absMaxExponent * 2) - absMaxExponent;
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
  }

  /**
   * A number (double) with absolute value between [1, 10) OR exactly 0.
   * If mantissa is ever 10 or greater, it should be normalized
   * (divide by 10 and add 1 to exponent until it is less than 10,
   * or multiply by 10 and subtract 1 from exponent until it is 1 or greater).
   * Infinity/-Infinity/NaN will cause bad things to happen.
   */
  public mantissa = NaN;

  /**
   * A number (integer) between -EXP_LIMIT and EXP_LIMIT.
   * Non-integral/out of bounds will cause bad things to happen.
   */
  public exponent = NaN;

  constructor(value?: DecimalSource) {
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

  /**
   * When mantissa is very denormalized, use this to normalize much faster.
   */
  public normalize() {
    if (this.m >= 1 && this.m < 10) {
      return this;
    }

    // TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter
    if (this.m === 0) {
      this.m = 0;
      this.e = 0;
      return this;
    }

    const tempExponent = Math.floor(Math.log10(Math.abs(this.m)));
    this.m = tempExponent === NUMBER_EXP_MIN ?
        this.m * 10 / 1e-323 :
        this.m / powerOf10(tempExponent);
    this.e += tempExponent;
    return this;
  }

  public fromMantissaExponent(mantissa: number, exponent: number) {
    // SAFETY: don't let in non-numbers
    if (!isFinite(mantissa) || !isFinite(exponent)) {
      mantissa = Number.NaN;
      exponent = Number.NaN;
      return this;
    }
    this.m = mantissa;
    this.e = exponent;
    // Non-normalized mantissas can easily get here, so this is mandatory.
    this.normalize();
    return this;
  }

  /**
   * Well, you know what you're doing!
   */
  public fromMantissaExponent_noNormalize(mantissa: number, exponent: number) {
    this.m = mantissa;
    this.e = exponent;
    return this;
  }

  public fromDecimal(value: Decimal) {
    this.m = value.m;
    this.e = value.e;
    return this;
  }

  public fromNumber(value: number) {
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
      this.e = Math.floor(Math.log10(Math.abs(value)));
      // SAFETY: handle 5e-324, -5e-324 separately
      this.m = this.e === NUMBER_EXP_MIN ?
        value * 10 / 1e-323 :
        value / powerOf10(this.e);
      // SAFETY: Prevent weirdness.
      this.normalize();
    }
    return this;
  }

  public fromString(value: string) {
    if (value.indexOf("e") !== -1) {
      const parts = value.split("e");
      this.m = parseFloat(parts[0]);
      this.e = parseFloat(parts[1]);
      // Non-normalized mantissas can easily get here, so this is mandatory.
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
  }

  public fromValue(value?: DecimalSource) {
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
  }

  public toNumber() {
    // Problem: new Decimal(116).toNumber() returns 115.99999999999999.
    // TODO: How to fix in general case? It's clear that if toNumber() is
    //  VERY close to an integer, we want exactly the integer.
    //  But it's not clear how to specifically write that.
    //  So I'll just settle with 'exponent >= 0 and difference between rounded
    //  and not rounded < 1e-9' as a quick fix.

    // var result = this.m*Math.pow(10, this.e);

    if (!isFinite(this.e)) {
      return Number.NaN;
    }
    if (this.e > NUMBER_EXP_MAX) {
      return this.m > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (this.e < NUMBER_EXP_MIN) {
      return 0;
    }
    // SAFETY: again, handle 5e-324, -5e-324 separately
    if (this.e === NUMBER_EXP_MIN) {
      return this.m > 0 ? 5e-324 : -5e-324;
    }

    const result = this.m * powerOf10(this.e);
    if (!isFinite(result) || this.e < 0) {
      return result;
    }
    const resultRounded = Math.round(result);
    if (Math.abs(resultRounded - result) < ROUND_TOLERANCE) {
      return resultRounded;
    }
    return result;
  }

  public mantissaWithDecimalPlaces(places: number) {
    // https://stackoverflow.com/a/37425022

    if (isNaN(this.m) || isNaN(this.e)) {
      return Number.NaN;
    }
    if (this.m === 0) {
      return 0;
    }

    const len = places + 1;
    const numDigits = Math.ceil(Math.log10(Math.abs(this.m)));
    const rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  }

  public toString() {
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
  }

  public toExponential(places: number) {
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
    }

    // two cases:
    // 1) exponent is < 308 and > -324: use basic toFixed
    // 2) everything else: we have to do it ourselves!

    if (this.e > NUMBER_EXP_MIN && this.e < NUMBER_EXP_MAX) {
      return this.toNumber().toExponential(places);
    }

    if (!isFinite(places)) {
      places = MAX_SIGNIFICANT_DIGITS;
    }

    const len = places + 1;
    const numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.m))));
    const rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);

    return rounded.toFixed(Math.max(len - numDigits, 0)) + "e" + (this.e >= 0 ? "+" : "") + this.e;
  }

  public toFixed(places: number) {
    if (isNaN(this.m) || isNaN(this.e)) {
      return "NaN";
    }
    if (this.e >= EXP_LIMIT) {
      return this.m > 0 ? "Infinity" : "-Infinity";
    }
    if (this.e <= -EXP_LIMIT || this.m === 0) {
      return "0" + (places > 0 ? padEnd(".", places + 1, "0") : "");
    }

    // two cases:
    // 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
    // 2) exponent is 16 or less: use basic toFixed

    if (this.e >= MAX_SIGNIFICANT_DIGITS) {
      return this.m.toString()
        .replace(".", "")
        .padEnd(this.e + 1, "0") + (places > 0 ? padEnd(".", places + 1, "0") : "");
    }
    return this.toNumber().toFixed(places);
  }

  public toPrecision(places: number) {
    if (this.e <= -7) {
      return this.toExponential(places - 1);
    }
    if (places > this.e) {
      return this.toFixed(places - this.e - 1);
    }
    return this.toExponential(places - 1);
  }

  public valueOf() {
    return this.toString();
  }

  public toJSON() {
    return this.toString();
  }

  public toStringWithDecimalPlaces(places: number) {
    return this.toExponential(places);
  }

  public abs() {
    return ME_NN(Math.abs(this.m), this.e);
  }

  public neg() {
    return ME_NN(-this.m, this.e);
  }

  public negate() {
    return this.neg();
  }

  public negated() {
    return this.neg();
  }

  public sign() {
    return Math.sign(this.m);
  }

  public sgn() {
    return this.sign();
  }

  public round() {
    if (this.e < -1) {
      return new Decimal(0);
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.round(this.toNumber()));
    }
    return this;
  }

  public floor() {
    if (this.e < -1) {
      return Math.sign(this.m) >= 0 ? new Decimal(0) : new Decimal(-1);
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.floor(this.toNumber()));
    }
    return this;
  }

  public ceil() {
    if (this.e < -1) {
      return Math.sign(this.m) > 0 ? new Decimal(1) : new Decimal(0);
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.ceil(this.toNumber()));
    }
    return this;
  }

  public trunc() {
    if (this.e < 0) {
      return new Decimal(0);
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.trunc(this.toNumber()));
    }
    return this;
  }

  public add(value: DecimalSource) {
    // figure out which is bigger, shrink the mantissa of the smaller
    // by the difference in exponents, add mantissas, normalize and return

    // TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8

    const decimal = D(value);

    if (this.m === 0) {
      return decimal;
    }
    if (decimal.m === 0) {
      return this;
    }

    let biggerDecimal;
    let smallerDecimal;
    if (this.e >= decimal.e) {
      biggerDecimal = this;
      smallerDecimal = decimal;
    } else {
      biggerDecimal = decimal;
      smallerDecimal = this;
    }

    if (biggerDecimal.e - smallerDecimal.e > MAX_SIGNIFICANT_DIGITS) {
      return biggerDecimal;
    }

    // Have to do this because adding numbers that were once integers but scaled down is imprecise.
    // Example: 299 + 18
    return ME(Math.round(
      1e14 * biggerDecimal.m +
      1e14 * smallerDecimal.m * powerOf10(smallerDecimal.e - biggerDecimal.e)),
      biggerDecimal.e - 14);
  }

  public plus(value: DecimalSource) {
    return this.add(value);
  }

  public sub(value: DecimalSource) {
    return this.add(D(value).neg());
  }

  public subtract(value: DecimalSource) {
    return this.sub(value);
  }

  public minus(value: DecimalSource) {
    return this.sub(value);
  }

  public mul(value: DecimalSource) {
    // This version avoids an extra conversion to Decimal, if possible. Since the
    // mantissa is -10...10, any number short of MAX/10 can be safely multiplied in
    if (typeof value === "number") {
      if (value < 1e307 && value > -1e307) {
        return ME(this.m * value, this.e);
      }
      // If the value is larger than 1e307, we can divide that out of mantissa (since it's
      // greater than 1, it won't underflow)
      return ME(this.m * 1e-307 * value, this.e + 307);
    }
    const decimal = typeof value === "string" ? new Decimal(value) : value;
    return ME(this.m * decimal.m, this.e + decimal.e);
  }

  public multiply(value: DecimalSource) {
    return this.mul(value);
  }

  public times(value: DecimalSource) {
    return this.mul(value);
  }

  public div(value: DecimalSource) {
    return this.mul(D(value).recip());
  }

  public divide(value: DecimalSource) {
    return this.div(value);
  }

  public divideBy(value: DecimalSource) {
    return this.div(value);
  }

  public dividedBy(value: DecimalSource) {
    return this.div(value);
  }

  public recip() {
    return ME(1 / this.m, -this.e);
  }

  public reciprocal() {
    return this.recip();
  }

  public reciprocate() {
    return this.recip();
  }

  /**
   * -1 for less than value, 0 for equals value, 1 for greater than value
   */
  public cmp(value: DecimalSource) {
    const decimal = D(value);

    // TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12

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
  }

  public compare(value: DecimalSource) {
    return this.cmp(value);
  }

  public eq(value: DecimalSource) {
    const decimal = D(value);
    return this.e === decimal.e && this.m === decimal.m;
  }

  public equals(value: DecimalSource) {
    return this.eq(value);
  }

  public neq(value: DecimalSource) {
    return !this.eq(value);
  }

  public notEquals(value: DecimalSource) {
    return this.neq(value);
  }

  public lt(value: DecimalSource) {
    const decimal = D(value);
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
  }

  public lte(value: DecimalSource) {
    return !this.gt(value);
  }

  public gt(value: DecimalSource) {
    const decimal = D(value);
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
  }

  public gte(value: DecimalSource) {
    return !this.lt(value);
  }

  public max(value: DecimalSource) {
    const decimal = D(value);
    return this.lt(decimal) ? decimal : this;
  }

  public min(value: DecimalSource) {
    const decimal = D(value);
    return this.gt(decimal) ? decimal : this;
  }

  public clamp(min: DecimalSource, max: DecimalSource) {
    return this.max(min).min(max);
  }

  public clampMin(min: DecimalSource) {
    return this.max(min);
  }

  public clampMax(max: DecimalSource) {
    return this.min(max);
  }

  public cmp_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) ? 0 : this.cmp(decimal);
  }

  public compare_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.cmp_tolerance(value, tolerance);
  }

  /**
   * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
   * For example, if you put in 1e-9, then any number closer to the
   * larger number than (larger number)*1e-9 will be considered equal.
   */
  public eq_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    // https://stackoverflow.com/a/33024979
    // return abs(a-b) <= tolerance * max(abs(a), abs(b))

    return Decimal.lte(
      this.sub(decimal).abs(),
      Decimal.max(this.abs(), decimal.abs()).mul(tolerance),
    );
  }

  public equals_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.eq_tolerance(value, tolerance);
  }

  public neq_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return !this.eq_tolerance(value, tolerance);
  }

  public notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.neq_tolerance(value, tolerance);
  }

  public lt_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return !this.eq_tolerance(decimal, tolerance) && this.lt(decimal);
  }

  public lte_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) || this.lt(decimal);
  }

  public gt_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return !this.eq_tolerance(decimal, tolerance) && this.gt(decimal);
  }

  public gte_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) || this.gt(decimal);
  }

  public log10() {
    return this.e + Math.log10(this.m);
  }

  public absLog10() {
    return this.e + Math.log10(Math.abs(this.m));
  }

  public pLog10() {
    return this.m <= 0 || this.e < 0 ? 0 : this.log10();
  }

  public log(base: number) {
    // UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater).
    // We assume this to be true and thus only need to return a number, not a Decimal,
    // and don't do any other kind of error checking.
    return (Math.LN10 / Math.log(base)) * this.log10();
  }

  public log2() {
    return 3.32192809488736234787 * this.log10();
  }

  public ln() {
    return 2.30258509299404568402 * this.log10();
  }

  public logarithm(base: number) {
    return this.log(base);
  }

  public pow(value: number | Decimal) {
    // UN-SAFETY: Accuracy not guaranteed beyond ~9~11 decimal places.
    // TODO: Decimal.pow(new Decimal(0.5), 0); or Decimal.pow(new Decimal(1), -1);
    //  makes an exponent of -0! Is a negative zero ever a problem?

    const numberValue = value instanceof Decimal ? value.toNumber() : value;

    // TODO: Fast track seems about neutral for performance.
    //  It might become faster if an integer pow is implemented,
    //  or it might not be worth doing (see https://github.com/Patashu/break_infinity.js/issues/4 )

    // Fast track: If (this.e*value) is an integer and mantissa^value
    // fits in a Number, we can do a very fast method.
    const temp = this.e * numberValue;
    let newMantissa;
    if (Number.isSafeInteger(temp)) {
      newMantissa = Math.pow(this.m, numberValue);
      if (isFinite(newMantissa) && newMantissa !== 0) {
        return ME(newMantissa, temp);
      }
    }

    // Same speed and usually more accurate.

    const newExponent = Math.trunc(temp);
    const residue = temp - newExponent;
    newMantissa = Math.pow(10, numberValue * Math.log10(this.m) + residue);
    if (isFinite(newMantissa) && newMantissa !== 0) {
      return ME(newMantissa, newExponent);
    }

    // return Decimal.exp(value*this.ln());
    // UN-SAFETY: This should return NaN when mantissa is negative and value is non-integer.
    const result = Decimal.pow10(numberValue * this.absLog10()); // this is 2x faster and gives same values AFAIK
    if (this.sign() === -1 && numberValue % 2 === 1) {
      return result.neg();
    }
    return result;
  }

  public pow_base(value: DecimalSource) {
    return D(value).pow(this);
  }

  public factorial() {
    // Using Stirling's Approximation.
    // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators

    const n = this.toNumber() + 1;

    return Decimal.pow(
      (n / Math.E) * Math.sqrt(n * Math.sinh(1 / n) + 1 /
      (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
  }

  public exp() {
    const x = this.toNumber();
    // Fast track: if -706 < this < 709, we can use regular exp.
    if (-706 < x && x < 709) {
      return Decimal.fromNumber(Math.exp(x));
    }
    return Decimal.pow(Math.E, x);
  }

  public sqr() {
    return ME(Math.pow(this.m, 2), this.e * 2);
  }

  public sqrt() {
    if (this.m < 0) {
      return new Decimal(Number.NaN);
    }
    if (this.e % 2 !== 0) {
      return ME(Math.sqrt(this.m) * 3.16227766016838, Math.floor(this.e / 2));
    }
    // Mod of a negative number is negative, so != means '1 or -1'
    return ME(Math.sqrt(this.m), Math.floor(this.e / 2));
  }

  public cube() {
    return ME(Math.pow(this.m, 3), this.e * 3);
  }

  public cbrt() {
    let sign = 1;
    let mantissa = this.m;
    if (mantissa < 0) {
      sign = -1;
      mantissa = -mantissa;
    }
    const newMantissa = sign * Math.pow(mantissa, 1 / 3);

    const mod = this.e % 3;
    if (mod === 1 || mod === -1) {
      return ME(newMantissa * 2.1544346900318837, Math.floor(this.e / 3));
    }
    if (mod !== 0) {
      return ME(newMantissa * 4.6415888336127789, Math.floor(this.e / 3));
    }
    // mod != 0 at this point means 'mod == 2 || mod == -2'
    return ME(newMantissa, Math.floor(this.e / 3));
  }

  // Some hyperbolic trig functions that happen to be easy
  public sinh() {
    return this.exp().sub(this.negate().exp()).div(2);
  }

  public cosh() {
    return this.exp().add(this.negate().exp()).div(2);
  }

  public tanh() {
    return this.sinh().div(this.cosh());
  }

  public asinh() {
    return Decimal.ln(this.add(this.sqr().add(1).sqrt()));
  }

  public acosh() {
    return Decimal.ln(this.add(this.sqr().sub(1).sqrt()));
  }

  public atanh() {
    if (this.abs().gte(1)) {
      return Number.NaN;
    }
    return Decimal.ln(this.add(1).div(new Decimal(1).sub(this))) / 2;
  }

  /**
   * Joke function from Realm Grinder
   */
  public ascensionPenalty(ascensions: number) {
    if (ascensions === 0) {
      return this;
    }
    return this.pow(Math.pow(10, -ascensions));
  }

  /**
   * Joke function from Cookie Clicker. It's 'egg'
   */
  public egg() {
    return this.add(9);
  }

  public lessThanOrEqualTo(other: DecimalSource) {
    return this.cmp(other) < 1;
  }

  public lessThan(other: DecimalSource) {
    return this.cmp(other) < 0;
  }

  public greaterThanOrEqualTo(other: DecimalSource) {
    return this.cmp(other) > -1;
  }

  public greaterThan(other: DecimalSource) {
    return this.cmp(other) > 0;
  }

  public decimalPlaces() {
    return this.dp();
  }

  public dp() {
    if (!isFinite(this.mantissa)) {
      return NaN;
    }
    if (this.exponent >= MAX_SIGNIFICANT_DIGITS) {
      return 0;
    }

    const mantissa = this.mantissa;
    let places = -this.exponent;
    let e = 1;
    while (Math.abs(Math.round(mantissa * e) / e - mantissa) > ROUND_TOLERANCE) {
      e *= 10;
      places++;
    }
    return places > 0 ? places : 0;
  }

  public static get MAX_VALUE() {
    return MAX_VALUE;
  }

  public static get MIN_VALUE() {
    return MIN_VALUE;
  }

  public static get NUMBER_MAX_VALUE() {
    return NUMBER_MAX_VALUE;
  }

  public static get NUMBER_MIN_VALUE() {
    return NUMBER_MIN_VALUE;
  }
}

const MAX_VALUE = ME_NN(1, EXP_LIMIT);
const MIN_VALUE = ME_NN(1, -EXP_LIMIT);
const NUMBER_MAX_VALUE = D(Number.MAX_VALUE);
const NUMBER_MIN_VALUE = D(Number.MIN_VALUE);
