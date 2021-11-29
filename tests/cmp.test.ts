import Decimal, { DecimalSource } from "../src/index";
import "./expect";
import "./expect-types";

describe("cmp", () => {
  function t(left: DecimalSource, right: DecimalSource, expected: number) {
    test(`Decimal.cmp(${left.toString()}, ${right.toString()})`, () => {
      expect(new Decimal(left).compare(right)).toBe(expected);
      expect(new Decimal(left).cmp(right)).toBe(expected);
      expect(Decimal.compare(left, right)).toBe(expected);
      expect(Decimal.cmp(left, right)).toBe(expected);
    });
  }

  t(0, 0, 0);
  t(0, 116, -1);
  t(116, 0, 1);
  t(116, 116, 0);
  t(-116, -116, 0);
  t(116, -10, 1);
  t(-10, 116, -1);
  t(-100, -10, -1);
  t(-10, -100, 1);
  t(5, 74900, -1);
  t(74900, 5, 1);
  t(7, 1e280, -1);
  t(1e280, 7, 1);
  t(1e300, "1e10500", -1);
  t("1e10500", 1e300, 1);
  t(Number.POSITIVE_INFINITY, 1, 1);
  t(1, Number.POSITIVE_INFINITY, -1);
  t(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, 0);
  t(Number.NEGATIVE_INFINITY, 1, -1);
  t(1, Number.NEGATIVE_INFINITY, 1);
  t(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, 0);
  t(1, Number.NaN, 1);
  t(Number.NaN, 1, -1);
  t(Number.NaN, Number.NaN, 0);
});