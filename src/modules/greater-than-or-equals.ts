import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isNaN,
  lessThan_DD
} from "../internal";

export function greaterThanOrEquals_SS(left: DecimalSource, right: DecimalSource) {
  return greaterThanOrEquals_DS(fromValueNoAlloc(left), right);
}

export function greaterThanOrEquals_DS(left: Decimal, right: DecimalSource) {
  if (isNaN(left)) {
    return false;
  }

  const decimal = fromValueNoAlloc(right);

  if (isNaN(decimal)) {
    return true;
  }

  return greaterThanOrEquals_DD(left, decimal);
}

function greaterThanOrEquals_DD(left: Decimal, right: Decimal) {
  return !lessThan_DD(left, right);
}