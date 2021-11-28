import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isNaN
} from "../internal";

export function compare_SS(left: DecimalSource, right: DecimalSource) {
  return compare_DS(fromValueNoAlloc(left), right);
}

export function compare_DS(left: Decimal, right: DecimalSource) {
  const decimal = fromValueNoAlloc(right);
  if (isNaN(left)) {
    if (isNaN(decimal)) {
      return 0;
    }

    return -1;
  }

  if (isNaN(decimal)) {
    return 1;
  }

  return compare_DD(left, decimal);
}

export function compare_DD(left: Decimal, right: Decimal) {
  // TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12
  if (left.m === 0) {
    if (right.m === 0) {
      return 0;
    }
    if (right.m < 0) {
      return 1;
    }
    if (right.m > 0) {
      return -1;
    }
  }

  if (right.m === 0) {
    if (left.m < 0) {
      return -1;
    }
    if (left.m > 0) {
      return 1;
    }
  }

  if (left.m > 0) {
    if (right.m < 0) {
      return 1;
    }
    if (left.e > right.e) {
      return 1;
    }
    if (left.e < right.e) {
      return -1;
    }
    if (left.m > right.m) {
      return 1;
    }
    if (left.m < right.m) {
      return -1;
    }
    return 0;
  }

  if (left.m < 0) {
    if (right.m > 0) {
      return -1;
    }
    if (left.e > right.e) {
      return -1;
    }
    if (left.e < right.e) {
      return 1;
    }
    if (left.m > right.m) {
      return 1;
    }
    if (left.m < right.m) {
      return -1;
    }
    return 0;
  }

  throw Error("Unreachable code");
}