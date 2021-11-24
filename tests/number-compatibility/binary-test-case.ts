import Decimal from "../../src";
import { assertEqual } from "./assert";
import { TestValue } from "./test-value";

export class BinaryTestCase {
  left: TestValue;
  right: TestValue;

  constructor(left: TestValue, right: TestValue) {
    this.left = left;
    this.right = right;
  }

  assertEqual(
    numberOperation: (left: number, right: number) => number,
    decimalOperation: (left: Decimal, right: Decimal) => Decimal
  ) {
    const numberResult = numberOperation(this.left.number, this.right.number);
    const decimalResult = decimalOperation(this.left.decimal, this.right.decimal);
    assertEqual(decimalResult, numberResult);
  }

  assertComparison(
    numberOperation: (left: number, right: number) => boolean,
    decimalOperation: (left: Decimal, right: Decimal) => boolean
  ) {
    const numberResult = numberOperation(this.left.number, this.right.number);
    const decimalResult = decimalOperation(this.left.decimal, this.right.decimal);
    expect(decimalResult).toEqual(numberResult);
  }

  toString() {
    return `${this.left.name}; ${this.right.name}`;
  }
}