import Decimal from "../src/index";

test("1 is 1", () => {
  expect(new Decimal(1).toNumber()).toBe(1);
});