import { Decimal, DecimalSource, fromRawMantissaExponent } from "../internal";

export function abs_S(value: DecimalSource) {
  const decimal = new Decimal(value);
  decimal.m = Math.abs(decimal.m);
  return decimal;
}

export function abs_D(value: Decimal) {
  return fromRawMantissaExponent(Math.abs(value.m), value.e);
}