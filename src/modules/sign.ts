import { Decimal, DecimalSource } from "../internal";
import { fromValueNoAlloc } from "./from";

export function sign_S(value: DecimalSource) {
  if (typeof value === "number") {
    return Math.sign(value);
  }

  const decimal = fromValueNoAlloc(value);
  return sign_D(decimal);
}

export function sign_D(value: Decimal) {
  return Math.sign(value.m);
}