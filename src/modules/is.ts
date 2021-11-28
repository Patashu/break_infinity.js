import { Decimal } from "../internal";

export function isZero(decimal: Decimal) {
  return decimal.m === 0;
}

export function isFinite(decimal: Decimal) {
  return Number.isFinite(decimal.m);
}

export function isNaN(decimal: Decimal) {
  return Number.isNaN(decimal.m);
}