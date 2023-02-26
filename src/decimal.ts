import { powerOf10 } from "./power-of-10";
import { repeatZeroes, trailZeroes } from "./repeat-zeroes";
import {
  MAX_SIGNIFICANT_DIGITS, EXP_LIMIT,
  NUMBER_EXP_MAX, NUMBER_EXP_MIN, ROUND_TOLERANCE,
} from "./constants";
import {
  affordGeometricSeries, sumGeometricSeries, affordArithmeticSeries,
  sumArithmeticSeries, efficiencyOfPurchase, cmp
} from "./math";
import { getOrAddPooled, tryGetPooled } from "./decimal-pool";

function D(value?: DecimalSource): Decimal {
  if (value instanceof Decimal) {
    return value;
  }
  if (typeof value === "number") {
    return Decimal.fromNumber(value);
  }
  if (typeof value === "string") {
    return Decimal.fromString(value);
  }
  if (value === undefined || value === null) {
    return ZERO;
  }
  if (value.mantissa !== undefined && value.exponent !== undefined) {
    return ME(value.mantissa, value.exponent);
  }

  throw Error("Unsupported Decimal source type.");
}

function ME(mantissa: number, exponent: number): Decimal {
  const result = new Decimal();
  result.setMantissaExponent(mantissa, exponent);
  return result;
}

function ME_NN(mantissa: number, exponent: number): Decimal {
  const result = new Decimal();
  result.setMantissaExponent_noNormalize(mantissa, exponent);
  return result;
}

/**
 * Use this interface to create your own Decimal-compatible classes
 */
export interface MantissaExponent {
  mantissa: number;
  exponent: number;
}

export type DecimalSource = MantissaExponent | number | string;

/**
 * The Decimal's value is simply mantissa * 10^exponent.
 */
