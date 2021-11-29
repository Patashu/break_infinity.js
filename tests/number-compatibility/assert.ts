import Decimal, { DecimalSource } from "../../src";
import "./expect-types";

const ROUND_TOLERANCE = 1e-10;

expect.extend({
  toBeEqualDecimalSource(received: Decimal, expected: DecimalSource) {
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

export function assertEqual(decimalResult: Decimal | number, numberResult : number) {
  if (typeof decimalResult === "number") {
    if (isFinite(decimalResult) && isFinite(numberResult)) {
      expect(decimalResult).toBeCloseTo(numberResult, 10);
    } else {
      expect(decimalResult).toBe(numberResult);
    }
    return;
  }

  if (!decimalResult.isFinite()) {
    expect(decimalResult.mantissa).toBe(numberResult);
    return;
  }

  if (!isFinite(decimalResult.toNumber())) {
    return;
  }

  expect(decimalResult).toBeEqualDecimalSource(numberResult);
}