import { Decimal } from "./decimal";

export function affordGeometricSeries(
  resourcesAvailable: Decimal, priceStart: Decimal, priceRatio: Decimal, currentOwned: number | Decimal,
): Decimal {
  const actualStart = priceStart.mul(priceRatio.pow(currentOwned));

  return Decimal.floor(
    resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10()
    / priceRatio.log10());
}

export function sumGeometricSeries(
  numItems: number | Decimal, priceStart: Decimal, priceRatio: Decimal, currentOwned: number | Decimal,
): Decimal {
  return priceStart
    .mul(priceRatio.pow(currentOwned))
    .mul(Decimal.sub(1, priceRatio.pow(numItems)))
    .div(Decimal.sub(1, priceRatio));
}

export function affordArithmeticSeries(
  resourcesAvailable: Decimal, priceStart: Decimal, priceAdd: Decimal, currentOwned: Decimal,
): Decimal {
  // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
  // where a is actualStart, d is priceAdd and S is resourcesAvailable
  // then floor it and you're done!

  const actualStart = priceStart.add(currentOwned.mul(priceAdd));
  const b = actualStart.sub(priceAdd.div(2));
  const b2 = b.pow(2);

  return b.neg()
    .add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt())
    .div(priceAdd)
    .floor();
}

export function sumArithmeticSeries(
  numItems: Decimal, priceStart: Decimal, priceAdd: Decimal, currentOwned: Decimal,
): Decimal {

  const actualStart = priceStart.add(currentOwned.mul(priceAdd));

  // (n/2)*(2*a+(n-1)*d)
  return numItems
    .div(2)
    .mul(actualStart.mul(2).plus(numItems.sub(1).mul(priceAdd)));
}

export function efficiencyOfPurchase(cost: Decimal, currentRpS: Decimal, deltaRpS: Decimal): Decimal {
  return cost.div(currentRpS).add(cost.div(deltaRpS));
}

export function cmp(left: Decimal, right: Decimal): number {
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