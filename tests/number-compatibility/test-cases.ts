import { TestValue } from "./test-value";
import { BinaryTestCase } from "./binary-test-case";
import { UnaryTestCase } from "./unary-test-case";

export const fundamentalTestValues = [
  new TestValue("0", 0),
  new TestValue("1", 1),
  new TestValue("-1", -1),
  new TestValue("1.1", 1.1),
  new TestValue("-1.1", -1.1),
  new TestValue("0.9", 0.9),
  new TestValue("-0.9", -0.9),
  new TestValue("∞", Number.POSITIVE_INFINITY),
  new TestValue("-∞", Number.NEGATIVE_INFINITY),
  new TestValue("NaN", Number.NaN)
];

export const generalTestValues = [
  new TestValue("0", 0),
  new TestValue("Integer", 345),
  new TestValue("Negative integer", -745),
  new TestValue("Big integer", 123456789),
  new TestValue("Big negative integer", -987654321),
  new TestValue("Small integer", 4),
  new TestValue("Small negative integer", -5),
  new TestValue("Big value", 3.7e63),
  new TestValue("Big negative value", -7.3e36),
  new TestValue("Really big value", 7.23e222),
  new TestValue("Really big negative value", -2.23e201),
  new TestValue("Small value", 5.323e-47),
  new TestValue("Small negative value", -8.252e-21),
  new TestValue("Really small value", 1.98e-241),
  new TestValue("Really small negative value", -6.79e-215),
];

function createBinaryTestCases(values: TestValue[]) {
  const testCases: BinaryTestCase[] = [];
  for (const left of values) {
    for (const right of values) {
      testCases.push(new BinaryTestCase(left, right));
    }
  }

  return testCases;
}

function createUnaryTestCases(values: TestValue[]) {
  const testCases: UnaryTestCase[] = [];
  for (const value of values) {
    testCases.push(new UnaryTestCase(value));
  }

  return testCases;
}


export const fundamentalUnaryTestCases = createUnaryTestCases(fundamentalTestValues);
export const generalUnaryTestCases = createUnaryTestCases(generalTestValues);
export const unaryTestCases = fundamentalUnaryTestCases.concat(generalUnaryTestCases);


export const fundamentalBinaryTestCases = createBinaryTestCases(fundamentalTestValues);
export const generalBinaryTestCases = createBinaryTestCases(generalTestValues);
export const binaryTestCases = fundamentalBinaryTestCases.concat(generalBinaryTestCases);