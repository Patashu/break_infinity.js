import {
  Decimal,
  DecimalSource,
  fromValueNoAlloc,
  isFinite,
  multiply_DD,
  reciprocate_D
} from "../internal";

export function divide_SS(left: DecimalSource, right: DecimalSource) {
  return divide_DS(fromValueNoAlloc(left), right);
}

export function divide_DS(left: Decimal, right: DecimalSource) {
  if (!isFinite(left)) {
    return left;
  }

  const decimal = fromValueNoAlloc(right);

  if (!isFinite(decimal)) {
    return decimal;
  }

  return divide_DD(left, decimal);
}

function divide_DD(left: Decimal, right: Decimal) {
  return multiply_DD(left, reciprocate_D(right));
}