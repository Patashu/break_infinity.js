import Decimal from "../../src";

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEqualDecimal(value: number | Decimal): R;
    }
  }
}