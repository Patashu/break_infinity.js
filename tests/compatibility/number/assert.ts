import Decimal, { DecimalSource } from "../../../src";
import "./expect-to-equal-decimal";

const ROUND_TOLERANCE = 1e-10;

expect.extend({
  toBeEqualDecimal(received: Decimal, expected: DecimalSource) {
    const pass = received.equals_tolerance(expected, ROUND_TOLERANCE);
    let message = "expect(received).toBeEqualDecimal(expected)\n\n";
    message += `Expected: ${expected.toString()}\n`;
    message += `Received: ${received.toString()}`;
    if (pass) {
      return {
        message: () => message,
        pass: true,
      };
    } else {
      return {
        message: () => message,
        pass: false,
      };
    }
  },
});

export function isOutsideNumberRange(decimal: Decimal) {
  if (isNaN(decimal.mantissa) || !isFinite(decimal.mantissa)) {
    return false;
  }

  return (
    decimal.exponent > Math.log10(Number.MAX_VALUE) ||
    decimal.exponent < Math.log10(Number.EPSILON)
  );
}

export function assertEqual(decimalResult: Decimal | number, numberResult : number) {
  let decimal = new Decimal(-1);
  let number = 1;
  if (typeof decimalResult === "number") {
    if (typeof numberResult === "number") {
      if (isFinite(decimalResult) && isFinite(number)) {
        expect(decimalResult).toBeCloseTo(numberResult, 10);
      } else {
        expect(decimalResult).toEqual(numberResult);
      }
      return;
    }
    decimal = numberResult;
    number = decimalResult;
  }
  if (decimalResult instanceof Decimal) {
    decimal = decimalResult;
    number = numberResult;
  }
  if (isOutsideNumberRange(decimal)) {
    return;
  }

  if (isNaN(decimal.mantissa) && isNaN(number)) {
    return;
  }

  expect(decimalResult).toBeEqualDecimal(numberResult);
}