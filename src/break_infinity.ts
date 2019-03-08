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

type DecimalSource = Decimal | number | string | undefined | null;

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

  public static abs(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.abs();
  }

  public static neg(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.neg();
  }

  public static negate(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.neg();
  }

  public static negated(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.neg();
  }

  public static sign(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sign();
  }

  public static sgn(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sign();
  }

  public static round(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.round();
  }

  public static floor(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.floor();
  }

  public static ceil(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.ceil();
  }

  public static trunc(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.trunc();
  }

  public static add(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.add(other);
  }

  public static plus(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.add(other);
  }

  public static sub(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sub(other);
  }

  public static subtract(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sub(other);
  }

  public static minus(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sub(other);
  }

  public static mul(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.mul(other);
  }

  public static multiply(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.mul(other);
  }

  public static times(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.mul(other);
  }

  public static div(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.div(other);
  }

  public static divide(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.div(other);
  }

  public static recip(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.recip();
  }

  public static reciprocal(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.recip();
  }

  public static reciprocate(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.reciprocate();
  }

  public static cmp(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.cmp(other);
  }

  public static compare(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.cmp(other);
  }

  public static eq(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.eq(other);
  }

  public static equals(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.eq(other);
  }

  public static neq(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.neq(other);
  }

  public static notEquals(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.notEquals(other);
  }

  public static lt(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.lt(other);
  }

  public static lte(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.lte(other);
  }

  public static gt(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.gt(other);
  }

  public static gte(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.gte(other);
  }

  public static max(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.max(other);
  }

  public static min(value: DecimalSource, other: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.min(other);
  }

  public static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.cmp_tolerance(other, tolerance);
  }

  public static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.cmp_tolerance(other, tolerance);
  }

  public static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.eq_tolerance(other, tolerance);
  }

  public static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.eq_tolerance(other, tolerance);
  }

  public static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.neq_tolerance(other, tolerance);
  }

  public static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.notEquals_tolerance(other, tolerance);
  }

  public static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.lt_tolerance(other, tolerance);
  }

  public static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.lte_tolerance(other, tolerance);
  }

  public static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.gt_tolerance(other, tolerance);
  }

  public static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.gte_tolerance(other, tolerance);
  }

  public static log10(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.log10();
  }

  public static log(value: DecimalSource, base: number) {
    value = Decimal.fromValue(value);

    return value.log(base);
  }

  public static log2(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.log2();
  }

  public static ln(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.ln();
  }

  public static logarithm(value: DecimalSource, base: number) {
    value = Decimal.fromValue(value);

    return value.logarithm(base);
  }

  public static pow10(value: number) {
    if (Number.isInteger(value)) {
      return Decimal.fromMantissaExponent_noNormalize(1, value);
    }
    return Decimal.fromMantissaExponent(Math.pow(10, value % 1), Math.trunc(value));
  }

  public static pow(value: DecimalSource, other: number | Decimal) {
    // Fast track: 10^integer
    if (value === 10 && typeof other === "number" && Number.isInteger(other)) {
      return Decimal.fromMantissaExponent_noNormalize(1, other);
    }

    value = Decimal.fromValue(value);

    return value.pow(other);
  }

  public static exp(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.exp();
  }

  public static sqr(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sqr();
  }

  public static sqrt(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.sqrt();
  }

  public static cube(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.cube();
  }

  public static cbrt(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.cbrt();
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

    resourcesAvailable = Decimal.fromValue(resourcesAvailable);
    priceStart = Decimal.fromValue(priceStart);
    priceRatio = Decimal.fromValue(priceRatio);
    const actualStart = priceStart.mul(Decimal.pow(priceRatio, currentOwned));

    return Decimal.floor(
      Decimal.log10((resourcesAvailable.div(actualStart).mul(priceRatio.sub(1))).add(1))
      / Decimal.log10(priceRatio));
  }

  /**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it multiplies by priceRatio each purchase?
   */
  public static sumGeometricSeries(
    numItems: number | Decimal, priceStart: DecimalSource,
    priceRatio: DecimalSource, currentOwned: number | Decimal) {

    priceStart = Decimal.fromValue(priceStart);
    priceRatio = Decimal.fromValue(priceRatio);
    const actualStart = priceStart.mul(Decimal.pow(priceRatio, currentOwned));

    return (actualStart.mul(Decimal.sub(1, Decimal.pow(priceRatio, numItems)))).div(Decimal.sub(1, priceRatio));
  }

  /**
   * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
   * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
   * how much of it can you buy?
   */
  public static affordArithmeticSeries(
    resourcesAvailable: DecimalSource, priceStart: DecimalSource,
    priceAdd: DecimalSource, currentOwned: DecimalSource) {

    resourcesAvailable = Decimal.fromValue(resourcesAvailable);
    priceStart = Decimal.fromValue(priceStart);
    priceAdd = Decimal.fromValue(priceAdd);
    currentOwned = Decimal.fromValue(currentOwned);
    const actualStart = priceStart.add(Decimal.mul(currentOwned, priceAdd));

    // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
    // where a is actualStart, d is priceAdd and S is resourcesAvailable
    // then floor it and you're done!

    const b = actualStart.sub(priceAdd.div(2));
    const b2 = b.pow(2);

    return Decimal.floor(
      (b.neg().add(Decimal.sqrt(b2.add(Decimal.mul(priceAdd, resourcesAvailable).mul(2))))
      ).div(priceAdd),
    );

    // return Decimal.floor(something);
  }

  /**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it adds priceAdd each purchase?
   * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
   */
  public static sumArithmeticSeries(
    numItems: DecimalSource, priceStart: DecimalSource,
    priceAdd: DecimalSource, currentOwned: DecimalSource) {

    numItems = Decimal.fromValue(numItems);
    priceStart = Decimal.fromValue(priceStart);
    priceAdd = Decimal.fromValue(priceAdd);
    currentOwned = Decimal.fromValue(currentOwned);
    const actualStart = priceStart.add(Decimal.mul(currentOwned, priceAdd));

    // (n/2)*(2*a+(n-1)*d)

    return Decimal.div(numItems, 2).mul(Decimal.mul(2, actualStart).plus(numItems.sub(1).mul(priceAdd)));
  }

  /**
   * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
   * the lowest efficiency score is the better one to purchase.
   * From Frozen Cookies:
   * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
   */
  public static efficiencyOfPurchase(cost: DecimalSource, currentRpS: DecimalSource, deltaRpS: DecimalSource) {
    cost = Decimal.fromValue(cost);
    currentRpS = Decimal.fromValue(currentRpS);
    deltaRpS = Decimal.fromValue(deltaRpS);
    return Decimal.add(cost.div(currentRpS), cost.div(deltaRpS));
  }

  public static randomDecimalForTesting(absMaxExponent: number) {
    // NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
    // 5% of the time, have a mantissa of 0
    if (Math.random() * 20 < 1) {
      return Decimal.fromMantissaExponent_noNormalize(0, 0);
    }
    let mantissa = Math.random() * 10;
    // 10% of the time, have a simple mantissa
    if (Math.random() * 10 < 1) {
      mantissa = Math.round(mantissa);
    }
    mantissa *= Math.sign(Math.random() * 2 - 1);
    const exponent = Math.floor(Math.random() * absMaxExponent * 2) - absMaxExponent;
    return Decimal.fromMantissaExponent(mantissa, exponent);

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

  public mantissa = NaN;
  public exponent = NaN;

  constructor(value?: DecimalSource) {
    if (value instanceof Decimal) {
      this.fromDecimal(value);
    } else if (typeof (value) === "number") {
      this.fromNumber(value);
    } else if (typeof (value) === "string") {
      this.fromString(value);
    } else {
      this.mantissa = 0;
      this.exponent = 0;
    }
  }

  /**
   * When mantissa is very denormalized, use this to normalize much faster.
   */
  public normalize() {
    if (this.mantissa >= 1 && this.mantissa < 10) {
      return;
    }

    // TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter
    if (this.mantissa === 0) {
      this.mantissa = 0;
      this.exponent = 0;
      return;
    }

    const tempExponent = Math.floor(Math.log10(Math.abs(this.mantissa)));
    this.mantissa = this.mantissa / powerOf10(tempExponent);
    this.exponent += tempExponent;

    return this;
  }

  public fromMantissaExponent(mantissa: number, exponent: number) {
    // SAFETY: don't let in non-numbers
    if (!isFinite(mantissa) || !isFinite(exponent)) {
      mantissa = Number.NaN;
      exponent = Number.NaN;
      return this;
    }
    this.mantissa = mantissa;
    this.exponent = exponent;
    // Non-normalized mantissas can easily get here, so this is mandatory.
    this.normalize();
    return this;
  }

  /**
   * Well, you know what you're doing!
   */
  public fromMantissaExponent_noNormalize(mantissa: number, exponent: number) {
    this.mantissa = mantissa;
    this.exponent = exponent;
    return this;
  }

  public fromDecimal(value: Decimal) {
    this.mantissa = value.mantissa;
    this.exponent = value.exponent;
    return this;
  }

  public fromNumber(value: number) {
    // SAFETY: Handle Infinity and NaN in a somewhat meaningful way.
    if (isNaN(value)) {
      this.mantissa = Number.NaN;
      this.exponent = Number.NaN;
    } else if (value === Number.POSITIVE_INFINITY) {
      this.mantissa = 1;
      this.exponent = EXP_LIMIT;
    } else if (value === Number.NEGATIVE_INFINITY) {
      this.mantissa = -1;
      this.exponent = EXP_LIMIT;
    } else if (value === 0) {
      this.mantissa = 0;
      this.exponent = 0;
    } else {
      this.exponent = Math.floor(Math.log10(Math.abs(value)));
      // SAFETY: handle 5e-324, -5e-324 separately
      this.mantissa = this.exponent === NUMBER_EXP_MIN ?
        value * 10 / 1e-323 :
        value / powerOf10(this.exponent);
      // SAFETY: Prevent weirdness.
      this.normalize();
    }
    return this;
  }

  public fromString(value: string) {
    if (value.indexOf("e") !== -1) {
      const parts = value.split("e");
      this.mantissa = parseFloat(parts[0]);
      this.exponent = parseFloat(parts[1]);
      // Non-normalized mantissas can easily get here, so this is mandatory.
      this.normalize();
    } else if (value === "NaN") {
      this.mantissa = Number.NaN;
      this.exponent = Number.NaN;
    } else {
      this.fromNumber(parseFloat(value));
      if (isNaN(this.mantissa)) {
        throw Error("[DecimalError] Invalid argument: " + value);
      }
    }
    return this;
  }

  public fromValue(value: DecimalSource) {
    if (value instanceof Decimal) {
      return this.fromDecimal(value);
    } else if (typeof (value) === "number") {
      return this.fromNumber(value);
    } else if (typeof (value) === "string") {
      return this.fromString(value);
    } else {
      this.mantissa = 0;
      this.exponent = 0;
      return this;
    }
  }

  public toNumber() {
    // Problem: new Decimal(116).toNumber() returns 115.99999999999999.
    // TODO: How to fix in general case? It's clear that if toNumber() is
    //  VERY close to an integer, we want exactly the integer.
    //  But it's not clear how to specifically write that.
    //  So I'll just settle with 'exponent >= 0 and difference between rounded
    //  and not rounded < 1e-9' as a quick fix.

    // var result = this.mantissa*Math.pow(10, this.exponent);

    if (!isFinite(this.exponent)) {
      return Number.NaN;
    }
    if (this.exponent > NUMBER_EXP_MAX) {
      return this.mantissa > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (this.exponent < NUMBER_EXP_MIN) {
      return 0;
    }
    // SAFETY: again, handle 5e-324, -5e-324 separately
    if (this.exponent === NUMBER_EXP_MIN) {
      return this.mantissa > 0 ? 5e-324 : -5e-324;
    }

    const result = this.mantissa * powerOf10(this.exponent);
    if (!isFinite(result) || this.exponent < 0) {
      return result;
    }
    const resultRounded = Math.round(result);
    if (Math.abs(resultRounded - result) < 1e-10) {
      return resultRounded;
    }
    return result;
  }

  public mantissaWithDecimalPlaces(places: number) {
    // https://stackoverflow.com/a/37425022

    if (isNaN(this.mantissa) || isNaN(this.exponent)) {
      return Number.NaN;
    }
    if (this.mantissa === 0) {
      return 0;
    }

    const len = places + 1;
    const numDigits = Math.ceil(Math.log10(Math.abs(this.mantissa)));
    const rounded = Math.round(this.mantissa * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  }

  public toString() {
    if (isNaN(this.mantissa) || isNaN(this.exponent)) {
      return "NaN";
    }
    if (this.exponent >= EXP_LIMIT) {
      return this.mantissa > 0 ? "Infinity" : "-Infinity";
    }
    if (this.exponent <= -EXP_LIMIT || this.mantissa === 0) {
      return "0";
    }

    if (this.exponent < 21 && this.exponent > -7) {
      return this.toNumber().toString();
    }

    return this.mantissa + "e" + (this.exponent >= 0 ? "+" : "") + this.exponent;
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

    if (isNaN(this.mantissa) || isNaN(this.exponent)) {
      return "NaN";
    }
    if (this.exponent >= EXP_LIMIT) {
      return this.mantissa > 0 ? "Infinity" : "-Infinity";
    }
    if (this.exponent <= -EXP_LIMIT || this.mantissa === 0) {
      return "0" + (places > 0 ? padEnd(".", places + 1, "0") : "") + "e+0";
    }

    // two cases:
    // 1) exponent is < 308 and > -324: use basic toFixed
    // 2) everything else: we have to do it ourselves!

    if (this.exponent > NUMBER_EXP_MIN && this.exponent < NUMBER_EXP_MAX) {
      return this.toNumber().toExponential(places);
    }

    if (!isFinite(places)) {
      places = MAX_SIGNIFICANT_DIGITS;
    }

    const len = places + 1;
    const numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.mantissa))));
    const rounded = Math.round(this.mantissa * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);

    return rounded.toFixed(Math.max(len - numDigits, 0)) + "e" + (this.exponent >= 0 ? "+" : "") + this.exponent;
  }

  public toFixed(places: number) {
    if (isNaN(this.mantissa) || isNaN(this.exponent)) {
      return "NaN";
    }
    if (this.exponent >= EXP_LIMIT) {
      return this.mantissa > 0 ? "Infinity" : "-Infinity";
    }
    if (this.exponent <= -EXP_LIMIT || this.mantissa === 0) {
      return "0" + (places > 0 ? padEnd(".", places + 1, "0") : "");
    }

    // two cases:
    // 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
    // 2) exponent is 16 or less: use basic toFixed

    if (this.exponent >= MAX_SIGNIFICANT_DIGITS) {
      return this.mantissa.toString()
        .replace(".", "")
        .padEnd(this.exponent + 1, "0") + (places > 0 ? padEnd(".", places + 1, "0") : "");
    } else {
      return this.toNumber().toFixed(places + 1);
    }
  }

  public toPrecision(places: number) {
    if (this.exponent <= -7) {
      return this.toExponential(places - 1);
    }
    if (places > this.exponent) {
      return this.toFixed(places - this.exponent - 1);
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
    return Decimal.fromMantissaExponent_noNormalize(Math.abs(this.mantissa), this.exponent);
  }

  public neg() {
    return Decimal.fromMantissaExponent_noNormalize(-this.mantissa, this.exponent);
  }

  public negate() {
    return this.neg();
  }

  public negated() {
    return this.neg();
  }

  public sign() {
    return Math.sign(this.mantissa);
  }

  public sgn() {
    return this.sign();
  }

  public round() {
    if (this.exponent < -1) {
      return new Decimal(0);
    } else if (this.exponent < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.round(this.toNumber()));
    }
    return this;
  }

  public floor() {
    if (this.exponent < -1) {
      return Math.sign(this.mantissa) >= 0 ? new Decimal(0) : new Decimal(-1);
    } else if (this.exponent < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.floor(this.toNumber()));
    }
    return this;
  }

  public ceil() {
    if (this.exponent < -1) {
      return Math.sign(this.mantissa) > 0 ? new Decimal(1) : new Decimal(0);
    }
    if (this.exponent < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.ceil(this.toNumber()));
    }
    return this;
  }

  public trunc() {
    if (this.exponent < 0) {
      return new Decimal(0);
    } else if (this.exponent < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.trunc(this.toNumber()));
    }
    return this;
  }

  public add(value: DecimalSource) {
    // figure out which is bigger, shrink the mantissa of the smaller
    // by the difference in exponents, add mantissas, normalize and return

    // TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8

    value = Decimal.fromValue(value);

    if (this.mantissa === 0) {
      return value;
    }
    if (value.mantissa === 0) {
      return this;
    }

    let biggerDecimal;
    let smallerDecimal;
    if (this.exponent >= value.exponent) {
      biggerDecimal = this;
      smallerDecimal = value;
    } else {
      biggerDecimal = value;
      smallerDecimal = this;
    }

    if (biggerDecimal.exponent - smallerDecimal.exponent > MAX_SIGNIFICANT_DIGITS) {
      return biggerDecimal;
    } else {
      // Have to do this because adding numbers that were once integers but scaled down is imprecise.
      // Example: 299 + 18
      return Decimal.fromMantissaExponent(
        Math.round(
          1e14 * biggerDecimal.mantissa +
          1e14 * smallerDecimal.mantissa * powerOf10(smallerDecimal.exponent - biggerDecimal.exponent)),
        biggerDecimal.exponent - 14);
    }
  }

  public plus(value: DecimalSource) {
    return this.add(value);
  }

  public sub(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return this.add(Decimal.fromMantissaExponent_noNormalize(-value.mantissa, value.exponent));
  }

  public subtract(value: DecimalSource) {
    return this.sub(value);
  }

  public minus(value: DecimalSource) {
    return this.sub(value);
  }

  public mul(value: DecimalSource) {

    // a_1*10^b_1 * a_2*10^b_2
    // = a_1*a_2*10^(b_1+b_2)

    value = Decimal.fromValue(value);

    return Decimal.fromMantissaExponent(this.mantissa * value.mantissa, this.exponent + value.exponent);
  }

  public multiply(value: DecimalSource) {
    return this.mul(value);
  }

  public times(value: DecimalSource) {
    return this.mul(value);
  }

  public div(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return this.mul(value.recip());
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
    return Decimal.fromMantissaExponent(1 / this.mantissa, -this.exponent);
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
    value = Decimal.fromValue(value);

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

    if (this.mantissa === 0) {
      if (value.mantissa === 0) {
        return 0;
      }
      if (value.mantissa < 0) {
        return 1;
      }
      if (value.mantissa > 0) {
        return -1;
      }
    } else if (value.mantissa === 0) {
      if (this.mantissa < 0) {
        return -1;
      }
      if (this.mantissa > 0) {
        return 1;
      }
    }

    if (this.mantissa > 0) {
      if (value.mantissa < 0) {
        return 1;
      }
      if (this.exponent > value.exponent) {
        return 1;
      }
      if (this.exponent < value.exponent) {
        return -1;
      }
      if (this.mantissa > value.mantissa) {
        return 1;
      }
      if (this.mantissa < value.mantissa) {
        return -1;
      }
      return 0;
    } else if (this.mantissa < 0) {
      if (value.mantissa > 0) {
        return -1;
      }
      if (this.exponent > value.exponent) {
        return -1;
      }
      if (this.exponent < value.exponent) {
        return 1;
      }
      if (this.mantissa > value.mantissa) {
        return 1;
      }
      if (this.mantissa < value.mantissa) {
        return -1;
      }
      return 0;
    }
    // FIXME: What should be here?
    return 0;
  }

  public compare(value: DecimalSource) {
    return this.cmp(value);
  }

  public eq(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return this.exponent === value.exponent && this.mantissa === value.mantissa;
  }

  public equals(value: DecimalSource) {
    return this.eq(value);
  }

  public neq(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return this.exponent !== value.exponent || this.mantissa !== value.mantissa;
  }

  public notEquals(value: DecimalSource) {
    return this.neq(value);
  }

  public lt(value: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.mantissa === 0) {
      return value.mantissa > 0;
    }
    if (value.mantissa === 0) {
      return this.mantissa <= 0;
    }
    if (this.exponent === value.exponent) {
      return this.mantissa < value.mantissa;
    }
    if (this.mantissa > 0) {
      return value.mantissa > 0 && this.exponent < value.exponent;
    }
    return value.mantissa > 0 || this.exponent > value.exponent;
  }

  public lte(value: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.mantissa === 0) {
      return value.mantissa >= 0;
    }
    if (value.mantissa === 0) {
      return this.mantissa <= 0;
    }
    if (this.exponent === value.exponent) {
      return this.mantissa <= value.mantissa;
    }
    if (this.mantissa > 0) {
      return value.mantissa > 0 && this.exponent < value.exponent;
    }
    return value.mantissa > 0 || this.exponent > value.exponent;
  }

  public gt(value: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.mantissa === 0) {
      return value.mantissa < 0;
    }
    if (value.mantissa === 0) {
      return this.mantissa > 0;
    }
    if (this.exponent === value.exponent) {
      return this.mantissa > value.mantissa;
    }
    if (this.mantissa > 0) {
      return value.mantissa < 0 || this.exponent > value.exponent;
    }
    return value.mantissa < 0 && this.exponent < value.exponent;
  }

  public gte(value: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.mantissa === 0) {
      return value.mantissa <= 0;
    }
    if (value.mantissa === 0) {
      return this.mantissa > 0;
    }
    if (this.exponent === value.exponent) {
      return this.mantissa >= value.mantissa;
    }
    if (this.mantissa > 0) {
      return value.mantissa < 0 || this.exponent > value.exponent;
    }
    return value.mantissa < 0 && this.exponent < value.exponent;
  }

  public max(value: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.gte(value)) {
      return this;
    }
    return value;
  }

  public min(value: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.lte(value)) {
      return this;
    }
    return value;
  }

  public cmp_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.eq_tolerance(value, tolerance)) {
      return 0;
    }
    return this.cmp(value);
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
    value = Decimal.fromValue(value);

    // https://stackoverflow.com/a/33024979
    // return abs(a-b) <= tolerance * max(abs(a), abs(b))

    return Decimal.lte(
      this.sub(value).abs(),
      Decimal.max(this.abs(), value.abs()).mul(tolerance),
    );
  }

  public equals_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.eq_tolerance(value, tolerance);
  }

  public neq_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    return !this.eq_tolerance(value, tolerance);
  }

  public notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.neq_tolerance(value, tolerance);
  }

  public lt_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.eq_tolerance(value, tolerance)) {
      return false;
    }
    return this.lt(value);
  }

  public lte_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.eq_tolerance(value, tolerance)) {
      return true;
    }
    return this.lt(value);
  }

  public gt_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.eq_tolerance(value, tolerance)) {
      return false;
    }
    return this.gt(value);
  }

  public gte_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    value = Decimal.fromValue(value);

    if (this.eq_tolerance(value, tolerance)) {
      return true;
    }
    return this.gt(value);
  }

  public abslog10() {
    return this.exponent + Math.log10(Math.abs(this.mantissa));
  }

  public log10() {
    return this.exponent + Math.log10(this.mantissa);
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

    if (value instanceof Decimal) {
      value = value.toNumber();
    }

    // TODO: Fast track seems about neutral for performance.
    //  It might become faster if an integer pow is implemented,
    //  or it might not be worth doing (see https://github.com/Patashu/break_infinity.js/issues/4 )

    // Fast track: If (this.exponent*value) is an integer and mantissa^value
    // fits in a Number, we can do a very fast method.
    const temp = this.exponent * value;
    let newMantissa;
    if (Number.isSafeInteger(temp)) {
      newMantissa = Math.pow(this.mantissa, value);
      if (isFinite(newMantissa)) {
        return Decimal.fromMantissaExponent(newMantissa, temp);
      }
    }

    // Same speed and usually more accurate.

    const newExponent = Math.trunc(temp);
    const residue = temp - newExponent;
    newMantissa = Math.pow(10, value * Math.log10(this.mantissa) + residue);
    if (isFinite(newMantissa)) {
      return Decimal.fromMantissaExponent(newMantissa, newExponent);
    }

    // return Decimal.exp(value*this.ln());
    // UN-SAFETY: This should return NaN when mantissa is negative and value is noninteger.
    const result = Decimal.pow10(value * this.abslog10()); // this is 2x faster and gives same values AFAIK
    if (this.sign() === -1 && value % 2 === 1) {
      return result.neg();
    }
    return result;
  }

  public pow_base(value: DecimalSource) {
    value = Decimal.fromValue(value);

    return value.pow(this);
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
    // UN-SAFETY: Assuming this value is between [-2.1e15, 2.1e15]. Accuracy not guaranteed beyond ~9~11 decimal places.

    // Fast track: if -706 < this < 709, we can use regular exp.
    let x = this.toNumber();
    if (-706 < x && x < 709) {
      return Decimal.fromNumber(Math.exp(x));
    } else {
      // This has to be implemented fundamentally, so that pow(value) can be implemented on top of it.
      // Should be fast and accurate over the range [-2.1e15, 2.1e15].
      // Outside that it overflows, so we don't care about these cases.

      // Implementation from SpeedCrunch:
      // tslint:disable-next-line:max-line-length
      // https://bitbucket.org/heldercorreia/speedcrunch/src/9cffa7b674890affcb877bfebc81d39c26b20dcc/src/math/floatexp.c?at=master&fileviewer=file-view-default

      let exp;
      let tmp;
      let expx;

      exp = 0;
      expx = this.exponent;

      if (expx >= 0) {
        exp = Math.trunc(x / Math.LN10);
        tmp = exp * Math.LN10;
        x -= tmp;
        if (x >= Math.LN10) {
          ++exp;
          x -= Math.LN10;
        }
      }
      if (x < 0) {
        --exp;
        x += Math.LN10;
      }

      // When we get here 0 <= x < ln 10
      x = Math.exp(x);

      if (exp !== 0) {
        // TODO: or round, or even nothing? can it ever be non-integer?
        expx = Math.floor(exp);
        Decimal.fromMantissaExponent(x, expx);
      }

      // FIXME
      return Decimal.fromNumber(x);
    }
  }

  public sqr() {
    return Decimal.fromMantissaExponent(Math.pow(this.mantissa, 2), this.exponent * 2);
  }

  public sqrt() {
    if (this.mantissa < 0) {
      return new Decimal(Number.NaN);
    }
    if (this.exponent % 2 !== 0) {
      return Decimal.fromMantissaExponent(Math.sqrt(this.mantissa) * 3.16227766016838, Math.floor(this.exponent / 2));
    }
    // Mod of a negative number is negative, so != means '1 or -1'
    return Decimal.fromMantissaExponent(Math.sqrt(this.mantissa), Math.floor(this.exponent / 2));
  }

  public cube() {
    return Decimal.fromMantissaExponent(Math.pow(this.mantissa, 3), this.exponent * 3);
  }

  public cbrt() {
    let sign = 1;
    let mantissa = this.mantissa;
    if (mantissa < 0) {
      sign = -1;
      mantissa = -mantissa;
    }
    const newMantissa = sign * Math.pow(mantissa, (1 / 3));

    const mod = this.exponent % 3;
    if (mod === 1 || mod === -1) {
      return Decimal.fromMantissaExponent(newMantissa * 2.1544346900318837, Math.floor(this.exponent / 3));
    }
    if (mod !== 0) {
      return Decimal.fromMantissaExponent(newMantissa * 4.6415888336127789, Math.floor(this.exponent / 3));
    }
    // mod != 0 at this point means 'mod == 2 || mod == -2'
    return Decimal.fromMantissaExponent(newMantissa, Math.floor(this.exponent / 3));
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
}
