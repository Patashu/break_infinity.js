import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isFinite,
  add_DD,
  negate_D
} from "../internal";

export function subtract_SS(left: DecimalSource, right: DecimalSource) {
  return subtract_DS(fromValueNoAlloc(left), right);
}

export function subtract_DS(left: Decimal, right: DecimalSource) {
  if (!isFinite(left)) {
    return left;
  }

  const decimal = fromValueNoAlloc(right);

  if (!isFinite(decimal)) {
    return decimal;
  }

  return subtract_DD(left, decimal);
}

function subtract_DD(left: Decimal, right: Decimal) {
  return add_DD(left, negate_D(right));
}