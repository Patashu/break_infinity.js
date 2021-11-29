import Decimal, { DecimalSource } from "../src/index";
import "./expect";
import "./expect-types";

describe("toString", () => {
  function t(name: string, value: DecimalSource, expected: string) {
    test(name, () => {
      const decimal = new Decimal(value);
      expect(decimal.toString()).toBe(expected);
      expect(decimal.valueOf()).toBe(expected);
      expect(decimal.toJSON()).toBe(expected);
    });
  }

  t("0", 0, "0");
  t("integer value", 116, "116");
  t("negative integer value", -116, "-116");
  t("fractional value", 1.16, "1.16");
  t("negative fractional value", -1.16, "-1.16");
  t("big positive value", "6e900", "6e+900");
  t("big negative value", "-6e900", "-6e+900");
  t("small positive value", "6e-900", "6e-900");
  t("small negative value", "-6e-900", "-6e-900");
  t("Infinity", Number.POSITIVE_INFINITY, "Infinity");
  t("-Infinity", Number.NEGATIVE_INFINITY, "-Infinity");
  t("NaN", Number.NaN, "NaN");
});

describe("toExponential", () => {
  function t(name: string, value: DecimalSource, places: number, expected: string) {
    test(name, () => {
      const decimal = new Decimal(value);
      expect(decimal.toExponential(places)).toBe(expected);
      expect(decimal.toStringWithDecimalPlaces(places)).toBe(expected);
    });
  }

  t("0", 0, 2, "0.00e+0");
  t("integer value", 116, 2, "1.16e+2");
  t("fractional value", 1.16, 2, "1.16e+0");
  t("big positive value", "6e900", 2, "6.00e+900");
  t("big negative value", "-6e900", 2, "-6.00e+900");
  t("small positive value", "6e-900", 2, "6.00e-900");
  t("small negative value", "-6e-900", 2, "-6.00e-900");
  t("Infinity", Number.POSITIVE_INFINITY, 2, "Infinity");
  t("-Infinity", Number.NEGATIVE_INFINITY, 2, "-Infinity");
  t("NaN", Number.NaN, 2, "NaN");
});

describe("toFixed", () => {
  function t(name: string, value: DecimalSource, places: number, expected: string) {
    test(name, () => {
      const decimal = new Decimal(value);
      expect(decimal.toFixed(places)).toBe(expected);
    });
  }

  t("0", 0, 2, "0.00");
  t("integer value", 116, 2, "116.00");
  t("fractional value", 1.16, 2, "1.16");
  t("big positive value", "6e900", 2, "6000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000.00");
  t("big negative value", "-6e900", 2, "-600000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000000000000000000000000000" +
  "00000000000000000000000000000000000000000000000000.00");
  t("small positive value", "6e-900", 2, "0.00");
  t("small negative value", "-6e-900", 2, "0.00");
  t("Infinity", Number.POSITIVE_INFINITY, 2, "Infinity");
  t("-Infinity", Number.NEGATIVE_INFINITY, 2, "-Infinity");
  t("NaN", Number.NaN, 2, "NaN");
});

describe("toPrecision", () => {
  function t(name: string, value: DecimalSource, places: number, expected: string) {
    test(name, () => {
      const decimal = new Decimal(value);
      expect(decimal.toPrecision(places)).toBe(expected);
    });
  }

  t("0", 0, 2, "0.0");
  t("integer value", 116, 2, "1.2e+2");
  t("fractional value", 1.16, 2, "1.2");
  t("big positive value", "6e900", 2, "6.0e+900");
  t("big negative value", "-6e900", 2, "-6.0e+900");
  t("small positive value", "6e-900", 2, "6.0e-900");
  t("small negative value", "-6e-900", 2, "-6.0e-900");
  t("Infinity", Number.POSITIVE_INFINITY, 2, "Infinity");
  t("-Infinity", Number.NEGATIVE_INFINITY, 2, "-Infinity");
  t("NaN", Number.NaN, 2, "NaN");
});