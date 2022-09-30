export declare type DecimalSource = Decimal | number | string;
/**
 * The Decimal's value is simply mantissa * 10^exponent.
 */
export default class Decimal {
    /**
     * A number (double) with absolute value between [1, 10) OR exactly 0.
     * If mantissa is ever 10 or greater, it should be normalized
     * (divide by 10 and add 1 to exponent until it is less than 10,
     * or multiply by 10 and subtract 1 from exponent until it is 1 or greater).
     * Infinity/-Infinity/NaN will cause bad things to happen.
     */
    mantissa: number;
    /**
     * A number (integer) between -EXP_LIMIT and EXP_LIMIT.
     * Non-integral/out of bounds will cause bad things to happen.
     */
    exponent: number;
    constructor(value?: DecimalSource);
    get m(): number;
    set m(value: number);
    get e(): number;
    set e(value: number);
    get s(): number;
    set s(value: number);
    fromMantissaExponent(mantissa: number, exponent: number): this;
    static fromMantissaExponent(mantissa: number, exponent: number): Decimal;
    /**
     * Well, you know what you're doing!
     */
    fromMantissaExponent_noNormalize(mantissa: number, exponent: number): this;
    static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): Decimal;
    fromDecimal(value: Decimal): this;
    static fromDecimal(value: Decimal): Decimal;
    fromNumber(value: number): this;
    static fromNumber(value: number): Decimal;
    fromString(value: string): this;
    static fromString(value: string): Decimal;
    fromValue(value?: DecimalSource): this;
    static fromValue(value: DecimalSource): Decimal;
    static fromValue_noAlloc(value: DecimalSource): Decimal;
    abs(): Decimal;
    static abs(value: DecimalSource): Decimal;
    neg(): Decimal;
    static neg(value: DecimalSource): Decimal;
    negate(): Decimal;
    static negate(value: DecimalSource): Decimal;
    negated(): Decimal;
    static negated(value: DecimalSource): Decimal;
    sgn(): number;
    static sgn(value: DecimalSource): number;
    sign(): number;
    static sign(value: DecimalSource): number;
    round(): Decimal;
    static round(value: DecimalSource): Decimal;
    floor(): Decimal;
    static floor(value: DecimalSource): Decimal;
    ceil(): Decimal;
    static ceil(value: DecimalSource): Decimal;
    trunc(): Decimal;
    static trunc(value: DecimalSource): Decimal;
    add(value: DecimalSource): Decimal;
    static add(value: DecimalSource, other: DecimalSource): Decimal;
    plus(value: DecimalSource): Decimal;
    static plus(value: DecimalSource, other: DecimalSource): Decimal;
    sub(value: DecimalSource): Decimal;
    static sub(value: DecimalSource, other: DecimalSource): Decimal;
    subtract(value: DecimalSource): Decimal;
    static subtract(value: DecimalSource, other: DecimalSource): Decimal;
    static minus(value: DecimalSource, other: DecimalSource): Decimal;
    minus(value: DecimalSource): Decimal;
    mul(value: DecimalSource): Decimal;
    static mul(value: DecimalSource, other: DecimalSource): Decimal;
    multiply(value: DecimalSource): Decimal;
    static multiply(value: DecimalSource, other: DecimalSource): Decimal;
    times(value: DecimalSource): Decimal;
    static times(value: DecimalSource, other: DecimalSource): Decimal;
    div(value: DecimalSource): Decimal;
    static div(value: DecimalSource, other: DecimalSource): Decimal;
    divide(value: DecimalSource): Decimal;
    static divide(value: DecimalSource, other: DecimalSource): Decimal;
    divideBy(value: DecimalSource): Decimal;
    dividedBy(value: DecimalSource): Decimal;
    recip(): Decimal;
    static recip(value: DecimalSource): Decimal;
    reciprocal(): Decimal;
    static reciprocal(value: DecimalSource): Decimal;
    reciprocate(): Decimal;
    static reciprocate(value: DecimalSource): Decimal;
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */
    cmp(value: DecimalSource): 0 | 1 | -1;
    static cmp(value: DecimalSource, other: DecimalSource): 0 | 1 | -1;
    compare(value: DecimalSource): 0 | 1 | -1;
    static compare(value: DecimalSource, other: DecimalSource): 0 | 1 | -1;
    eq(value: DecimalSource): boolean;
    static eq(value: DecimalSource, other: DecimalSource): boolean;
    equals(value: DecimalSource): boolean;
    static equals(value: DecimalSource, other: DecimalSource): boolean;
    neq(value: DecimalSource): boolean;
    static neq(value: DecimalSource, other: DecimalSource): boolean;
    notEquals(value: DecimalSource): boolean;
    static notEquals(value: DecimalSource, other: DecimalSource): boolean;
    lt(value: DecimalSource): boolean;
    static lt(value: DecimalSource, other: DecimalSource): boolean;
    lessThan(other: DecimalSource): boolean;
    lte(value: DecimalSource): boolean;
    static lte(value: DecimalSource, other: DecimalSource): boolean;
    lessThanOrEqualTo(other: DecimalSource): boolean;
    gt(value: DecimalSource): boolean;
    static gt(value: DecimalSource, other: DecimalSource): boolean;
    greaterThan(other: DecimalSource): boolean;
    gte(value: DecimalSource): boolean;
    static gte(value: DecimalSource, other: DecimalSource): boolean;
    greaterThanOrEqualTo(other: DecimalSource): boolean;
    max(value: DecimalSource): Decimal;
    static max(value: DecimalSource, other: DecimalSource): Decimal;
    min(value: DecimalSource): Decimal;
    static min(value: DecimalSource, other: DecimalSource): Decimal;
    clamp(min: DecimalSource, max: DecimalSource): Decimal;
    static clamp(value: DecimalSource, min: DecimalSource, max: DecimalSource): Decimal;
    clampMin(min: DecimalSource): Decimal;
    static clampMin(value: DecimalSource, min: DecimalSource): Decimal;
    clampMax(max: DecimalSource): Decimal;
    static clampMax(value: DecimalSource, max: DecimalSource): Decimal;
    cmp_tolerance(value: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    compare_tolerance(value: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    /**
     * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
     * For example, if you put in 1e-9, then any number closer to the
     * larger number than (larger number)*1e-9 will be considered equal.
     */
    eq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    equals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    neq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    lt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    lte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    gt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    gte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    log10(): number;
    static log10(value: DecimalSource): number;
    absLog10(): number;
    static absLog10(value: DecimalSource): number;
    pLog10(): number;
    static pLog10(value: DecimalSource): number;
    log(base: number): number;
    static log(value: DecimalSource, base: number): number;
    logarithm(base: number): number;
    static logarithm(value: DecimalSource, base: number): number;
    log2(): number;
    static log2(value: DecimalSource): number;
    ln(): number;
    static ln(value: DecimalSource): number;
    static pow10(value: number): Decimal;
    pow(value: number | Decimal): Decimal;
    static pow(value: DecimalSource, other: number | Decimal): Decimal;
    exp(): Decimal;
    static exp(value: DecimalSource): Decimal;
    sqr(): Decimal;
    static sqr(value: DecimalSource): Decimal;
    sqrt(): Decimal;
    static sqrt(value: DecimalSource): Decimal;
    cube(): Decimal;
    static cube(value: DecimalSource): Decimal;
    cbrt(): Decimal;
    static cbrt(value: DecimalSource): Decimal;
    dp(): number;
    static dp(value: DecimalSource): number;
    decimalPlaces(): number;
    static decimalPlaces(value: DecimalSource): number;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something
     * with exponentially increasing cost each purchase (start at priceStart,
     * multiply by priceRatio, already own currentOwned), how much of it can you buy?
     * Adapted from Trimps source code.
     */
    static affordGeometricSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it multiplies by priceRatio each purchase?
     */
    static sumGeometricSeries(numItems: number | Decimal, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
     * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
     * how much of it can you buy?
     */
    static affordArithmeticSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it adds priceAdd each purchase?
     * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
     */
    static sumArithmeticSeries(numItems: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    /**
     * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
     * the lowest efficiency score is the better one to purchase.
     * From Frozen Cookies:
     * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
     */
    static efficiencyOfPurchase(cost: DecimalSource, currentRpS: DecimalSource, deltaRpS: DecimalSource): Decimal;
    static randomDecimalForTesting(absMaxExponent: number): Decimal;
    /**
     * When mantissa is very denormalized, use this to normalize much faster.
     */
    normalize(): this;
    toNumber(): number;
    mantissaWithDecimalPlaces(places: number): number;
    toString(): string;
    toExponential(places: number): string;
    toFixed(places: number): string;
    toPrecision(places: number): string;
    valueOf(): string;
    toJSON(): string;
    toStringWithDecimalPlaces(places: number): string;
    pow_base(value: DecimalSource): Decimal;
    factorial(): Decimal;
    sinh(): Decimal;
    cosh(): Decimal;
    tanh(): Decimal;
    asinh(): number;
    acosh(): number;
    atanh(): number;
    /**
     * Joke function from Realm Grinder
     */
    ascensionPenalty(ascensions: number): Decimal;
    /**
     * Joke function from Cookie Clicker. It's 'egg'
     */
    egg(): Decimal;
    isFinite(): boolean;
    isNaN(): boolean;
    isPositiveInfinity(): boolean;
    isNegativeInfinity(): boolean;
    static get MAX_VALUE(): Decimal;
    static get MIN_VALUE(): Decimal;
    static get NUMBER_MAX_VALUE(): Decimal;
    static get NUMBER_MIN_VALUE(): Decimal;
    static get NaN(): Decimal;
    static get POSITIVE_INFINITY(): Decimal;
    static get NEGATIVE_INFINITY(): Decimal;
}
