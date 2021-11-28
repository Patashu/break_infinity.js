import { MAX_SIGNIFICANT_DIGITS } from "../constants";
import { Decimal, DecimalSource, fromNumber, fromValueNoAlloc, isFinite } from "../internal";

export function trunc_S(value: DecimalSource) {
  if (typeof value === "number") {
    return fromNumber(Math.trunc(value));
  }

  const decimal = fromValueNoAlloc(value);
  return trunc_D(decimal);
}

export function trunc_D(value: Decimal) {
  if (!isFinite(value)) {
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