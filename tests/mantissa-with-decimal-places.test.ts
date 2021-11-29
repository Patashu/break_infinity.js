import Decimal, { DecimalSource } from "../src/index";
import "./expect";
import "./expect-types";

describe("mantissaWithDecimalPlaces", () => {
  function t(name: string, value: DecimalSource, places: number, expected: number) {
    test(name, () => {
      const decimal = new Decimal(value);
      expect(decimal.mantissaWithDecimalPlaces(places)).toBe(expected);
    });
  }

  t("0", 0, 2, 0);
  t("short mantissa", 12, 2, 1.2);
  t("long value", 12345, 2, 1.23);
  t("Infinity", Number.POSITIVE_INFINITY, 2, Number.POSITIVE_INFINITY);
  t("-Infinity", Number.NEGATIVE_INFINITY, 2, Number.NEGATIVE_INFINITY);

  test("NaN", () => {
    const decimal = new Decimal(NaN);
    expect(decimal.mantissaWithDecimalPlaces(2)).toBeNaN();
  });
});