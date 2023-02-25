import { Decimal } from "./decimal";

const cache = new Map<number | string, Decimal>();

export function makeConstant(value: number | string) {
  let cached = cache.get(value);
  if (cached === undefined) {
    cached = Object.freeze(new Decimal(value));
    cache.set(value, cached);
  }

  return cached;
}