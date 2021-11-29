import Decimal from "../../src";

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEqualDecimalSource(value: number | Decimal): R;
    }
  }
}