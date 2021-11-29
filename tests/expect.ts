import Decimal from "../src";
import "./expect-types";

expect.extend({
  toHaveMantissaExponent(received: Decimal, m: number, e: number) {
    const pass = received.m === m && received.e === e;
    let message = "expect(received).toHaveMantissaExponent(m, e)\n\n";
    message += `Expected: { m: ${m.toString()}, e: ${e.toString()} }\n`;
    message += `Received: { m: ${received.m.toString()}, e: ${received.e.toString()} }`;
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
  toBeNaNDecimal(received: Decimal) {
    const pass = isNaN(received.m) && received.e === 0;
    let message = "expect(received).toBeNaNDecimal()\n\n";
    message += `Expected: { m: NaN, e: 0 }\n`;
    message += `Received: { m: ${received.m.toString()}, e: ${received.e.toString()} }`;
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
  }
});

export function expectME(decimal: Decimal, m: number, e: number) {
  expect(decimal).toHaveMantissaExponent(m, e);
}