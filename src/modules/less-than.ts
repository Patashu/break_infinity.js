import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isNaN,
} from "../internal";

export function lessThan_SS(left: DecimalSource, right: DecimalSource) {
  return lessThan_DS(fromValueNoAlloc(left), right);
}

export function lessThan_DS(left: Decimal, right: DecimalSource) {
  if (isNaN(left)) {
    return false;
  }

  const decimal = fromValueNoAlloc(right);

  if (isNaN(decimal)) {
    return true;
  }

  return lessThan_DD(left, decimal);
}

export function lessThan_DD(left: Decimal, right: Decimal) {
  if (left.m === 0) {
    return right.m > 0;
  }

  if (right.m === 0) {
    return left.m <= 0;
  }

  if (left.e === right.e) {
    return left.m < right.m;
  }

  if (left.m > 0) {
    return right.m > 0 && left.e < right.e;
  }

  return right.m > 0 || left.e > right.e;
}