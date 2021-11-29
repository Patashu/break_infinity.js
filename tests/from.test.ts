import Decimal from "./../src/index";
import "./expect";
import "./expect-types";

describe("from-", () => {

  describe("fromMantissaExponent", () => {
    test("normalized", () => {
      const decimal = Decimal.fromMantissaExponent(6, 9);
      expect(decimal).toHaveMantissaExponent(6, 9);
    });

    test("non-normalized", () => {
      const decimal = Decimal.fromMantissaExponent(6000000000, 0);
      expect(decimal).toHaveMantissaExponent(6, 9);
    });

    test("non-finite mantissa", () => {
      const decimal = Decimal.fromMantissaExponent(NaN, 9);
      expect(decimal).toBeNaNDecimal();
    });

    test("non-finite exponent", () => {
      const decimal = Decimal.fromMantissaExponent(6, NaN);
      expect(decimal).toBeNaNDecimal();
    });
  });

  describe("fromMantissaExponent_noNormalize", () => {
    test("normalized", () => {
      const decimal = Decimal.fromMantissaExponent_noNormalize(6, 9);
      expect(decimal).toHaveMantissaExponent(6, 9);
    });

    test("non-normalized", () => {
      const decimal = Decimal.fromMantissaExponent_noNormalize(6000000000, 0);
      expect(decimal).toHaveMantissaExponent(6000000000, 0);
    });

    test("non-finite mantissa", () => {
      const decimal = Decimal.fromMantissaExponent_noNormalize(NaN, 9);
      expect(decimal.m).toBeNaN();
      expect(decimal.e).toBe(9);
    });

    test("non-finite exponent", () => {
      const decimal = Decimal.fromMantissaExponent_noNormalize(6, NaN);
      expect(decimal.m).toBe(6);
      expect(decimal.e).toBeNaN();
    });
  });

  // Exhaustive set of tests covering a wide range of values can be found
  // in decimal.tets. The tests below are just for smoke-testing.

  test("fromDecimal", () => {
    const value = new Decimal(6e9);
    const decimal = Decimal.fromDecimal(value);
    expect(decimal).toHaveMantissaExponent(6, 9);
  });

  test("fromNumber", () => {
    const decimal = Decimal.fromNumber(6e9);
    expect(decimal).toHaveMantissaExponent(6, 9);
  });

  test("fromString", () => {
    const decimal = Decimal.fromString("6e9");
    expect(decimal).toHaveMantissaExponent(6, 9);
  });

  describe("fromValue", () => {
    test("decimal", () => {
      const value = new Decimal(6e9);
      const decimal = Decimal.fromValue(value);
      expect(decimal).toHaveMantissaExponent(6, 9);
    });

    test("number", () => {
      const decimal = Decimal.fromValue(6e9);
      expect(decimal).toHaveMantissaExponent(6, 9);
    });

    test("string", () => {
      const decimal = Decimal.fromValue("6e9");
      expect(decimal).toHaveMantissaExponent(6, 9);
    });
  });

  describe("fromValue_noAlloc", () => {
    test("decimal", () => {
      const value = new Decimal(6e9);
      const decimal = Decimal.fromValue_noAlloc(value);
      expect(decimal).toBe(value);
    });

    test("number", () => {
      const decimal = Decimal.fromValue_noAlloc(6e9);
      expect(decimal).toHaveMantissaExponent(6, 9);
    });

    test("string", () => {
      const decimal = Decimal.fromValue_noAlloc("6e9");
      expect(decimal).toHaveMantissaExponent(6, 9);
    });
  });
});