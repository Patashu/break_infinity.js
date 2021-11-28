import { MAX_SIGNIFICANT_DIGITS } from "../constants";
import { Decimal, DecimalSource, fromNumber, fromValueNoAlloc, isFinite } from "../internal";

export function floor_S(value: DecimalSource) {
  if (typeof value === "number") {
    return fromNumber(Math.floor(value));
  }

  const decimal = fromValueNoAlloc(value);
  return floor_D(decimal);
}

export function floor_D(value: Decimal) {
  if (!isFinite(value)) {
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