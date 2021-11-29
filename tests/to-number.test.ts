import Decimal, { DecimalSource } from "../src/index";
import "./expect";
import "./expect-types";

describe("toNumber", () => {
  function t(name: string, value: DecimalSource, expected: number) {
    test(name, () => {
      const decimal = new Decimal(value);
      expect(decimal.toNumber()).toBe(expected);
    });
  }

  t("0", 0, 0);
  t("integer value", 116, 116);
  t("negative integer value", -116, -116);
  t("fractional value", 1.16, 1.16);
  t("negative fractional value", -1.16, -1.16);
  t("Number.MIN_VALUE", Number.MIN_VALUE, Number.MIN_VALUE);
  t("-Number.MIN_VALUE", -Number.MIN_VALUE, -Number.MIN_VALUE);
  t("big positive value", "6e900", Number.POSITIVE_INFINITY);
  t("big negative value", "-6e900", Number.NEGATIVE_INFINITY);
  t("small positive value", "6e-900", 0);
  t("small negative value", "-6e-900", 0);
  t("Infinity", Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  t("-Infinity", Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

  test("NaN", () => {
    const decimal = new Decimal(NaN);
    expect(decimal.toNumber()).toBeNaN();
  });
});