import { TestValue } from "./test-value";

export class BinaryTestCase {
  left: TestValue;
  right: TestValue;

  constructor(left: TestValue, right: TestValue) {
    this.left = left;
    this.right = right;
  }

  toString() {
    return `${this.left.name}; ${this.right.name}`;
  }
}