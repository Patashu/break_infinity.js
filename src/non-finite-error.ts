export class NonFiniteError extends Error {
  constructor(reason: string) {
    const message = reason
      + " Non-finite values are not supported by break_infinity.js."
      + " Either change your code so it doesn't produce them, or use decimal.js instead of break_infinity.js.";
    super(message);
    this.name = "NonFiniteError";
  }

  static result(value: string): NonFiniteError {
    return new NonFiniteError(`Function result is not finite (${value}).`);
  }
}

export function assertFiniteInputNumber(value: number): void {
  if (!isFinite(value)) {
    throw new NonFiniteError(`Input parameter is not finite (${value}).`);
  }
}

export function assertFiniteInputMantissa(value: number): void {
  if (!isFinite(value)) {
    throw new NonFiniteError(`Input parameter mantissa is not finite (${value}).`);
  }
}

export function assertFiniteInputExponent(value: number): void {
  if (!isFinite(value)) {
    throw new NonFiniteError(`Input parameter exponent is not finite (${value}).`);
  }
}
