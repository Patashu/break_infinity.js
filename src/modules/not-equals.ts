import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isNaN,
  equals_DD
} from "../internal";

export function notEquals_SS(left: DecimalSource, right: DecimalSource) {
  return notEquals_DS(fromValueNoAlloc(left), right);
}

export function notEquals_DS(left: Decimal, right: DecimalSource) {
  if (isNaN(left)) {
    return true;
  }

  const decimal = fromValueNoAlloc(right);

  if (isNaN(decimal)) {
    return true;
  }

  return notEquals_DD(left, decimal);
}

function notEquals_DD(left: Decimal, right: Decimal) {
  return !equals_DD(left, right);
}