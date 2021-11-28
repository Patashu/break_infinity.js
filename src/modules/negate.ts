import { Decimal, DecimalSource, fromRawMantissaExponent } from "../internal";

export function negate_S(value: DecimalSource) {
  const decimal = new Decimal(value);
  decimal.m = -decimal.m;
  return decimal;
}

export function negate_D(value: Decimal) {
  return fromRawMantissaExponent(-value.m, value.e);
}