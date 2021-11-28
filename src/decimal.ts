import { powerOf10 } from "./power-of-10";
import { repeatZeroes, trailZeroes } from "./repeat-zeroes";

import {
  fromMantissaExponent, fromRawMantissaExponent, negate_S, add_SS, negate_D,
  add_DS, fromDecimal, fromNumber, fromString, fromValue, assignFromValue,
  assignFromNumber, fromValueNoAlloc, abs_D, abs_S, sign_S, sign_D, round_D,
  round_S, floor_D, floor_S, ceil_D, ceil_S, isZero, trunc_D, trunc_S,
  subtract_DS, subtract_SS, multiply_DS, multiply_SS, reciprocate_D,
  reciprocate_S, divide_DS, divide_SS, compare_DS, compare_SS, equals_DS,
  equals_SS, notEquals_DS, notEquals_SS, lessThan_DS, lessThan_SS,
  lessThanOrEquals_DS, lessThanOrEquals_SS, greaterThan_DS,
  greaterThanOrEquals_DS, greaterThan_SS, greaterThanOrEquals_SS, compare_DD
} from "./internal";

import {
  MAX_SIGNIFICANT_DIGITS, EXP_LIMIT,
  NUMBER_EXP_MAX, NUMBER_EXP_MIN, ROUND_TOLERANCE,
} from "./constants";

const D = fromValueNoAlloc;

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

/**
 * @public
 */
export type DecimalSource = Decimal | number | string;

/**
 * The Decimal's value is simply mantissa * 10^exponent.
 * @public
 */
