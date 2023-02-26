import { Decimal } from "./decimal";

const pool = new Map<number | string, Decimal>();

export function tryGetPooled(value: number | string): Decimal | undefined {
  return pool.get(value);
}

export function getOrAddPooled(value: number | string): Decimal {
  let pooled = pool.get(value);
  if (pooled === undefined) {
    pooled = Object.freeze(new Decimal(value));
    pool.set(value, pooled);
  }

  return pooled;
}