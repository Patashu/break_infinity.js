import Decimal from "./../src/index";
import { expectME } from "./expect";
import "./expect-types";

describe("constructor", () => {

  describe("finite number values with string counterparts", () => {
    function t(number: number, string: string, m: number, e: number) {
      test(number.toString(), () => {
        expectME(new Decimal(number), m, e);
      });
      test(`"${string.toString()}"`, () => {
        expectME(new Decimal(string), m, e);
      });
    }

    t(0, "0", 0, 0);
    t(Number.MIN_VALUE, "5e-324", 5, -324);
    t(1e-323, "1e-323", 1, -323);
    t(0.1, "0.1", 1, -1);
    t(1, "1", 1, 0);
    t(1.1, "1.1", 1.1, 0);
    t(10, "10", 1, 1);
    t(1e10, "1e10", 1, 10);
    t(1e308, "1e308", 1, 308);
    t(Number.MAX_VALUE, "1.7976931348623157e308", 1.7976931348623157, 308);

    t(-0, "-0", 0, 0);
    t(-Number.MIN_VALUE, "-5e-324", -5, -324);
    t(-1e-323, "-1e-323", -1, -323);
    t(-0.1, "-0.1", -1, -1);
    t(-1, "-1", -1, 0);
    t(-1.1, "-1.1", -1.1, 0);
    t(-10, "-10", -1, 1);
    t(-1e10, "-1e10", -1, 10);
    t(-1e308, "-1e308", -1, 308);
    t(-Number.MAX_VALUE, "-1.7976931348623157e308", -1.7976931348623157, 308);
  });

  describe("non-finite values", () => {
    function t(number: number, m: number, e: number) {
      test(number.toString(), () => {
        expectME(new Decimal(number), m, e);
      });
    }

    t(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, 0);
    t(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, 0);

    test("NaN", () => {
      const decimal = new Decimal(NaN);
      expect(decimal).toBeNaNDecimal();
    });

    test("\"NaN\"", () => {
      const decimal = new Decimal("NaN");
      expect(decimal).toBeNaNDecimal();
    });
  });

  describe("string values for big numbers", () => {
    function t(string: string, m: number, e: number) {
      test(`"${string.toString()}"`, () => {
        expectME(new Decimal(string), m, e);
      });
    }

    t("1.9e308", 1.9, 308);
    t("1e309", 1, 309);
    t("1e9000000000000000", 1, 9000000000000000);
  });

  test("decimal", () => {
    const value = new Decimal(6e9);
    expectME(new Decimal(value), 6, 9);
  });

  test("empty", () => {
    expectME(new Decimal(), 0, 0);
  });
});