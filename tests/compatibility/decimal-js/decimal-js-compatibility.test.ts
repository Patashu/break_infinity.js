import { Decimal as DecimalJS } from "decimal.js";
import Decimal from "../../../src";

test("basic equality", () => {
  const decimal = new Decimal(100);
  const mmDecimal = new DecimalJS(100);
  expect(decimal.toNumber()).toBe(mmDecimal.toNumber());
});