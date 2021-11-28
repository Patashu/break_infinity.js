import {
  assignFromDecimal,
  assignFromMantissaExponent,
  assignFromNumber,
  assignFromString,
  assignFromValue,
  Decimal,
  DecimalSource
} from "../internal";

export function fromRawMantissaExponent(mantissa: number, exponent: number) {
  const decimal = new Decimal();
  decimal.__set__(mantissa, exponent);
  return decimal;
}

export function fromMantissaExponent(mantissa: number, exponent: number) {
  const decimal = new Decimal();
  assignFromMantissaExponent(decimal, mantissa, exponent);
  return decimal;
}

export function fromDecimal(value: Decimal) {
  const decimal = new Decimal();
  assignFromDecimal(decimal, value);
  return decimal;
}

export function fromNumber(value: number) {
  const decimal = new Decimal();
  assignFromNumber(decimal, value);
  return decimal;
}

export function fromString(value: string) {
  const decimal = new Decimal();
  assignFromString(decimal, value);
  return decimal;
}

export function fromValue(value?: DecimalSource) {
  const decimal = new Decimal();
  assignFromValue(decimal, value);
  return decimal;
}

export function fromValueNoAlloc(value: DecimalSource) {
  return value instanceof Decimal ? value : new Decimal(value);
}