export class Decimal {

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
    if (value === undefined || value === null) {
      this.m = 0;
      this.e = 0;
    } else if (typeof value === "number") {
      this.setFromNumber(value);
    } else if (typeof value === "string") {
      this.setFromString(value);
    } else if (value instanceof Decimal) {
      this.copyFrom(value);
    } else if (value.mantissa !== undefined && value.exponent !== undefined) {
      this.copyFrom(value);
    } else {
      throw Error("Unsupported Decimal source type.");
    }
  }

  get m(): number {
    return this.mantissa;
  }

  set m(value: number) {
    this.mantissa = value;
  }

  get e(): number {
    return this.exponent;
  }

  set e(value: number) {
    this.exponent = value;
  }

  get s(): number {
    return this.sign();
  }

  set s(value: number) {
    if (value === 0) {
      this.e = 0;
      this.m = 0;
      return;
    }
    if (this.sgn() !== value) {
      this.m = -this.m;
    }
  }

  //#region fromMantissaExponent

  public setMantissaExponent(mantissa: number, exponent: number): void {
    // SAFETY: don't let in non-numbers
    if (!isFinite(mantissa) || !isFinite(exponent)) {
      this.copyFrom(DECIMAL_NaN);
      return;
    }
    this.m = mantissa;
    this.e = exponent;
    // Non-normalized mantissas can easily get here, so this is mandatory.
    this.normalize();
  }

  public static fromMantissaExponent(mantissa: number, exponent: number): Decimal {
    return ME(mantissa, exponent);
  }

  //#endregion

  //#region fromMantissaExponent_noNormalize

  /**
   * Well, you know what you're doing!
   */
  public setMantissaExponent_noNormalize(mantissa: number, exponent: number): void {
    this.m = mantissa;
    this.e = exponent;
  }

  public static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): Decimal {
    return ME_NN(mantissa, exponent);
  }

  //#endregion

  //#region fromDecimal

  public copyFrom(value: MantissaExponent): void {
    this.m = value.mantissa;
    this.e = value.exponent;
  }

  //#endregion

  //#region clone

  public clone(): Decimal {
    return ME_NN(this.m, this.e);
  }

  //#endregion

  //#region fromNumber

  public setFromNumber_bypassCache(value: number): void {
    if (!isFinite(value)) {
      this.setMantissaExponent_noNormalize(value, 0);
      return;
    }

    if (value === 0) {
      this.m = 0;
      this.e = 0;
      return;
    }

    this.e = Math.floor(Math.log10(Math.abs(value)));
    // SAFETY: handle 5e-324, -5e-324 separately
    this.m = this.e === NUMBER_EXP_MIN ?
      value * 10 / 1e-323 :
      value / powerOf10(this.e);
    this.normalize();
  }

  public setFromNumber(value: number): void {
    const cached = tryGetPooled(value);
    if (cached === undefined) {
      this.setFromNumber_bypassCache(value);
    } else {
      this.copyFrom(cached);
    }
  }

  public static fromNumber_bypassCache(value: number): Decimal {
    const result = new Decimal();
    result.setFromNumber_bypassCache(value);
    return result;
  }

  public static fromNumber(value: number): Decimal {
    const cached = tryGetPooled(value);
    return cached === undefined ? Decimal.fromNumber_bypassCache(value) : cached;
  }

  //#endregion

  //#region fromString

  public setFromString_bypassCache(value: string): void {
    value = value.toLowerCase();
    if (value.indexOf("e") !== -1) {
      const parts = value.split("e");
      this.m = parseFloat(parts[0]);
      if (isNaN(this.m)) {
        this.m = 1;
      }
      this.e = parseFloat(parts[1]);
      this.normalize();
      return;
    }

    if (value === "nan") {
      this.copyFrom(DECIMAL_NaN);
      return;
    }

    this.setFromNumber(parseFloat(value));
    if (this.isNaN()) {
      throw Error("[DecimalError] Invalid argument: " + value);
    }
  }

  public setFromString(value: string): Decimal {
    const cached = tryGetPooled(value);
    if (cached === undefined) {
      this.setFromString_bypassCache(value);
    } else {
      this.copyFrom(cached);
    }
    return this;
  }

  public static fromString_bypassCache(value: string): Decimal {
    const result = new Decimal();
    result.setFromString_bypassCache(value);
    return result;
  }

  public static fromString(value: string): Decimal {
    const cached = tryGetPooled(value);
    return cached === undefined ? Decimal.fromString_bypassCache(value) : cached;
  }

  //#endregion

  //#region fromValue

  public static fromValue_noAlloc(value: DecimalSource): Decimal {
    return D(value);
  }

  //#endregion

  //#region abs

  public abs(): Decimal {
    return ME_NN(Math.abs(this.m), this.e);
  }

  public static abs(value: DecimalSource): Decimal {
    return D(value).abs();
  }

  //#endregion

  //#region neg

  public neg(): Decimal {
    return ME_NN(-this.m, this.e);
  }

  public static neg(value: DecimalSource): Decimal {
    return D(value).neg();
  }

  public negate(): Decimal {
    return this.neg();
  }

  public static negate(value: DecimalSource): Decimal {
    return D(value).neg();
  }

  public negated(): Decimal {
    return this.neg();
  }

  public static negated(value: DecimalSource): Decimal {
    return D(value).neg();
  }

  //#endregion

  //#region sgn

  public sgn(): number {
    return Math.sign(this.m);
  }

  public static sgn(value: DecimalSource): number {
    return D(value).sgn();
  }

  public sign(): number {
    return this.sgn();
  }

  public static sign(value: DecimalSource): number {
    return D(value).sgn();
  }

  //#endregion

  //#region round

  public round(): Decimal {
    if (this.e < -1) {
      return ZERO;
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return Decimal.fromNumber(Math.round(this.toNumber()));
    }
    return this;
  }

  public static round(value: DecimalSource): Decimal {
    return D(value).round();
  }

  //#endregion

  //#region floor

  public floor(): Decimal {
    if (!this.isFinite()) {
      return this;
    }

    if (this.e < -1) {
      return Math.sign(this.m) >= 0 ? ZERO : MINUS_ONE;
    }

    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return Decimal.fromNumber(Math.floor(this.toNumber()));
    }

    return this;
  }

  public static floor(value: DecimalSource): Decimal {
    return D(value).floor();
  }

  //#endregion

  //#region ceil

  public ceil(): Decimal {
    if (this.e < -1) {
      return Math.sign(this.m) > 0 ? ONE : ZERO;
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return Decimal.fromNumber(Math.ceil(this.toNumber()));
    }
    return this;
  }

  public static ceil(value: DecimalSource): Decimal {
    return D(value).ceil();
  }

  //#endregion

  //#region trunc

  public trunc(): Decimal {
    if (this.e < 0) {
      return ZERO;
    }
    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return Decimal.fromNumber(Math.trunc(this.toNumber()));
    }
    return this;
  }

  public static trunc(value: DecimalSource): Decimal {
    return D(value).trunc();
  }

  //#endregion

  //#region add

  public add(value: DecimalSource): Decimal {
    // figure out which is bigger, shrink the mantissa of the smaller
    // by the difference in exponents, add mantissas, normalize and return

    // TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8

    if (!this.isFinite()) {
      return this;
    }

    const decimal = D(value);

    if (!decimal.isFinite()) {
      return decimal;
    }

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
    const mantissa = Math.round(1e14 * biggerDecimal.m +
      1e14 * smallerDecimal.m * powerOf10(smallerDecimal.e - biggerDecimal.e));
    return ME(mantissa, biggerDecimal.e - 14);
  }

  public static add(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).add(other);
  }

  public plus(value: DecimalSource): Decimal {
    return this.add(value);
  }

  public static plus(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).add(other);
  }

  //#endregion

  //#region sub

  public sub(value: DecimalSource): Decimal {
    return this.add(D(value).neg());
  }

  public static sub(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).sub(other);
  }

  public subtract(value: DecimalSource): Decimal {
    return this.sub(value);
  }

  public static subtract(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).sub(other);
  }

  public static minus(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).sub(other);
  }

  public minus(value: DecimalSource): Decimal {
    return this.sub(value);
  }

  //#endregion

  //#region mul

  public mul(value: DecimalSource): Decimal {
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
    const decimal = D(value);
    return ME(this.m * decimal.m, this.e + decimal.e);
  }

  public static mul(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).mul(other);
  }

  public multiply(value: DecimalSource): Decimal {
    return this.mul(value);
  }

  public static multiply(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).mul(other);
  }

  public times(value: DecimalSource): Decimal {
    return this.mul(value);
  }

  public static times(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).mul(other);
  }

  //#endregion

  //#region div

  public div(value: DecimalSource): Decimal {
    return this.mul(D(value).recip());
  }

  public static div(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).div(other);
  }

  public divide(value: DecimalSource): Decimal {
    return this.div(value);
  }

  public static divide(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).div(other);
  }

  public divideBy(value: DecimalSource): Decimal {
    return this.div(value);
  }

  public dividedBy(value: DecimalSource): Decimal {
    return this.div(value);
  }

  //#endregion

  //#region recip

  public recip(): Decimal {
    return ME(1 / this.m, -this.e);
  }

  public static recip(value: DecimalSource): Decimal {
    return D(value).recip();
  }

  public reciprocal(): Decimal {
    return this.recip();
  }

  public static reciprocal(value: DecimalSource): Decimal {
    return D(value).recip();
  }

  public reciprocate(): Decimal {
    return this.recip();
  }

  public static reciprocate(value: DecimalSource): Decimal {
    return D(value).reciprocate();
  }

  //#endregion

  //#region cmp

  /**
   * -1 for less than value, 0 for equals value, 1 for greater than value
   */
  public cmp(value: DecimalSource): number {
    const decimal = D(value);
    if (this.isNaN()) {
      if (decimal.isNaN()) {
        return 0;
      }

      return -1;
    }

    if (decimal.isNaN()) {
      return 1;
    }

    return cmp(this, decimal);
  }

  public static cmp(value: DecimalSource, other: DecimalSource): number {
    return D(value).cmp(other);
  }

  public compare(value: DecimalSource): number {
    return this.cmp(value);
  }

  public static compare(value: DecimalSource, other: DecimalSource): number {
    return D(value).cmp(other);
  }

  //#endregion

  //#region eq

  public eq(value: DecimalSource): boolean {
    const decimal = D(value);
    return this.e === decimal.e && this.m === decimal.m;
  }

  public static eq(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).eq(other);
  }

  public equals(value: DecimalSource): boolean {
    return this.eq(value);
  }

  public static equals(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).eq(other);
  }

  //#endregion

  //#region neq

  public neq(value: DecimalSource): boolean {
    return !this.eq(value);
  }

  public static neq(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).neq(other);
  }

  public notEquals(value: DecimalSource): boolean {
    return this.neq(value);
  }

  public static notEquals(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).notEquals(other);
  }

  //#endregion

  //#region lt

  public lt(value: DecimalSource): boolean {
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

  public static lt(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).lt(other);
  }

  public lessThan(other: DecimalSource): boolean {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return cmp(this, decimal) < 0;
  }

  //#endregion

  //#region lte

  public lte(value: DecimalSource): boolean {
    return !this.gt(value);
  }

  public static lte(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).lte(other);
  }

  public lessThanOrEqualTo(other: DecimalSource): boolean {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return cmp(this, decimal) < 1;
  }

  //#endregion

  //#region gt

  public gt(value: DecimalSource): boolean {
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

  public static gt(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).gt(other);
  }

  public greaterThan(other: DecimalSource): boolean {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return cmp(this, decimal) > 0;
  }

  //#endregion

  //#region gte

  public gte(value: DecimalSource): boolean {
    return !this.lt(value);
  }

  public static gte(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).gte(other);
  }

  public greaterThanOrEqualTo(other: DecimalSource): boolean {
    if (this.isNaN()) {
      return false;
    }

    const decimal = D(other);
    if (decimal.isNaN()) {
      return false;
    }

    return cmp(this, decimal) > -1;
  }

  //#endregion

  //#region max

  public max(value: DecimalSource): Decimal {
    const decimal = D(value);
    return this.lt(decimal) ? decimal : this;
  }

  public static max(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).max(other);
  }

  //#endregion

  //#region min

  public min(value: DecimalSource): Decimal {
    const decimal = D(value);
    return this.gt(decimal) ? decimal : this;
  }

  public static min(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).min(other);
  }

  //#endregion

  //#region clamp

  public clamp(min: DecimalSource, max: DecimalSource): Decimal {
    return this.max(min).min(max);
  }

  public static clamp(value: DecimalSource, min: DecimalSource, max: DecimalSource): Decimal {
    return D(value).clamp(min, max);
  }

  //#endregion

  //#region clampMin

  public clampMin(min: DecimalSource): Decimal {
    return this.max(min);
  }

  public static clampMin(value: DecimalSource, min: DecimalSource): Decimal {
    return D(value).clampMin(min);
  }

  //#endregion

  //#region clampMax

  public clampMax(max: DecimalSource): Decimal {
    return this.min(max);
  }

  public static clampMax(value: DecimalSource, max: DecimalSource): Decimal {
    return D(value).clampMax(max);
  }

  //#endregion

  //#region cmp_tolerance

  public cmp_tolerance(value: DecimalSource, tolerance: DecimalSource): number {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) ? 0 : this.cmp(decimal);
  }

  public static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): number {
    return D(value).cmp_tolerance(other, tolerance);
  }

  public compare_tolerance(value: DecimalSource, tolerance: DecimalSource): number {
    return this.cmp_tolerance(value, tolerance);
  }

  public static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): number {
    return D(value).cmp_tolerance(other, tolerance);
  }

  //#endregion

  //#region eq_tolerance

  /**
   * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
   * For example, if you put in 1e-9, then any number closer to the
   * larger number than (larger number)*1e-9 will be considered equal.
   */
  public eq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    const decimal = D(value);
    // https://stackoverflow.com/a/33024979
    // return abs(a-b) <= tolerance * max(abs(a), abs(b))

    return Decimal.lte(
      this.sub(decimal).abs(),
      Decimal.max(this.abs(), decimal.abs()).mul(tolerance),
    );
  }

  public static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).eq_tolerance(other, tolerance);
  }

  public equals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    return this.eq_tolerance(value, tolerance);
  }

  public static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).eq_tolerance(other, tolerance);
  }

  //#endregion

  //#region neq_tolerance

  public neq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    return !this.eq_tolerance(value, tolerance);
  }

  public static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).neq_tolerance(other, tolerance);
  }

  public notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    return this.neq_tolerance(value, tolerance);
  }

  public static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).notEquals_tolerance(other, tolerance);
  }

  //#endregion

  //#region lt_tolerance

  public lt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    const decimal = D(value);
    return !this.eq_tolerance(decimal, tolerance) && this.lt(decimal);
  }

  public static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).lt_tolerance(other, tolerance);
  }

  //#endregion

  //#region lte_tolerance

  public lte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) || this.lt(decimal);
  }

  public static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).lte_tolerance(other, tolerance);
  }

  //#endregion

  //#region gt_tolerance

  public gt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    const decimal = D(value);
    return !this.eq_tolerance(decimal, tolerance) && this.gt(decimal);
  }

  public static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).gt_tolerance(other, tolerance);
  }

  //#endregion

  //#region gte_tolerance

  public gte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) || this.gt(decimal);
  }

  public static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).gte_tolerance(other, tolerance);
  }

  //#endregion

  //#region log10

  public log10(): number {
    return this.e + Math.log10(this.m);
  }

  public static log10(value: DecimalSource): number {
    return D(value).log10();
  }

  //#endregion

  //#region absLog10

  public absLog10(): number {
    return this.e + Math.log10(Math.abs(this.m));
  }

  public static absLog10(value: DecimalSource): number {
    return D(value).absLog10();
  }

  //#endregion

  //#region pLog10

  public pLog10(): number {
    return this.m <= 0 || this.e < 0 ? 0 : this.log10();
  }

  public static pLog10(value: DecimalSource): number {
    return D(value).pLog10();
  }

  //#endregion

  //#region log

  public log(base: number): number {
    // UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater).
    // We assume this to be true and thus only need to return a number, not a Decimal,
    // and don't do any other kind of error checking.
    return (Math.LN10 / Math.log(base)) * this.log10();
  }

  public static log(value: DecimalSource, base: number): number {
    return D(value).log(base);
  }

  public logarithm(base: number): number {
    return this.log(base);
  }

  public static logarithm(value: DecimalSource, base: number): number {
    return D(value).log(base);
  }

  //#endregion

  //#region log2

  public log2(): number {
    return 3.321928094887362 * this.log10();
  }

  public static log2(value: DecimalSource): number {
    return D(value).log2();
  }

  //#endregion

  //#region ln

  public ln(): number {
    return 2.302585092994045 * this.log10();
  }

  public static ln(value: DecimalSource): number {
    return D(value).ln();
  }

  //#endregion

  //#region pow10

  public static pow10(value: number): Decimal {
    if (Number.isInteger(value)) {
      return ME_NN(1, value);
    }
    return ME(Math.pow(10, value % 1), Math.trunc(value));
  }

  //#endregion

  //#region pow

  public pow(value: number | Decimal): Decimal {
    if (this.m === 0) {
      return this;
    }

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

  public static pow(value: DecimalSource, other: number | Decimal): Decimal {
    // Fast track: 10^integer
    if (typeof value === "number" && value === 10 && typeof other === "number" && Number.isInteger(other)) {
      return ME_NN(1, other);
    }

    return D(value).pow(other);
  }

  //#endregion

  //#region exp

  public exp(): Decimal {
    const x = this.toNumber();
    // Fast track: if -706 < this < 709, we can use regular exp.
    if (-706 < x && x < 709) {
      return Decimal.fromNumber(Math.exp(x));
    }
    return Decimal.pow(Math.E, x);
  }

  public static exp(value: DecimalSource): Decimal {
    return D(value).exp();
  }

  //#endregion

  //#region sqr

  public sqr(): Decimal {
    return ME(Math.pow(this.m, 2), this.e * 2);
  }

  public static sqr(value: DecimalSource): Decimal {
    return D(value).sqr();
  }

  //#endregion

  //#region sqrt

  public sqrt(): Decimal {
    if (this.m < 0) {
      return DECIMAL_NaN;
    }
    if (this.e % 2 !== 0) {
      return ME(Math.sqrt(this.m) * 3.16227766016838, Math.floor(this.e / 2));
    }
    // Mod of a negative number is negative, so != means '1 or -1'
    return ME(Math.sqrt(this.m), Math.floor(this.e / 2));
  }

  public static sqrt(value: DecimalSource): Decimal {
    return D(value).sqrt();
  }

  //#endregion

  //#region cube

  public cube(): Decimal {
    return ME(Math.pow(this.m, 3), this.e * 3);
  }

  public static cube(value: DecimalSource): Decimal {
    return D(value).cube();
  }

  //#endregion

  //#region cbrt

  public cbrt(): Decimal {
    let sign = 1;
    let mantissa = this.m;
    if (mantissa < 0) {
      sign = -1;
      mantissa = -mantissa;
    }
    const newMantissa = sign * Math.pow(mantissa, 1 / 3);

    const mod = this.e % 3;
    if (mod === 1 || mod === -2) {
      return ME(newMantissa * 2.154434690031883, Math.floor(this.e / 3));
    }
    if (mod !== 0) {
      return ME(newMantissa * 4.641588833612778, Math.floor(this.e / 3));
    }
    // mod != 0 at this point means 'mod == 2 || mod == -1'
    return ME(newMantissa, Math.floor(this.e / 3));
  }

  public static cbrt(value: DecimalSource): Decimal {
    return D(value).cbrt();
  }

  //#endregion

  //#region cbrt

  public dp(): number {
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

  public static dp(value: DecimalSource): number {
    return D(value).dp();
  }

  public decimalPlaces(): number {
    return this.dp();
  }

  public static decimalPlaces(value: DecimalSource): number {
    return D(value).dp();
  }

  //#endregion

  /**
   * If you're willing to spend 'resourcesAvailable' and want to buy something
   * with exponentially increasing cost each purchase (start at priceStart,
   * multiply by priceRatio, already own currentOwned), how much of it can you buy?
   * Adapted from Trimps source code.
   */
  public static affordGeometricSeries(
    resourcesAvailable: DecimalSource, priceStart: DecimalSource,
    priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal {

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
    priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal {

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
    priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal {

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
    priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal {

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
  public static efficiencyOfPurchase(cost: DecimalSource, currentRpS: DecimalSource, deltaRpS: DecimalSource): Decimal {
    return efficiencyOfPurchase(
      D(cost),
      D(currentRpS),
      D(deltaRpS),
    );
  }

  public static randomDecimalForTesting(absMaxExponent: number): Decimal {
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
   * When mantissa is very denormalized, use this to normalize much faster.
   */
  public normalize(): Decimal {
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

  public toNumber(): number {
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

  public mantissaWithDecimalPlaces(places: number): number {
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

  public toString(): string {
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

  public toExponential(places: number): string {
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

  public toFixed(places: number): string {
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

  public toPrecision(places: number): string {
    if (this.e <= -7) {
      return this.toExponential(places - 1);
    }
    if (places > this.e) {
      return this.toFixed(places - this.e - 1);
    }
    return this.toExponential(places - 1);
  }

  public valueOf(): string {
    return this.toString();
  }

  public toJSON(): string {
    return this.toString();
  }

  public toStringWithDecimalPlaces(places: number): string {
    return this.toExponential(places);
  }

  public pow_base(value: DecimalSource): Decimal {
    return D(value).pow(this);
  }

  public factorial(): Decimal {
    // Using Stirling's Approximation.
    // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators

    const n = this.toNumber() + 1;

    return Decimal.pow(
      (n / Math.E) * Math.sqrt(n * Math.sinh(1 / n) + 1 /
        (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
  }

  // Some hyperbolic trig functions that happen to be easy
  public sinh(): Decimal {
    return this.exp().sub(this.negate().exp()).div(2);
  }

  public cosh(): Decimal {
    return this.exp().add(this.negate().exp()).div(2);
  }

  public tanh(): Decimal {
    return this.sinh().div(this.cosh());
  }

  public asinh(): number {
    return Decimal.ln(this.add(this.sqr().add(ONE).sqrt()));
  }

  public acosh(): number {
    return Decimal.ln(this.add(this.sqr().sub(ONE).sqrt()));
  }

  public atanh(): number {
    if (this.abs().gte(1)) {
      return Number.NaN;
    }
    return Decimal.ln(this.add(ONE).div(ONE.sub(this))) / 2;
  }

  /**
   * Joke function from Realm Grinder
   */
  public ascensionPenalty(ascensions: number): Decimal {
    if (ascensions === 0) {
      return this;
    }
    return this.pow(Math.pow(10, -ascensions));
  }

  /**
   * Joke function from Cookie Clicker. It's 'egg'
   */
  public egg(): Decimal {
    return this.add(9);
  }

  public isFinite(): boolean {
    return isFinite(this.mantissa);
  }

  public isNaN(): boolean {
    // NaN is the only value to be not equal to self.
    return this.mantissa !== this.mantissa;
  }

  public isPositiveInfinity(): boolean {
    return this.mantissa === POSITIVE_INFINITY.mantissa;
  }

  public isNegativeInfinity(): boolean {
    return this.mantissa === NEGATIVE_INFINITY.mantissa;
  }

  public static const(value: number | string): Decimal {
    return getOrAddPooled(value);
  }

  public static constant(value: number | string): Decimal {
    return getOrAddPooled(value);
  }

  public static get ZERO(): Decimal {
    return ZERO;
  }

  public static get ONE(): Decimal {
    return ONE;
  }

  public static get MINUS_ONE(): Decimal {
    return MINUS_ONE;
  }

  public static get MAX_VALUE(): Decimal {
    return MAX_VALUE;
  }

  public static get MIN_VALUE(): Decimal {
    return MIN_VALUE;
  }

  public static get NUMBER_MAX_VALUE(): Decimal {
    return NUMBER_MAX_VALUE;
  }

  public static get NUMBER_MIN_VALUE(): Decimal {
    return NUMBER_MIN_VALUE;
  }

  public static get NaN(): Decimal {
    return DECIMAL_NaN;
  }

  public static get POSITIVE_INFINITY(): Decimal {
    return POSITIVE_INFINITY;
  }

  public static get NEGATIVE_INFINITY(): Decimal {
    return NEGATIVE_INFINITY;
  }
}

const MAX_VALUE = ME_NN(1, EXP_LIMIT);
const MIN_VALUE = ME_NN(1, -EXP_LIMIT);
const ZERO = getOrAddPooled(0);
const ONE = getOrAddPooled(1);
const MINUS_ONE = getOrAddPooled(-1);
const NUMBER_MAX_VALUE = getOrAddPooled(Number.MAX_VALUE);
const NUMBER_MIN_VALUE = getOrAddPooled(Number.MIN_VALUE);
const DECIMAL_NaN = ME_NN(Number.NaN, 0);
const POSITIVE_INFINITY = ME_NN(Number.POSITIVE_INFINITY, 0);
const NEGATIVE_INFINITY = ME_NN(Number.NEGATIVE_INFINITY, 0);
