import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isNaN,
  greaterThan_DD
} from "../internal";

export function lessThanOrEquals_SS(left: DecimalSource, right: DecimalSource) {
  return lessThanOrEquals_DS(fromValueNoAlloc(left), right);
}

export function lessThanOrEquals_DS(left: Decimal, right: DecimalSource) {
  if (isNaN(left)) {
    return false;
  }

  const decimal = fromValueNoAlloc(right);

  if (isNaN(decimal)) {
    return true;
  }

  return lessThanOrEquals_DD(left, decimal);
}

function lessThanOrEquals_DD(left: Decimal, right: Decimal) {
  return !greaterThan_DD(left, right);
}