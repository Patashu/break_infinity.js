import Decimal from "../../../src";
import { binaryTestCases, unaryTestCases } from "./test-cases";

type UnaryOperationTestSuite = [
  string,
  (value: number) => number,
  (value: Decimal) => Decimal | number
]

const unaryOperationTestSuites: UnaryOperationTestSuite[] = [
  [".negate()", v => -v, v => v.negate()],
  [".abs()", v => Math.abs(v), v => v.abs()],
  [".ceil()", v => Math.ceil(v), v => v.ceil()],
  [".floor()", v => Math.floor(v), v => v.floor()],
  [".round()", v => Math.round(v), v => v.round()],
  [".sinh()", v => Math.sinh(v), v => v.sinh()],
  [".cosh()", v => Math.cosh(v), v => v.cosh()],
  [".tanh()", v => Math.tanh(v), v => v.tanh()],
  [".exp()", v => Math.exp(v), v => v.exp()],
  [".log10()", v => Math.log10(v), v => v.log10()],
  [".sign()", v => Math.sign(v), v => v.sign()],
  [".trunc()", v => Math.trunc(v), v => v.trunc()],
];

for (const testSuite of unaryOperationTestSuites) {
  describe(testSuite[0], () => {
    test.each(unaryTestCases)(
      "%s",
      (testCase) => testCase.assertEqual(testSuite[1], testSuite[2])
    );
  });
}

type BinaryOperationTestSuite = [
  string,
  (left: number, right: number) => number,
  (left: Decimal, right: Decimal) => Decimal
]

const binaryOperationTestSuites: BinaryOperationTestSuite[] = [
  [".add()", (n1, n2) => n1 + n2, (d1, d2) => d1.add(d2)],
  [".subtract()", (n1, n2) => n1 - n2, (d1, d2) => d1.subtract(d2)],
  [".multiply()", (n1, n2) => n1 * n2, (d1, d2) => d1.multiply(d2)],
  [".divide()", (n1, n2) => n1 / n2, (d1, d2) => d1.divide(d2)],
  [".pow()", Math.pow, (d1, d2) => d1.pow(d2)],
  [".max()", Math.max, (d1, d2) => d1.max(d2)],
  [".min()", Math.min, (d1, d2) => d1.min(d2)]
];

for (const testSuite of binaryOperationTestSuites) {
  describe(testSuite[0], () => {
    test.each(binaryTestCases)(
      "%s",
      (testCase) => testCase.assertEqual(testSuite[1], testSuite[2])
    );
  });
}

type BinaryComparisonTestSuite = [
  string,
  (left: number, right: number) => boolean,
  (left: Decimal, right: Decimal) => boolean
]

const binaryComparisonTestSuites: BinaryComparisonTestSuite[] = [
  [".equals()", (n1, n2) => n1 === n2, (d1, d2) => d1.equals(d2)],
  [".notEquals()", (n1, n2) => n1 !== n2, (d1, d2) => d1.notEquals(d2)],
  [".greaterThan()", (n1, n2) => n1 > n2, (d1, d2) => d1.greaterThan(d2)],
  [".greaterThanOrEqualTo()", (n1, n2) => n1 >= n2, (d1, d2) => d1.greaterThanOrEqualTo(d2)],
  [".lessThan()", (n1, n2) => n1 < n2, (d1, d2) => d1.lessThan(d2)],
  [".lessThanOrEqualTo()", (n1, n2) => n1 <= n2, (d1, d2) => d1.lessThanOrEqualTo(d2)]
];

for (const testSuite of binaryComparisonTestSuites) {
  describe(testSuite[0], () => {
    test.each(binaryTestCases)(
      "%s",
      (testCase) => testCase.assertComparison(testSuite[1], testSuite[2])
    );
  });
}