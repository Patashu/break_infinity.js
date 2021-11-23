import Decimal from "../../src";
import { assertEqual } from "./assert";
import { TestValue } from "./test-value";

export class UnaryTestCase {
  value: TestValue;

  constructor(value: TestValue) {
    this.value = value;
  }

  assertEqual(
    numberOperation: (value: number) => Decimal | number,
    decimalOperation: (value: Decimal) => Decimal | number
  ) {
    const numberResult = numberOperation(this.value.number);
    const decimalResult = decimalOperation(this.value.decimal);
    assertEqual(decimalResult, numberResult);
  }

  toString() {
    return `${this.value.name}`;
  }
}