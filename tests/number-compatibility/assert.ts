import Decimal from "../../src";

const ROUND_TOLERANCE = 1e-10;

export function isOutsideNumberRange(decimal: Decimal) {
  if (isNaN(decimal.mantissa) || !isFinite(decimal.mantissa)) {
    return false;
  }

  return (
    decimal.exponent > Math.log10(Number.MAX_VALUE) ||
    decimal.exponent < Math.log10(Number.EPSILON)
  );
}

export function assertEqual(decimalResult: Decimal | number, numberResult : Decimal | number) {
  let decimal = new Decimal(-1);
  let number = 1;
  if (typeof decimalResult === "number") {
    if (typeof numberResult === "number") {
      expect(decimalResult).toEqual(numberResult);
      return;
    }
    decimal = numberResult;
    number = decimalResult;
  }
  if (decimalResult instanceof Decimal) {
    if (numberResult instanceof Decimal) {
      expect(decimalResult.equals_tolerance(numberResult, ROUND_TOLERANCE)).toBe(true);
      return;
    }
    decimal = decimalResult;
    number = numberResult;
  }
  if (isOutsideNumberRange(decimal)) {
    return;
  }

  if (isNaN(decimal.mantissa) && isNaN(number)) {
    return;
  }

  expect(decimal.equals_tolerance(number, ROUND_TOLERANCE)).toBe(true);
}