import { Decimal } from "../../src/internal";

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEqualDecimal(value: number | Decimal): R;
    }
  }
}