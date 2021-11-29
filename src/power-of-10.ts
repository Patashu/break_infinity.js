import { NUMBER_EXP_MIN, NUMBER_EXP_MAX } from "./constants";

// We need this lookup table because Math.pow(10, exponent)
// when exponent's absolute value is large is slightly inaccurate.
// You can fix it with the power of math... or just make a lookup table.
// Faster AND simpler
const powersOf10: number[] = [];
for (let i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
  powersOf10.push(Number("1e" + i));
}
const indexOf0InPowersOf10 = 323;

export function powerOf10(power: number) {
  return powersOf10[power + indexOf0InPowersOf10];
}