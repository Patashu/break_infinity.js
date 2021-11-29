export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveMantissaExponent(m: number, e: number): R;
      toBeNaNDecimal(): R;
    }
  }
}