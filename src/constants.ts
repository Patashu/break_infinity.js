// For example: if two exponents are more than 17 apart,
// consider adding them together pointless, just return the larger one
export const MAX_SIGNIFICANT_DIGITS = 17;

// Highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS
export const EXP_LIMIT = 9e15;

// The largest exponent that can appear in a Number, though not all mantissas are valid here.
export const NUMBER_EXP_MAX = 308;

// The smallest exponent that can appear in a Number, though not all mantissas are valid here.
export const NUMBER_EXP_MIN = -324;

// Tolerance which is used for Number conversion to compensate floating-point error.
export const ROUND_TOLERANCE = 1e-10;