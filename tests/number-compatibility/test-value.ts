import { Decimal } from "../../src/internal";

export class TestValue {
  name: string;
  number: number;
  decimal: Decimal;

  constructor(name: string, number: number) {
    this.name = name;
    this.number = number;
    this.decimal = new Decimal(number);
  }
}