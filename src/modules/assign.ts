import { NUMBER_EXP_MIN } from "../constants";
import { Decimal, DecimalSource } from "../internal";
import { powerOf10 } from "../power-of-10";

export function assignFromMantissaExponent(target: Decimal, mantissa: number, exponent: number) {
  // SAFETY: don't let in non-numbers
  if (!isFinite(mantissa) || !isFinite(exponent)) {
    assignFromDecimal(target, Decimal.NaN);
    return;
  }

  target.__set__(mantissa, exponent);
  target.normalize();
}

export function assignFromDecimal(target: Decimal, source: Decimal) {
  target.__set__(source.m, source.e);
}

export function assignFromNumber(target: Decimal, source: number) {
  if (!isFinite(source)) {
    target.__set__(source, 0);
    return;
  }

  if (source === 0) {
    target.__set__(0, 0);
    return;
  }

  const e = Math.floor(Math.log10(Math.abs(source)));
  // SAFETY: handle 5e-324, -5e-324 separately
  const m = e === NUMBER_EXP_MIN ?
    source * 10 / 1e-323 :
    source / powerOf10(e);

  assignFromMantissaExponent(target, m, e);
}

export function assignFromString(target: Decimal, source: string) {
  if (source.indexOf("e") !== -1) {
    const parts = source.split("e");
    const m = parseFloat(parts[0]);
    const e = parseFloat(parts[1]);
    assignFromMantissaExponent(target, m, e);
    return;
  }

  if (source === "NaN") {
    assignFromDecimal(target, Decimal.NaN);
    return;
  }

  const number = parseFloat(source);
  if (isNaN(number)) {
    throw Error("[DecimalError] Invalid argument: " + source);
  }

  assignFromNumber(target, number);
}

export function assignFromValue(target: Decimal, value?: DecimalSource) {
  if (value === undefined) {
    target.__set__(0, 0);
  } else if (value instanceof Decimal) {
    assignFromDecimal(target, value);
  } else if (typeof value === "number") {
    assignFromNumber(target, value);
  } else if (typeof value === "string") {
    assignFromString(target, value);
  }
}