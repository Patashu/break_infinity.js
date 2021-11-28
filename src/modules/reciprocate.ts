import { Decimal, DecimalSource, fromMantissaExponent } from "../internal";

export function reciprocate_S(value: DecimalSource) {
  const decimal = new Decimal(value);
  decimal.__set__(1 / decimal.m, -decimal.e);
  return decimal;
}

export function reciprocate_D(value: Decimal) {
  return fromMantissaExponent(1 / value.m, -value.e);
}