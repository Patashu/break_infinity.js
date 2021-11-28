import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isFinite,
  fromMantissaExponent,
  fromString
} from "../internal";

export function multiply_SS(left: DecimalSource, right: DecimalSource) {
  return multiply_DS(fromValueNoAlloc(left), right);
}

export function multiply_DS(left: Decimal, right: DecimalSource) {
  if (!isFinite(left)) {
    return left;
  }

  // This version avoids an extra conversion to Decimal, if possible. Since the
  // mantissa is -10...10, any number short of MAX/10 can be safely multiplied in
  if (typeof right === "number") {
    if (right < 1e307 && right > -1e307) {
      return fromMantissaExponent(left.m * right, left.e);
    }

    // If the value is larger than 1e307, we can divide that out of mantissa (since it's
    // greater than 1, it won't underflow)
    return fromMantissaExponent(left.m * 1e-307 * right, left.e + 307);
  }

  const decimal = typeof right === "string" ? fromString(right) : right;

  if (!isFinite(decimal)) {
    return decimal;
  }

  return multiply_DD(left, decimal);
}

export function multiply_DD(left: Decimal, right: Decimal) {
  return fromMantissaExponent(left.m * right.m, left.e + right.e);
}