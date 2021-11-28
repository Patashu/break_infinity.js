import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isNaN
} from "../internal";

export function equals_SS(left: DecimalSource, right: DecimalSource) {
  return equals_DS(fromValueNoAlloc(left), right);
}

export function equals_DS(left: Decimal, right: DecimalSource) {
  if (isNaN(left)) {
    return false;
  }

  const decimal = fromValueNoAlloc(right);

  if (isNaN(decimal)) {
    return false;
  }

  return equals_DD(left, decimal);
}

export function equals_DD(left: Decimal, right: Decimal) {
  return left.e === right.e && left.m === right.m;
}