;(function (globalScope) {
	'use strict';
	
	/*
	
	# break_infinity.js
	A replacement for decimal.js for incremental games who want to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e(9e15) ) and want to prioritize speed over accuracy.
	If you want to prioritize accuracy over speed, please use decimal.js instead.
	
	https://github.com/Patashu/break_infinity.js
	
	This library is open source and free to use/modify/fork for any purpose you want.
	
	By Patashu.
	
	---
	
	Decimal has only two fields:
	
	mantissa: A number (double) with absolute value between [1, 10) OR exactly 0. If mantissa is ever 10 or greater, it should be normalized (divide by 10 and add 1 to exponent until it is less than 10, or multiply by 10 and subtract 1 from exponent until it is 1 or greater). Infinity/-Infinity/NaN will cause bad things to happen.
	exponent: A number (integer) between -EXP_LIMIT and EXP_LIMIT. Non-integral/out of bounds will cause bad things to happen.
	
	The decimal's value is simply mantissa*10^exponent.
	
	Functions of Decimal:
	
	fromMantissaExponent(mantissa, exponent)
	fromDecimal(value)
	fromNumber(value)
	fromString(value)
	fromValue(value)
	
	toNumber()
	mantissaWithDecimalPlaces(places)
	toString()
	toStringWithDecimalPlaces(places)
	
	abs(), neg(), sign()
	add(value), sub(value), mul(value), div(value), recip()
	
	cmp(value), eq(value), neq(value), lt(value), lte(value), gt(value), gte(value)
	cmp_tolerance(value, tolerance), eq_tolerance(value, tolerance), neq_tolerance(value, tolerance), lt_tolerance(value, tolerance), lte_tolerance(value, tolerance), gt_tolerance(value, tolerance), gte_tolerance(value, tolerance)
	
	log(base), log10(), log2(), ln()
	pow(value, other), pow(value), pow_base(value), exp(), sqr(), sqrt(), cube(), cbrt()
	
	---
	
	Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.
	
	Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal
	
	p.s. No, this library will never handle numbers bigger in mthan 1e(9e15) because it would incur a performance loss for non-ridiculouse use-cases. I would (or you would?) write a separate break_eternity.js for that.
	
	*/
	
	var MAX_SIGNIFICANT_DIGITS = 17; //for example: if two exponents are more than 17 apart, consider adding them together pointless, just return the larger one
	var EXP_LIMIT = 9e15; //highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS
	var LN10;
	
	//we need this lookup table because Math.pow(10, exponent) when exponent's absolute value is large is slightly inaccurate. you can fix it with the power of math... or just make a lookup table. faster AND simpler
	var powersof10 = [1e-308, 1e-307, 1e-306, 1e-305, 1e-304, 1e-303, 1e-302, 1e-301, 1e-300, 1e-299, 1e-298, 1e-297, 1e-296, 1e-295, 1e-294, 1e-293, 1e-292, 1e-291, 1e-290, 1e-289, 1e-288, 1e-287, 1e-286, 1e-285, 1e-284, 1e-283, 1e-282, 1e-281, 1e-280, 1e-279, 1e-278, 1e-277, 1e-276, 1e-275, 1e-274, 1e-273, 1e-272, 1e-271, 1e-270, 1e-269, 1e-268, 1e-267, 1e-266, 1e-265, 1e-264, 1e-263, 1e-262, 1e-261, 1e-260, 1e-259, 1e-258, 1e-257, 1e-256, 1e-255, 1e-254, 1e-253, 1e-252, 1e-251, 1e-250, 1e-249, 1e-248, 1e-247, 1e-246, 1e-245, 1e-244, 1e-243, 1e-242, 1e-241, 1e-240, 1e-239, 1e-238, 1e-237, 1e-236, 1e-235, 1e-234, 1e-233, 1e-232, 1e-231, 1e-230, 1e-229, 1e-228, 1e-227, 1e-226, 1e-225, 1e-224, 1e-223, 1e-222, 1e-221, 1e-220, 1e-219, 1e-218, 1e-217, 1e-216, 1e-215, 1e-214, 1e-213, 1e-212, 1e-211, 1e-210, 1e-209, 1e-208, 1e-207, 1e-206, 1e-205, 1e-204, 1e-203, 1e-202, 1e-201, 1e-200, 1e-199, 1e-198, 1e-197, 1e-196, 1e-195, 1e-194, 1e-193, 1e-192, 1e-191, 1e-190, 1e-189, 1e-188, 1e-187, 1e-186, 1e-185, 1e-184, 1e-183, 1e-182, 1e-181, 1e-180, 1e-179, 1e-178, 1e-177, 1e-176, 1e-175, 1e-174, 1e-173, 1e-172, 1e-171, 1e-170, 1e-169, 1e-168, 1e-167, 1e-166, 1e-165, 1e-164, 1e-163, 1e-162, 1e-161, 1e-160, 1e-159, 1e-158, 1e-157, 1e-156, 1e-155, 1e-154, 1e-153, 1e-152, 1e-151, 1e-150, 1e-149, 1e-148, 1e-147, 1e-146, 1e-145, 1e-144, 1e-143, 1e-142, 1e-141, 1e-140, 1e-139, 1e-138, 1e-137, 1e-136, 1e-135, 1e-134, 1e-133, 1e-132, 1e-131, 1e-130, 1e-129, 1e-128, 1e-127, 1e-126, 1e-125, 1e-124, 1e-123, 1e-122, 1e-121, 1e-120, 1e-119, 1e-118, 1e-117, 1e-116, 1e-115, 1e-114, 1e-113, 1e-112, 1e-111, 1e-110, 1e-109, 1e-108, 1e-107, 1e-106, 1e-105, 1e-104, 1e-103, 1e-102, 1e-101, 1e-100, 1e-99, 1e-98, 1e-97, 1e-96, 1e-95, 1e-94, 1e-93, 1e-92, 1e-91, 1e-90, 1e-89, 1e-88, 1e-87, 1e-86, 1e-85, 1e-84, 1e-83, 1e-82, 1e-81, 1e-80, 1e-79, 1e-78, 1e-77, 1e-76, 1e-75, 1e-74, 1e-73, 1e-72, 1e-71, 1e-70, 1e-69, 1e-68, 1e-67, 1e-66, 1e-65, 1e-64, 1e-63, 1e-62, 1e-61, 1e-60, 1e-59, 1e-58, 1e-57, 1e-56, 1e-55, 1e-54, 1e-53, 1e-52, 1e-51, 1e-50, 1e-49, 1e-48, 1e-47, 1e-46, 1e-45, 1e-44, 1e-43, 1e-42, 1e-41, 1e-40, 1e-39, 1e-38, 1e-37, 1e-36, 1e-35, 1e-34, 1e-33, 1e-32, 1e-31, 1e-30, 1e-29, 1e-28, 1e-27, 1e-26, 1e-25, 1e-24, 1e-23, 1e-22, 1e-21, 1e-20, 1e-19, 1e-18, 1e-17, 1e-16, 1e-15, 1e-14, 1e-13, 1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30, 1e31, 1e32, 1e33, 1e34, 1e35, 1e36, 1e37, 1e38, 1e39, 1e40, 1e41, 1e42, 1e43, 1e44, 1e45, 1e46, 1e47, 1e48, 1e49, 1e50, 1e51, 1e52, 1e53, 1e54, 1e55, 1e56, 1e57, 1e58, 1e59, 1e60, 1e61, 1e62, 1e63, 1e64, 1e65, 1e66, 1e67, 1e68, 1e69, 1e70, 1e71, 1e72, 1e73, 1e74, 1e75, 1e76, 1e77, 1e78, 1e79, 1e80, 1e81, 1e82, 1e83, 1e84, 1e85, 1e86, 1e87, 1e88, 1e89, 1e90, 1e91, 1e92, 1e93, 1e94, 1e95, 1e96, 1e97, 1e98, 1e99, 1e100, 1e101, 1e102, 1e103, 1e104, 1e105, 1e106, 1e107, 1e108, 1e109, 1e110, 1e111, 1e112, 1e113, 1e114, 1e115, 1e116, 1e117, 1e118, 1e119, 1e120, 1e121, 1e122, 1e123, 1e124, 1e125, 1e126, 1e127, 1e128, 1e129, 1e130, 1e131, 1e132, 1e133, 1e134, 1e135, 1e136, 1e137, 1e138, 1e139, 1e140, 1e141, 1e142, 1e143, 1e144, 1e145, 1e146, 1e147, 1e148, 1e149, 1e150, 1e151, 1e152, 1e153, 1e154, 1e155, 1e156, 1e157, 1e158, 1e159, 1e160, 1e161, 1e162, 1e163, 1e164, 1e165, 1e166, 1e167, 1e168, 1e169, 1e170, 1e171, 1e172, 1e173, 1e174, 1e175, 1e176, 1e177, 1e178, 1e179, 1e180, 1e181, 1e182, 1e183, 1e184, 1e185, 1e186, 1e187, 1e188, 1e189, 1e190, 1e191, 1e192, 1e193, 1e194, 1e195, 1e196, 1e197, 1e198, 1e199, 1e200, 1e201, 1e202, 1e203, 1e204, 1e205, 1e206, 1e207, 1e208, 1e209, 1e210, 1e211, 1e212, 1e213, 1e214, 1e215, 1e216, 1e217, 1e218, 1e219, 1e220, 1e221, 1e222, 1e223, 1e224, 1e225, 1e226, 1e227, 1e228, 1e229, 1e230, 1e231, 1e232, 1e233, 1e234, 1e235, 1e236, 1e237, 1e238, 1e239, 1e240, 1e241, 1e242, 1e243, 1e244, 1e245, 1e246, 1e247, 1e248, 1e249, 1e250, 1e251, 1e252, 1e253, 1e254, 1e255, 1e256, 1e257, 1e258, 1e259, 1e260, 1e261, 1e262, 1e263, 1e264, 1e265, 1e266, 1e267, 1e268, 1e269, 1e270, 1e271, 1e272, 1e273, 1e274, 1e275, 1e276, 1e277, 1e278, 1e279, 1e280, 1e281, 1e282, 1e283, 1e284, 1e285, 1e286, 1e287, 1e288, 1e289, 1e290, 1e291, 1e292, 1e293, 1e294, 1e295, 1e296, 1e297, 1e298, 1e299, 1e300, 1e301, 1e302, 1e303, 1e304, 1e305, 1e306, 1e307, 1e308];
	var indexof0inpowersof10 = 308;
	
	class Decimal { 
	
		normalize() {
			//SAFETY: don't try to normalize non-numbers or we infinite loop
			if (!Number.isFinite(this.mantissa)) return this;
			while (Math.abs(this.mantissa) < 1 && this.mantissa != 0)
			{
				this.mantissa *= 10;
				this.exponent -= 1;
			}
			while (Math.abs(this.mantissa) >= 10)
			{
				this.mantissa /= 10;
				this.exponent += 1;
			}
			return this;
		}
		
		fromMantissaExponent(mantissa, exponent) {
			//SAFETY: don't let in non-numbers
			if (!Number.isFinite(mantissa) || !Number.isFinite(exponent)) { mantissa = Number.NaN; exponent = Number.NaN; }
			this.mantissa = mantissa;
			this.exponent = exponent;
			this.normalize(); //SAFETY: Doing two abs and two comparisons is a small price to pay to prevent weirdness everywhere.
			return this;
		}
		
		fromDecimal(value) {
			this.mantissa = value.mantissa;
			this.exponent = value.exponent;
			return this;
		}
		
		fromNumber(value) {
			//SAFETY: Handle Infinity and NaN in a somewhat meaningful way.
			if (Number.isNaN(value)) { this.mantissa = Number.NaN; this.exponent = Number.NaN; }
			else if (value == Number.POSITIVE_INFINITY) { this.mantissa = 1; this.exponent = EXP_LIMIT; }
			else if (value == Number.NEGATIVE_INFINITY) { this.mantissa = -1; this.exponent = EXP_LIMIT; }
			else if (value == 0) { this.mantissa = 0; this.exponent = 0; }
			else
			{
				this.exponent = Math.floor(Math.log10(Math.abs(value)));
				this.mantissa = value/powersof10[this.exponent+indexof0inpowersof10];
				this.normalize(); //SAFETY: Doing two abs and two comparisons is a small price to pay to prevent weirdness everywhere.
			}
			return this;
		}
		
		fromString(value) {
			if (value.indexOf("e") != -1)
			{
				var parts = value.split("e");
				this.mantissa = parseFloat(parts[0]);
				this.exponent = parseFloat(parts[1]);
				this.normalize(); //SAFETY: Doing two abs and two comparisons is a small price to pay to prevent weirdness everywhere.
				return this;
			}
			else
			{
				return this.fromNumber(parseFloat(value));
			}
		}
		
		fromValue(value) {
			if (value instanceof Decimal) {
				return this.fromDecimal(value);
			}
			else if (typeof(value) == 'number') {
				return this.fromNumber(value);
			}
			else if (typeof(value) == 'string') {
				return this.fromString(value);
			}
			else {
				this.mantissa = 0;
				this.exponent = 0;
				return this;
			}
		}
		
		constructor(value)
		{
			if (value instanceof Decimal) {
				this.fromDecimal(value);
			}
			else if (typeof(value) == 'number') {
				this.fromNumber(value);
			}
			else if (typeof(value) == 'string') {
				this.fromString(value);
			}
			else {
				this.mantissa = 0;
				this.exponent = 0;
			}
		}
		
		static fromMantissaExponent(mantissa, exponent) {
			return new Decimal().fromMantissaExponent(mantissa, exponent);
		}
		
		static fromDecimal(value) {
			return new Decimal().fromDecimal(value);
		}
		
		static fromNumber(value) {
			return new Decimal().fromNumber(value);
		}
		
		static fromString(value) {
			return new Decimal().fromString(value);
		}
		
		static fromValue(value) {
			return new Decimal(value);
		}
		
		toNumber() {
			return this.mantissa*Math.pow(10, this.exponent);
		}
		
		mantissaWithDecimalPlaces(places) {
			// https://stackoverflow.com/a/37425022
		
			if (Number.isNaN(this.mantissa) || Number.isNaN(this.exponent)) return Number.NaN;
			if (this.mantissa == 0) return 0;
			
			var len = places+1;
			var numDigits = Math.ceil(Math.log10(Math.abs(this.mantissa)));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len); 
			return parseFloat(rounded.toFixed(Math.max(len-numDigits,0)));
		}
		
		toString() {
			if (Number.isNaN(this.mantissa) || Number.isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0"; }
			
			return this.mantissa + "e" + this.exponent;
		}
		
		toStringWithDecimalPlaces(places) {
			// https://stackoverflow.com/a/37425022
		
			if (Number.isNaN(this.mantissa) || Number.isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0"; }

			var len = places+1;
			var numDigits = Math.ceil(Math.log10(Math.abs(this.mantissa)));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len); 
			
			return rounded.toFixed(Math.max(len-numDigits,0)) + "e" + this.exponent;
		}
		
		valueOf() { return this.toString(); }
		toJSON() { return this.toString(); }
		
		get m() { return this.mantissa; }
		set m(value) { this.mantissa = value; }
		get e() { return this.exponent; }
		set e(value) { this.exponent = value; }
		
		abs() {
			return Decimal.fromMantissaExponent(Math.abs(this.mantissa), this.exponent);
		}
		
		static abs(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.abs();
		}
		
		neg() {
			return Decimal.fromMantissaExponent(-this.mantissa, this.exponent);
		}
		
		static neg(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.neg();
		}
		
		negate() {
			return this.neg();
		}
		
		static negate(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.neg();
		}
		
		negated() {
			return this.neg();
		}
		
		static negated(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.neg();
		}
		
		sign() {
			return Math.sign(this.mantissa);
		}
		
		static sign(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.sign();
		}
		
		sgn() {
			return this.sign();
		}
		
		static sgn(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.sign();
		}
		
		add(value) {
			//figure out which is bigger, shrink the mantissa of the smaller by the difference in exponents, add mantissas, normalize and return
			
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			var biggerDecimal, smallerDecimal;
			if (this.exponent >= value.exponent)
			{
				biggerDecimal = this;
				smallerDecimal = value;
			}
			else
			{
				biggerDecimal = value;
				smallerDecimal = this;
			}
			
			if (biggerDecimal.exponent - smallerDecimal.exponent > MAX_SIGNIFICANT_DIGITS)
			{
				return biggerDecimal;
			}
			else
			{
				return Decimal.fromMantissaExponent(
				biggerDecimal.mantissa + smallerDecimal.mantissa*powersof10[(smallerDecimal.exponent-biggerDecimal.exponent)+indexof0inpowersof10],
				biggerDecimal.exponent);
			}
		}
		
		static add(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.add(other);
		}
		
		plus(value) {
			return this.add(value);
		}
		
		static plus(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.add(other);
		}
		
		sub(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.add(Decimal.fromMantissaExponent(-value.mantissa, value.exponent));
		}
		
		static sub(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.sub(other);
		}
		
		subtract(value) {
			return this.sub(value);
		}
		
		static subtract(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.sub(other);
		}
		
		mul(value) {
			/*
			a_1*10^b_1 * a_2*10^b_2
			= a_1*a_2*10^(b_1+b_2)
			*/
		
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}

			return Decimal.fromMantissaExponent(this.mantissa*value.mantissa, this.exponent+value.exponent);
		}
		
		static mul(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.mul(other);
		}
		
		multiply(value) {
			return this.mul(value);
		}
		
		static multiply(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.mul(other);
		}
		
		times(value) {
			return this.mul(value);
		}
		
		static times(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.mul(other);
		}
		
		div(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.mul(value.recip());
		}
		
		static div(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.div(other);
		}
		
		divide(value) {
			return this.div(value);
		}
		
		static divide(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.div(other);
		}
		
		recip() {
			return Decimal.fromMantissaExponent(1/this.mantissa, -this.exponent);
		}
		
		static recip(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.recip();
		}
		
		reciprocal() {
			return this.recip();
		}
		
		static reciprocal(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.recip();
		}
		
		reciprocate() {
			return this.recip();
		}
		
		static reciprocate(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.reciprocate();
		}
		
		//-1 for less than value, 0 for equals value, 1 for greater than value
		cmp(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			/*
			from smallest to largest:
			
			-3e100
			-1e100
			-3e99
			-1e99
			-3e0
			-1e0
			-3e-99
			-1e-99
			-3e-100
			-1e-100
			0
			1e-100
			3e-100
			1e-99
			3e-99
			1e0
			3e0
			1e99
			3e99
			1e100
			3e100
			
			*/
			
			if (this.mantissa == 0)
			{
				if (value.mantissa == 0) { return 0; }
				if (value.mantissa < 0) { return 1; }
				if (value.mantissa > 0) { return -1; }
			}
			else if (value.mantissa == 0)
			{
				if (this.mantissa < 0) { return -1; }
				if (this.mantissa > 0) { return 1; }
			}
			
			if (this.mantissa > 0) //positive
			{
				if (value.mantissa < 0) { return 1; }
				if (this.exponent > value.exponent) { return 1; }
				if (this.exponent < value.exponent) { return -1; }
				if (this.mantissa > value.mantissa) { return 1; }
				if (this.mantissa < value.mantissa) { return -1; }
				return 0;
			}
			else if (this.mantissa < 0) // negative
			{
				if (value.mantissa > 0) { return -1; }
				if (this.exponent > value.exponent) { return -1; }
				if (this.exponent < value.exponent) { return 1; }
				if (this.mantissa > value.mantissa) { return -1; }
				if (this.mantissa < value.mantissa) { return 1; }
				return 0;
			}
		}
		
		static cmp(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.cmp(other);
		}
		
		compare(value) {
			return this.cmp(value);
		}
		
		static compare(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.cmp(other);
		}
		
		eq(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.cmp(value) == 0;
		}
		
		static eq(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.eq(other);
		}
		
		equals(value) {
			return this.eq(value);
		}
		
		static equals(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.eq(other);
		}
		
		neq(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.cmp(value) != 0;
		}
		
		static neq(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.neq(other);
		}
		
		notEquals(value) {
			return this.neq(value);
		}
		
		static notEquals(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.notEquals(other);
		}
		
		lt(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.cmp(value) < 0;
		}
		
		static lt(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.lt(other);
		}
		
		lte(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.cmp(value) <= 0;
		}
		
		static lte(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.lte(other);
		}
		
		gt(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.cmp(value) > 0;
		}
		
		static gt(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.gt(other);
		}
		
		gte(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return this.cmp(value) >= 0;
		}
		
		static gte(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.gte(other);
		}
		
		max(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			var discriminant = this.cmp(value);
			if (discriminant >= 0) return this;
			return value;
		}
		
		static max(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.max(other);
		}
		
		min(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			var discriminant = this.cmp(value);
			if (discriminant <= 0) return this;
			return value;
		}
		
		static min(value, other) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.min(other);
		}
		
		cmp_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			if (this.eq_tolerance(value, tolerance)) return 0;
			return this.cmp(value);
		}
		
		static cmp_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.cmp_tolerance(other, tolerance);
		}
		
		compare_tolerance(value, tolerance) {
			return this.cmp_tolerance(value, tolerance);
		}
		
		static compare_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.cmp_tolerance(other, tolerance);
		}
		
		//tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments. For example, if you put in 1e-9, then any number closer to the larger number than (larger number)*1e-9 will be considered equal.
		eq_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
		
			// https://stackoverflow.com/a/33024979
			//return abs(a-b) <= tolerance * max(abs(a), abs(b))
			
			return Decimal.lte(
				this.sub(value).abs(),
				Decimal.max(this.abs(), value.abs()).mul(tolerance)
				);
		}
		
		static eq_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.eq_tolerance(other, tolerance);
		}
		
		equals_tolerance(value, tolerance) {
			return this.eq_tolerance(value, tolerance);
		}
		
		static equals_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.eq_tolerance(other, tolerance);
		}
		
		neq_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return !this.eq_tolerance(value, tolerance);
		}
		
		static neq_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.neq_tolerance(other, tolerance);
		}
		
		notEquals_tolerance(value, tolerance) {
			return this.neq_tolerance(value, tolerance);
		}
		
		static notEquals_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.notEquals_tolerance(other, tolerance);
		}
		
		lt_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			if (this.eq_tolerance(value, tolerance)) return false;
			return this.lt(value);
		}
		
		static lt_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.lt_tolerance(other, tolerance);
		}
		
		lte_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			if (this.eq_tolerance(value, tolerance)) return true;
			return this.lt(value);
		}
		
		static lte_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.lte_tolerance(other, tolerance);
		}
		
		gt_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			if (this.eq_tolerance(value, tolerance)) return false;
			return this.gt(value);
		}
		
		static gt_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.gt_tolerance(other, tolerance);
		}
		
		gte_tolerance(value, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			if (this.eq_tolerance(value, tolerance)) return true;
			return this.gt(value);
		}
		
		static gte_tolerance(value, other, tolerance) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.gte_tolerance(other, tolerance);
		}
		
		log10() {
			return this.exponent + Math.log10(this.mantissa);
		}
		
		static log10(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.log10();
		}
		
		log(base) {
			//UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater). We assume this to be true and thus only need to return a number, not a Decimal, and don't do any other kind of error checking.
			return (Math.LN10/Math.log(base))*this.log10();
		}
		
		static log(value, base) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.log(base);
		}
		
		log2() {
			return 3.32192809488736234787*this.log10();
		}
		
		static log2(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.log2();
		}
		
		ln() {
			return 2.30258509299404568402*this.log10();
		}
		
		static ln(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.ln();
		}
		
		logarithm(base) {
			return this.log(base);
		}
		
		static logarithm(value, base) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.logarithm(base);
		}
		
		pow(value) {
			//UN-SAFETY: We're assuming Decimal^number because number^Decimal or Decimal^Decimal is unheard of in incremental games.
		
			//Fast track: If (this.exponent*value) is an integer, we can do a very fast method.
			if (Number.isInteger(this.exponent*value))
			{
				return Decimal.fromMantissaExponent(Math.pow(this.mantissa, value), this.exponent*value);
			}
			else
			{
				return Decimal.exp(value*this.ln());
			}
		}
		
		pow_base(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.pow(this);
		}
		
		static pow(value, other) {
			//Fast track: 10^integer
			if (value == 10 && Number.isInteger(other)) { return Decimal.fromMantissaExponent(1, other); }
			
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.pow(other);
		}
		
		exp() {
			//UN-SAFETY: Assuming this value is between [-2.1e15, -2.1e15].
		
			//Fast track: if -706 < this < 709, we can use regular exp.
			var asNumber = this.toNumber();
			if (-706 < asNumber && asNumber < 709)
			{
				return Decimal.fromNumber(Math.exp(asNumber));
			}
			else
			{
				//This has to be implemented fundamentally, so that pow(value) can be implemented on top of it.
				//Should be fast and accurate over the range [-2.1e15, 2.1e15]. Outside that it overflows, so we don't care about these cases.
				
				// Implementation from SpeedCrunch: https://bitbucket.org/heldercorreia/speedcrunch/src/9cffa7b674890affcb877bfebc81d39c26b20dcc/src/math/floatexp.c?at=master&fileviewer=file-view-default
				
				var x, exp, tmp, expx, extra, LN10;
				
				x = this;
				exp = 0;
				expx = this.exponent;
				LN10 = Decimal.fromNumber(Math.LN10);
				
				if (expx >= 0)
				{
					exp = Math.trunc(Decimal.div(x, LN10).toNumber());
					extra = exp.exponent+1;
					tmp = Decimal.mul(exp, LN10);
					x = Decimal.sub(x, tmp);
					if (Decimal.cmp(x, Math.LN10) >= 0)
					{
						++exp;
						x = Decimal.sub(x, LN10);
					}
				}
				if (Decimal.sign(x) < 0)
				{
					--exp;
					x = Decimal.add(x, LN10);
				}
				
				//when we get here 0 <= x < ln 10
				x = Math.exp(x.toNumber());
				
				if (exp != 0)
				{
					expx = Math.floor(exp);
					x = Decimal.fromMantissaExponent(x, expx);
				}
				
				return x;
			}
		}
		
		static exp(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.exp();
		}
		
		sqr() {
			return this.pow(2);
		}
		
		static sqr(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.sqr();
		}
		
		sqrt() {
			return this.pow(0.5);
		}
		
		static sqrt(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.sqrt();
		}
		
		cube() {
			return this.pow(3);
		}
		
		static cube(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.cube();
		}
		
		cbrt() {
			return this.pow(1/3);
		}
		
		static cbrt(value) {
			if (typeof(value) == 'number') {
				value = Decimal.fromNumber(value);
			}
			
			return value.cbrt();
		}
	}
	
	// Export.

	// AMD.
	if (typeof define == 'function' && define.amd) {
		define(function () {
		return Decimal;
	});

	// Node and other environments that support module.exports.
	} else if (typeof module != 'undefined' && module.exports) {
		module.exports = Decimal;

	// Browser.
	} else {
	if (!globalScope) {
		globalScope = typeof self != 'undefined' && self && self.self == self
		? self : Function('return this')();
	}

	var noConflict = globalScope.Decimal;
	Decimal.noConflict = function () {
		globalScope.Decimal = noConflict;
		return Decimal;
	};

	globalScope.Decimal = Decimal;
	}
})(this);
