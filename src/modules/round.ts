import { MAX_SIGNIFICANT_DIGITS } from "../constants";
import { Decimal, DecimalSource, fromNumber, fromValueNoAlloc, isFinite } from "../internal";

export function round_S(value: DecimalSource) {
  if (typeof value === "number") {
    return fromNumber(Math.round(value));
  }

  const decimal = fromValueNoAlloc(value);
  return round_D(decimal);
}

export function round_D(value: Decimal) {
  if (!isFinite(value)) {
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