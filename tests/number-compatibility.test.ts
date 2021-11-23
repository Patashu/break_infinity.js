import Decimal from "../src";

const fundamentalTestValues: [string, number][] = [
  ["0", 0],
  ["1", 1],
  ["-1", -1],
  ["1,1", 1.1],
  ["-1,1", -1.1],
  ["0,9", 0.9],
  ["-0,9", -0.9],
  ["∞", Number.POSITIVE_INFINITY],
  ["-∞", Number.NEGATIVE_INFINITY],
  ["NaN", Number.NaN],
];

const ROUND_TOLERANCE = 1e-10;

function isOutsideNumberRange(decimal: Decimal) {
  if (isNaN(decimal.mantissa) || !isFinite(decimal.mantissa)) {
    return false;
  }

  return (
    decimal.exponent > Math.log10(Number.MAX_VALUE) ||
    decimal.exponent < Math.log10(Number.EPSILON)
  );
}

function assertEqual(decimal: Decimal, number: number) {
  if (isOutsideNumberRange(decimal)) {
    //Assert.Ignore("Result is not in range of possible Double values");
  }

  if (isNaN(decimal.mantissa) && isNaN(number)) {
    return;
  }

  expect(decimal.equals_tolerance(number, ROUND_TOLERANCE)).toBe(true);
}

class BinaryTestCase {
  private numbers: [number, number];
  private decimals: [Decimal, Decimal];

  constructor(first: number, second: number) {
    this.numbers = [first, second];
    this.decimals = [new Decimal(first), new Decimal(second)];
  }

  assertEquals(
    numberOperation: (left: number, right: number) => number,
    decimalOperation: (left: Decimal, right: Decimal) => Decimal
  ) {
    const numberResult = numberOperation(this.numbers[0], this.numbers[1]);
    const decimalResult = decimalOperation(this.decimals[0], this.decimals[1]);
    assertEqual(decimalResult, numberResult);
  }
}

const fundamentalTestCases: BinaryTestCase[] = [];

for (const testCase1 of fundamentalTestValues) {
  for (const testCase2 of fundamentalTestValues) {
    if (testCase1 === testCase2) {
      continue;
    }

    fundamentalTestCases.push(new BinaryTestCase(testCase1[1], testCase2[1]));
  }
}

describe(".add()", () => {
  test("test 1", () => {
    fundamentalTestCases[0].assertEquals((n1, n2) => n1 + n2, (d1, d2) => d1.add(d2));
  });
});

