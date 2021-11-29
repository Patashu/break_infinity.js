import { TestValue } from "./test-value";

export class UnaryTestCase {
  value: TestValue;

  constructor(value: TestValue) {
    this.value = value;
  }

  toString() {
    return `${this.value.name}`;
  }
}