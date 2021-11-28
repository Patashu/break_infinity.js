import { MAX_SIGNIFICANT_DIGITS } from "../constants";
import { Decimal, DecimalSource, fromNumber, fromValueNoAlloc, isFinite } from "../internal";

export function ceil_S(value: DecimalSource) {
  if (typeof value === "number") {
    return fromNumber(Math.ceil(value));
  }

  const decimal = fromValueNoAlloc(value);
  return ceil_D(decimal);
}

export function ceil_D(value: Decimal) {
  if (!isFinite(value)) {
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