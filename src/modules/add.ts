import { MAX_SIGNIFICANT_DIGITS } from "../constants";
import { powerOf10 } from "../power-of-10";
import {
  Decimal,
  DecimalSource,
  isZero,
  fromMantissaExponent,
  fromValueNoAlloc,
  isFinite
} from "../internal";

export function add_SS(left: DecimalSource, right: DecimalSource) {
  return add_DS(fromValueNoAlloc(left), right);
}

export function add_DS(left: Decimal, right: DecimalSource) {
  if (!isFinite(left)) {
    return left;
  }

  const decimal = fromValueNoAlloc(right);

  if (!isFinite(decimal)) {
    return decimal;
  }

  return add_DD(left, decimal);
}

export function add_DD(left: Decimal, right: Decimal) {
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

  let bigger;
  let smaller;
  if (left.e >= right.e) {
    bigger = left;
    smaller = right;
  } else {
    bigger = right;
    smaller = left;
  }

  if (bigger.e - smaller.e > MAX_SIGNIFICANT_DIGITS) {
    return bigger;
  }

  // Have to do this because adding numbers that were once integers but scaled down is imprecise.
  // Example: 299 + 18
  const mantissa = Math.round(1e14 * bigger.m +
    1e14 * smaller.m * powerOf10(smaller.e - bigger.e));
  return fromMantissaExponent(mantissa, bigger.e - 14);
}