export class Decimal {

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
    return fromMantissaExponent(mantissa, exponent);
  }

  /**
   * Well, you know what you're doing!
   */
  public static fromMantissaExponent_noNormalize(mantissa: number, exponent: number) {
    return fromRawMantissaExponent(mantissa, exponent);
  }

  public static fromDecimal(value: Decimal) {
    return fromDecimal(value);
  }

  public static fromNumber(value: number) {
    return fromNumber(value);
  }

  public static fromString(value: string) {
    return fromString(value);
  }

  public static fromValue(value: DecimalSource) {
    return fromValue(value);
  }

  public static fromValue_noAlloc(value: DecimalSource) {
    return fromValueNoAlloc(value);
  }

  public static abs(value: DecimalSource) {
    return abs_S(value);
  }

  public static neg(value: DecimalSource) {
    return negate_S(value);
  }

  public static negate(value: DecimalSource) {
    return negate_S(value);
  }

  public static negated(value: DecimalSource) {
    return negate_S(value);
  }

  public static sign(value: DecimalSource) {
    return sign_S(value);
  }

  public static sgn(value: DecimalSource) {
    return sign_S(value);
  }

  public static round(value: DecimalSource) {
    return round_S(value);
  }

  public static floor(value: DecimalSource) {
    return floor_S(value);
  }

  public static ceil(value: DecimalSource) {
    return ceil_S(value);
  }

  public static trunc(value: DecimalSource) {
    return trunc_S(value);
  }

  public static add(value: DecimalSource, other: DecimalSource) {
    return add_SS(value, other);
  }

  public static plus(value: DecimalSource, other: DecimalSource) {
    return add_SS(value, other);
  }

  public static sub(value: DecimalSource, other: DecimalSource) {
    return subtract_SS(value, other);
  }

  public static subtract(value: DecimalSource, other: DecimalSource) {
    return subtract_SS(value, other);
  }

  public static minus(value: DecimalSource, other: DecimalSource) {
    return subtract_SS(value, other);
  }

  public static mul(value: DecimalSource, other: DecimalSource) {
    return multiply_SS(value, other);
  }

  public static multiply(value: DecimalSource, other: DecimalSource) {
    return multiply_SS(value, other);
  }

  public static times(value: DecimalSource, other: DecimalSource) {
    return multiply_SS(value, other);
  }

  public static div(value: DecimalSource, other: DecimalSource) {
    return divide_SS(value, other);
  }

  public static divide(value: DecimalSource, other: DecimalSource) {
    return divide_SS(value, other);
  }

  public static recip(value: DecimalSource) {
    return reciprocate_S(value);
  }

  public static reciprocal(value: DecimalSource) {
    return reciprocate_S(value);
  }

  public static reciprocate(value: DecimalSource) {
    return reciprocate_S(value);
  }

  public static cmp(value: DecimalSource, other: DecimalSource) {
    return compare_SS(value, other);
  }

  public static compare(value: DecimalSource, other: DecimalSource) {
    return compare_SS(value, other);
  }

  public static eq(value: DecimalSource, other: DecimalSource) {
    return equals_SS(value, other);
  }

  public static equals(value: DecimalSource, other: DecimalSource) {
    return equals_SS(value, other);
  }

  public static neq(value: DecimalSource, other: DecimalSource) {
    return notEquals_SS(value, other);
  }

  public static notEquals(value: DecimalSource, other: DecimalSource) {
    return notEquals_SS(value, other);
  }

  public static lt(value: DecimalSource, other: DecimalSource) {
    return lessThan_SS(value, other);
  }

  public static lte(value: DecimalSource, other: DecimalSource) {
    return lessThanOrEquals_SS(value, other);
  }

  public static gt(value: DecimalSource, other: DecimalSource) {
    return greaterThan_SS(value, other);
  }

  public static gte(value: DecimalSource, other: DecimalSource) {
    return greaterThanOrEquals_SS(value, other);
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
      return fromRawMantissaExponent(1, value);
    }
    return fromMantissaExponent(Math.pow(10, value % 1), Math.trunc(value));
  }

  public static pow(value: DecimalSource, other: number | Decimal) {
    // Fast track: 10^integer
    if (typeof value === "number" && value === 10 && typeof other === "number" && Number.isInteger(other)) {
      return fromRawMantissaExponent(1, other);
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
      return fromRawMantissaExponent(0, 0);
    }
    let mantissa = Math.random() * 10;
    // 10% of the time, have a simple mantissa
    if (Math.random() * 10 < 1) {
      mantissa = Math.round(mantissa);
    }
    mantissa *= Math.sign(Math.random() * 2 - 1);
    const exponent = Math.floor(Math.random() * absMaxExponent * 2) - absMaxExponent;
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
    assignFromValue(this, value);
  }

  /**
   * @internal
   */
  public __set__(mantissa: number, exponent: number) {
    this.m = mantissa;
    this.e = exponent;
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

  public toNumber() {
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
    if (!this.isFinite()) {
      return this.mantissa;
    }

    if (this.m === 0) {
      return 0;
    }

    // https://stackoverflow.com/a/37425022
    const len = places + 1;
    const numDigits = Math.ceil(Math.log10(Math.abs(this.m)));
    const rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  }

  public toString() {
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

    if (!this.isFinite()) {
      return this.mantissa.toString();
    }
    if (this.e <= -EXP_LIMIT || this.m === 0) {
      return "0" + trailZeroes(places) + "e+0";
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
    if (!this.isFinite()) {
      return this.mantissa.toString();
    }
    if (this.e <= -EXP_LIMIT || this.m === 0) {
      return "0" + trailZeroes(places);
    }

    // two cases:
    // 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
    // 2) exponent is 16 or less: use basic toFixed

    if (this.e >= MAX_SIGNIFICANT_DIGITS) {
      const mantissa = this.m.toString().replace(".", "");//, this.e + 1, "0");
      const mantissaZeroes = repeatZeroes(this.e - mantissa.length + 1);
      return mantissa + mantissaZeroes + trailZeroes(places);
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
    return abs_D(this);
  }

  public neg() {
    return negate_D(this);
  }

  public negate() {
    return negate_D(this);
  }

  public negated() {
    return negate_D(this);
  }

  public sign() {
    return sign_D(this);
  }

  public sgn() {
    return sign_D(this);
  }

  public round() {
    return round_D(this);
  }

  public floor() {
    return floor_D(this);
  }

  public ceil() {
    return ceil_D(this);
  }

  public trunc() {
    return trunc_D(this);
  }

  public add(value: DecimalSource) {
    return add_DS(this, value);
  }

  public plus(value: DecimalSource) {
    return add_DS(this, value);
  }

  public sub(value: DecimalSource) {
    return subtract_DS(this, value);
  }

  public subtract(value: DecimalSource) {
    return subtract_DS(this, value);
  }

  public minus(value: DecimalSource) {
    return subtract_DS(this, value);
  }

  public mul(value: DecimalSource) {
    return multiply_DS(this, value);
  }

  public multiply(value: DecimalSource) {
    return multiply_DS(this, value);
  }

  public times(value: DecimalSource) {
    return multiply_DS(this, value);
  }

  public div(value: DecimalSource) {
    return divide_DS(this, value);
  }

  public divide(value: DecimalSource) {
    return divide_DS(this, value);
  }

  public divideBy(value: DecimalSource) {
    return divide_DS(this, value);
  }

  public dividedBy(value: DecimalSource) {
    return divide_DS(this, value);
  }

  public recip() {
    return reciprocate_D(this);
  }

  public reciprocal() {
    return reciprocate_D(this);
  }

  public reciprocate() {
    return reciprocate_D(this);
  }

  /**
   * -1 for less than value, 0 for equals value, 1 for greater than value
   */
  public cmp(value: DecimalSource) {
    return compare_DS(this, value);
  }

  public compare(value: DecimalSource) {
    return compare_DS(this, value);
  }

  public eq(value: DecimalSource) {
    return equals_DS(this, value);
  }

  public equals(value: DecimalSource) {
    return equals_DS(this, value);
  }

  public neq(value: DecimalSource) {
    return notEquals_DS(this, value);
  }

  public notEquals(value: DecimalSource) {
    return notEquals_DS(this, value);
  }

  public lt(value: DecimalSource) {
    return lessThan_DS(this, value);
  }

  public lte(value: DecimalSource) {
    return lessThanOrEquals_DS(this, value);
  }

  public gt(value: DecimalSource) {
    return greaterThan_DS(this, value);
  }

  public gte(value: DecimalSource) {
    return greaterThanOrEquals_DS(this, value);
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
    return 3.321928094887362 * this.log10();
  }

  public ln() {
    return 2.302585092994045 * this.log10();
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
        return fromMantissaExponent(newMantissa, temp);
      }
    }

    // Same speed and usually more accurate.

    const newExponent = Math.trunc(temp);
    const residue = temp - newExponent;
    newMantissa = Math.pow(10, numberValue * Math.log10(this.m) + residue);
    if (isFinite(newMantissa) && newMantissa !== 0) {
      return fromMantissaExponent(newMantissa, newExponent);
    }

    // return Decimal.exp(value*this.ln());
    const result = Decimal.pow10(numberValue * this.absLog10()); // this is 2x faster and gives same values AFAIK
    if (this.sign() === -1) {
      if (Math.abs(numberValue % 2) === 1) {
        return result.neg();
      } else if (Math.abs(numberValue % 2) === 0) {
        return result;
      }
      return DECIMAL_NaN;
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
    return fromMantissaExponent(Math.pow(this.m, 2), this.e * 2);
  }

  public sqrt() {
    if (this.m < 0) {
      return DECIMAL_NaN;
    }
    if (this.e % 2 !== 0) {
      return fromMantissaExponent(Math.sqrt(this.m) * 3.16227766016838, Math.floor(this.e / 2));
    }
    // Mod of a negative number is negative, so != means '1 or -1'
    return fromMantissaExponent(Math.sqrt(this.m), Math.floor(this.e / 2));
  }

  public cube() {
    return fromMantissaExponent(Math.pow(this.m, 3), this.e * 3);
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
      return fromMantissaExponent(newMantissa * 2.154434690031883, Math.floor(this.e / 3));
    }
    if (mod !== 0) {
      return fromMantissaExponent(newMantissa * 4.641588833612778, Math.floor(this.e / 3));
    }
    // mod != 0 at this point means 'mod == 2 || mod == -2'
    return fromMantissaExponent(newMantissa, Math.floor(this.e / 3));
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
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return compare_DD(this, decimal) < 1;
  }

  public lessThan(other: DecimalSource) {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return compare_DD(this, decimal) < 0;
  }

  public greaterThanOrEqualTo(other: DecimalSource) {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return compare_DD(this, decimal) > -1;
  }

  public greaterThan(other: DecimalSource) {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return compare_DD(this, decimal) > 0;
  }

  public decimalPlaces() {
    return this.dp();
  }

  public dp() {
    if (!this.isFinite()) {
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

  public isZero() {
    return isZero(this);
  }

  public isFinite() {
    return isFinite(this.mantissa);
  }

  public isNaN() {
    return isNaN(this.mantissa);
  }

  public isPositiveInfinity() {
    return this.mantissa === POSITIVE_INFINITY.mantissa;
  }

  public isNegativeInfinity() {
    return this.mantissa === NEGATIVE_INFINITY.mantissa;
  }

  public static get NUMBER_MAX_VALUE() {
    return NUMBER_MAX_VALUE;
  }

  public static get NUMBER_MIN_VALUE() {
    return NUMBER_MIN_VALUE;
  }

  public static get NaN() {
    return DECIMAL_NaN;
  }

  public static get POSITIVE_INFINITY() {
    return POSITIVE_INFINITY;
  }

  public static get NEGATIVE_INFINITY() {
    return NEGATIVE_INFINITY;
  }

  public static get MAX_VALUE() {
    return MAX_VALUE;
  }

  public static get MIN_VALUE() {
    return MIN_VALUE;
  }

  public static get ZERO() {
    return ZERO;
  }

  public static get ONE() {
    return ONE;
  }

  public static get MINUS_ONE() {
    return MINUS_ONE;
  }
}

// The only reason for this code to exist is the pure dumbness of Jest
// not being able to load ES modules lazily. If you try to use
// fromRawMantissaExponent here you will get shit on with the
// "Decimal is not a constructor" message and you just go hang yourself
// on a ceiling fan because it is such a pain in the ass to debug
// this kind of error.

function ME(mantissa: number, exponent: number) {
  const decimal = new Decimal();
  decimal.__set__(mantissa, exponent);
  return decimal;
}

function FN(value: number) {
  const decimal = new Decimal();
  assignFromNumber(decimal, value);
  return decimal;
}

const MAX_VALUE = ME(1, EXP_LIMIT);
const MIN_VALUE = ME(1, -EXP_LIMIT);
const DECIMAL_NaN = ME(NaN, 0);
const POSITIVE_INFINITY = ME(Number.POSITIVE_INFINITY, 0);
const NEGATIVE_INFINITY = ME(Number.NEGATIVE_INFINITY, 0);
const NUMBER_MAX_VALUE = FN(Number.MAX_VALUE);
const NUMBER_MIN_VALUE = FN(Number.MIN_VALUE);
const ZERO = FN(0);
const ONE = FN(1);
const MINUS_ONE = FN(-1);