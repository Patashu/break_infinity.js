;(function (globalScope) {
	'use strict';
	
	/*
	
	# break_infinity.js
	A replacement for decimal.js for incremental games who want to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e(9e15) ) and want to prioritize speed over accuracy.
	If you want to prioritize accuracy over speed, please use decimal.js instead.
	If you need to handle numbers as big as 1e(1.79e308), try break_break_infinity.js, which sacrifices speed to deal with such massive numbers.
	
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
	toFixed(places)
	toExponential(places)
	toPrecision(places)
	
	abs(), neg(), sign()
	add(value), sub(value), mul(value), div(value), recip()
	
	cmp(value), eq(value), neq(value), lt(value), lte(value), gt(value), gte(value)
	cmp_tolerance(value, tolerance), eq_tolerance(value, tolerance), neq_tolerance(value, tolerance), lt_tolerance(value, tolerance), lte_tolerance(value, tolerance), gt_tolerance(value, tolerance), gte_tolerance(value, tolerance)
	
	log(base), log10(), log2(), ln()
	pow(value, other), pow(value), pow_base(value), exp(), sqr(), sqrt(), cube(), cbrt()
	
	affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned), sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned), affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned), sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned)
	
	---
	
	So how much faster than decimal.js is break_infinity.js? Operations per second on my old-ish computer:
	pow(1.5): 5e6 (1e4 for decimal.js - 500x faster)
	exp: 2e7 (1e4 for decimal.js - 2000x faster)
	log: 3e7 (5e4 for decimal.js - 600x faster)
	add, mul: 1e8 (2e6 for decimal.js - 50x faster)
	
	---
	
	Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.
	
	Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal
	
	*/
	
	var MAX_SIGNIFICANT_DIGITS = 17; //for example: if two exponents are more than 17 apart, consider adding them together pointless, just return the larger one
	var EXP_LIMIT = 9e15; //highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS
	
	var NUMBER_EXP_MAX = 308; //the largest exponent that can appear in a Number, though not all mantissas are valid here.
	var NUMBER_EXP_MIN = -324; //The smallest exponent that can appear in a Number, though not all mantissas are valid here.
	
	//we need this lookup table because Math.pow(10, exponent) when exponent's absolute value is large is slightly inaccurate. you can fix it with the power of math... or just make a lookup table. faster AND simpler
	var powersof10 = [1e-323, 1e-322, 1e-321, 1e-320, 1e-319, 1e-318, 1e-317, 1e-316, 1e-315, 1e-314, 1e-313, 1e-312, 1e-311, 1e-310, 1e-309, 1e-308, 1e-307, 1e-306, 1e-305, 1e-304, 1e-303, 1e-302, 1e-301, 1e-300, 1e-299, 1e-298, 1e-297, 1e-296, 1e-295, 1e-294, 1e-293, 1e-292, 1e-291, 1e-290, 1e-289, 1e-288, 1e-287, 1e-286, 1e-285, 1e-284, 1e-283, 1e-282, 1e-281, 1e-280, 1e-279, 1e-278, 1e-277, 1e-276, 1e-275, 1e-274, 1e-273, 1e-272, 1e-271, 1e-270, 1e-269, 1e-268, 1e-267, 1e-266, 1e-265, 1e-264, 1e-263, 1e-262, 1e-261, 1e-260, 1e-259, 1e-258, 1e-257, 1e-256, 1e-255, 1e-254, 1e-253, 1e-252, 1e-251, 1e-250, 1e-249, 1e-248, 1e-247, 1e-246, 1e-245, 1e-244, 1e-243, 1e-242, 1e-241, 1e-240, 1e-239, 1e-238, 1e-237, 1e-236, 1e-235, 1e-234, 1e-233, 1e-232, 1e-231, 1e-230, 1e-229, 1e-228, 1e-227, 1e-226, 1e-225, 1e-224, 1e-223, 1e-222, 1e-221, 1e-220, 1e-219, 1e-218, 1e-217, 1e-216, 1e-215, 1e-214, 1e-213, 1e-212, 1e-211, 1e-210, 1e-209, 1e-208, 1e-207, 1e-206, 1e-205, 1e-204, 1e-203, 1e-202, 1e-201, 1e-200, 1e-199, 1e-198, 1e-197, 1e-196, 1e-195, 1e-194, 1e-193, 1e-192, 1e-191, 1e-190, 1e-189, 1e-188, 1e-187, 1e-186, 1e-185, 1e-184, 1e-183, 1e-182, 1e-181, 1e-180, 1e-179, 1e-178, 1e-177, 1e-176, 1e-175, 1e-174, 1e-173, 1e-172, 1e-171, 1e-170, 1e-169, 1e-168, 1e-167, 1e-166, 1e-165, 1e-164, 1e-163, 1e-162, 1e-161, 1e-160, 1e-159, 1e-158, 1e-157, 1e-156, 1e-155, 1e-154, 1e-153, 1e-152, 1e-151, 1e-150, 1e-149, 1e-148, 1e-147, 1e-146, 1e-145, 1e-144, 1e-143, 1e-142, 1e-141, 1e-140, 1e-139, 1e-138, 1e-137, 1e-136, 1e-135, 1e-134, 1e-133, 1e-132, 1e-131, 1e-130, 1e-129, 1e-128, 1e-127, 1e-126, 1e-125, 1e-124, 1e-123, 1e-122, 1e-121, 1e-120, 1e-119, 1e-118, 1e-117, 1e-116, 1e-115, 1e-114, 1e-113, 1e-112, 1e-111, 1e-110, 1e-109, 1e-108, 1e-107, 1e-106, 1e-105, 1e-104, 1e-103, 1e-102, 1e-101, 1e-100, 1e-99, 1e-98, 1e-97, 1e-96, 1e-95, 1e-94, 1e-93, 1e-92, 1e-91, 1e-90, 1e-89, 1e-88, 1e-87, 1e-86, 1e-85, 1e-84, 1e-83, 1e-82, 1e-81, 1e-80, 1e-79, 1e-78, 1e-77, 1e-76, 1e-75, 1e-74, 1e-73, 1e-72, 1e-71, 1e-70, 1e-69, 1e-68, 1e-67, 1e-66, 1e-65, 1e-64, 1e-63, 1e-62, 1e-61, 1e-60, 1e-59, 1e-58, 1e-57, 1e-56, 1e-55, 1e-54, 1e-53, 1e-52, 1e-51, 1e-50, 1e-49, 1e-48, 1e-47, 1e-46, 1e-45, 1e-44, 1e-43, 1e-42, 1e-41, 1e-40, 1e-39, 1e-38, 1e-37, 1e-36, 1e-35, 1e-34, 1e-33, 1e-32, 1e-31, 1e-30, 1e-29, 1e-28, 1e-27, 1e-26, 1e-25, 1e-24, 1e-23, 1e-22, 1e-21, 1e-20, 1e-19, 1e-18, 1e-17, 1e-16, 1e-15, 1e-14, 1e-13, 1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30, 1e31, 1e32, 1e33, 1e34, 1e35, 1e36, 1e37, 1e38, 1e39, 1e40, 1e41, 1e42, 1e43, 1e44, 1e45, 1e46, 1e47, 1e48, 1e49, 1e50, 1e51, 1e52, 1e53, 1e54, 1e55, 1e56, 1e57, 1e58, 1e59, 1e60, 1e61, 1e62, 1e63, 1e64, 1e65, 1e66, 1e67, 1e68, 1e69, 1e70, 1e71, 1e72, 1e73, 1e74, 1e75, 1e76, 1e77, 1e78, 1e79, 1e80, 1e81, 1e82, 1e83, 1e84, 1e85, 1e86, 1e87, 1e88, 1e89, 1e90, 1e91, 1e92, 1e93, 1e94, 1e95, 1e96, 1e97, 1e98, 1e99, 1e100, 1e101, 1e102, 1e103, 1e104, 1e105, 1e106, 1e107, 1e108, 1e109, 1e110, 1e111, 1e112, 1e113, 1e114, 1e115, 1e116, 1e117, 1e118, 1e119, 1e120, 1e121, 1e122, 1e123, 1e124, 1e125, 1e126, 1e127, 1e128, 1e129, 1e130, 1e131, 1e132, 1e133, 1e134, 1e135, 1e136, 1e137, 1e138, 1e139, 1e140, 1e141, 1e142, 1e143, 1e144, 1e145, 1e146, 1e147, 1e148, 1e149, 1e150, 1e151, 1e152, 1e153, 1e154, 1e155, 1e156, 1e157, 1e158, 1e159, 1e160, 1e161, 1e162, 1e163, 1e164, 1e165, 1e166, 1e167, 1e168, 1e169, 1e170, 1e171, 1e172, 1e173, 1e174, 1e175, 1e176, 1e177, 1e178, 1e179, 1e180, 1e181, 1e182, 1e183, 1e184, 1e185, 1e186, 1e187, 1e188, 1e189, 1e190, 1e191, 1e192, 1e193, 1e194, 1e195, 1e196, 1e197, 1e198, 1e199, 1e200, 1e201, 1e202, 1e203, 1e204, 1e205, 1e206, 1e207, 1e208, 1e209, 1e210, 1e211, 1e212, 1e213, 1e214, 1e215, 1e216, 1e217, 1e218, 1e219, 1e220, 1e221, 1e222, 1e223, 1e224, 1e225, 1e226, 1e227, 1e228, 1e229, 1e230, 1e231, 1e232, 1e233, 1e234, 1e235, 1e236, 1e237, 1e238, 1e239, 1e240, 1e241, 1e242, 1e243, 1e244, 1e245, 1e246, 1e247, 1e248, 1e249, 1e250, 1e251, 1e252, 1e253, 1e254, 1e255, 1e256, 1e257, 1e258, 1e259, 1e260, 1e261, 1e262, 1e263, 1e264, 1e265, 1e266, 1e267, 1e268, 1e269, 1e270, 1e271, 1e272, 1e273, 1e274, 1e275, 1e276, 1e277, 1e278, 1e279, 1e280, 1e281, 1e282, 1e283, 1e284, 1e285, 1e286, 1e287, 1e288, 1e289, 1e290, 1e291, 1e292, 1e293, 1e294, 1e295, 1e296, 1e297, 1e298, 1e299, 1e300, 1e301, 1e302, 1e303, 1e304, 1e305, 1e306, 1e307, 1e308];
	var indexof0inpowersof10 = 323;
	
	class Decimal { 
	
		/*static adjustMantissa(oldMantissa, exponent) {
			//Multiplying or dividing by 0.1 causes rounding errors, dividing or multiplying by 10 does not.
			//So always multiply/divide by a large number whenever we can get away with it.
			
			/*
			Still a few weird cases, IDK if they'll ever come up though:
0.001*1e308
1e+305
0.001*1e308*10
9.999999999999999e+305
			*/
			
			/*
			TODO: I'm not even sure if this is a good idea in general, because
1000*-4.03
-4030.0000000000005
-4.03/1e-3
-4030
			So it's not even true that mul/div by a positive power of 10 is always the more accurate approach.
			*/
			
			/*if (exponent == 0) { return oldMantissa; }
			if (exponent > 0)
			{
				if (exponent > 308)
				{
					return oldMantissa*1e308*powersof10[(exponent-308)+indexof0inpowersof10];
				}
				return oldMantissa*powersof10[exponent+indexof0inpowersof10];
			}
			else
			{
				if (exponent < -308)
				{
					return oldMantissa*powersof10[exponent+indexof0inpowersof10];
				}
				return oldMantissa/powersof10[-exponent+indexof0inpowersof10];
			}
		}*/
	
		normalize() {
			//When mantissa is very denormalized, use this to normalize much faster.
			
			//TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter
			if (this.mantissa == 0) { this.mantissa = 0; this.exponent = 0; return; }
			if (this.mantissa >= 1 && this.mantissa < 10) { return; }
			
			var temp_exponent = Math.floor(Math.log10(Math.abs(this.mantissa)));
			this.mantissa = this.mantissa/powersof10[temp_exponent+indexof0inpowersof10];
			this.exponent += temp_exponent;
			
			return this;
		}
		
		fromMantissaExponent(mantissa, exponent) {
			//SAFETY: don't let in non-numbers
			if (!Number.isFinite(mantissa) || !Number.isFinite(exponent)) { mantissa = Number.NaN; exponent = Number.NaN; }
			this.mantissa = mantissa;
			this.exponent = exponent;
			this.normalize(); //Non-normalized mantissas can easily get here, so this is mandatory.
			return this;
		}
		
		fromMantissaExponent_noNormalize(mantissa, exponent) {
			//Well, you know what you're doing!
			this.mantissa = mantissa;
			this.exponent = exponent;
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
				//SAFETY: handle 5e-324, -5e-324 separately
				if (this.exponent == NUMBER_EXP_MIN)
				{
					this.mantissa = (value*10)/1e-323;
				}
				else
				{
					this.mantissa = value/powersof10[this.exponent+indexof0inpowersof10];
				}
				this.normalize(); //SAFETY: Prevent weirdness.
			}
			return this;
		}
		
		fromString(value) {
			if (value.indexOf("e") != -1)
			{
				var parts = value.split("e");
				this.mantissa = parseFloat(parts[0]);
				this.exponent = parseFloat(parts[1]);
				this.normalize(); //Non-normalized mantissas can easily get here, so this is mandatory.
			}
			else if (value == "NaN") { this.mantissa = Number.NaN; this.exponent = Number.NaN; }
			else
			{
				this.fromNumber(parseFloat(value));
				if (Number.isNaN(this.mantissa)) { throw Error("[DecimalError] Invalid argument: " + value); }
			}
			return this;
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
		
		static fromMantissaExponent_noNormalize(mantissa, exponent) {
			return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
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
			if (value instanceof Decimal) {
				return value;
			}
			return new Decimal(value);
		}
		
		toNumber() {
			//Problem: new Decimal(116).toNumber() returns 115.99999999999999.
			//TODO: How to fix in general case? It's clear that if toNumber() is VERY close to an integer, we want exactly the integer. But it's not clear how to specifically write that. So I'll just settle with 'exponent >= 0 and difference between rounded and not rounded < 1e-9' as a quick fix.
			
			//var result = this.mantissa*Math.pow(10, this.exponent);
			
			if (!Number.isFinite(this.exponent)) { return Number.NaN; }
			if (this.exponent > NUMBER_EXP_MAX) { return this.mantissa > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY; }
			if (this.exponent < NUMBER_EXP_MIN) { return 0; }
			//SAFETY: again, handle 5e-324, -5e-324 separately
			if (this.exponent == NUMBER_EXP_MIN) { return this.mantissa > 0 ? 5e-324 : -5e-324; }
			
			var result = this.mantissa*powersof10[this.exponent+indexof0inpowersof10];
			if (!Number.isFinite(result) || this.exponent < 0) { return result; }
			var resultrounded = Math.round(result);
			if (Math.abs(resultrounded-result) < 1e-10) return resultrounded;
			return result;
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
			
			if (this.exponent < 21 && this.exponent > -7)
			{
				return this.toNumber().toString();
			}
			
			return this.mantissa + "e" + (this.exponent >= 0 ? "+" : "") + this.exponent;
		}
		
		toExponential(places) {
			// https://stackoverflow.com/a/37425022
			
			//TODO: Some unfixed cases:
			//new Decimal("1.2345e-999").toExponential()
			//"1.23450000000000015e-999"
			//new Decimal("1e-999").toExponential()
			//"1.000000000000000000e-999"
			//TBH I'm tempted to just say it's a feature. If you're doing pretty formatting then why don't you know how many decimal places you want...?
		
			if (Number.isNaN(this.mantissa) || Number.isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0" + (places > 0 ? ".".padEnd(places+1, "0") : "") + "e+0"; }
			
			// two cases:
			// 1) exponent is < 308 and > -324: use basic toFixed
			// 2) everything else: we have to do it ourselves!
			
			if (this.exponent > NUMBER_EXP_MIN && this.exponent < NUMBER_EXP_MAX) { return this.toNumber().toExponential(places); }
			
			if (!Number.isFinite(places)) { places = MAX_SIGNIFICANT_DIGITS; }
			
			var len = places+1;
			var numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.mantissa))));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);
			
			return rounded.toFixed(Math.max(len-numDigits,0)) + "e" + (this.exponent >= 0 ? "+" : "") + this.exponent;
		}
		
		toFixed(places) {
			if (Number.isNaN(this.mantissa) || Number.isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0" + (places > 0 ? ".".padEnd(places+1, "0") : ""); }
			
			// two cases:
			// 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
			// 2) exponent is 16 or less: use basic toFixed
			
			if (this.exponent >= MAX_SIGNIFICANT_DIGITS)
			{
				return this.mantissa.toString().replace(".", "").padEnd(this.exponent+1, "0") + (places > 0 ? ".".padEnd(places+1, "0") : "");
			}
			else
			{
				return this.toNumber().toFixed(places);
			}
		}
		
		toPrecision(places) {
			if (this.exponent <= -7)
			{
				return this.toExponential(places-1);
			}
			if (places > this.exponent)
			{
				return this.toFixed(places - this.exponent - 1);
			}
			return this.toExponential(places-1);
		}
		
		valueOf() { return this.toString(); }
		toJSON() { return this.toString(); }
		toStringWithDecimalPlaces(places) { return this.toExponential(places); }
		
		get m() { return this.mantissa; }
		set m(value) { this.mantissa = value; }
		get e() { return this.exponent; }
		set e(value) { this.exponent = value; }
		
		abs() {
			return Decimal.fromMantissaExponent(Math.abs(this.mantissa), this.exponent);
		}
		
		static abs(value) {
			value = Decimal.fromValue(value);
			
			return value.abs();
		}
		
		neg() {
			return Decimal.fromMantissaExponent(-this.mantissa, this.exponent);
		}
		
		static neg(value) {
			value = Decimal.fromValue(value);
			
			return value.neg();
		}
		
		negate() {
			return this.neg();
		}
		
		static negate(value) {
			value = Decimal.fromValue(value);
			
			return value.neg();
		}
		
		negated() {
			return this.neg();
		}
		
		static negated(value) {
			value = Decimal.fromValue(value);
			
			return value.neg();
		}
		
		sign() {
			return Math.sign(this.mantissa);
		}
		
		static sign(value) {
			value = Decimal.fromValue(value);
			
			return value.sign();
		}
		
		sgn() {
			return this.sign();
		}
		
		static sgn(value) {
			value = Decimal.fromValue(value);
			
			return value.sign();
		}
		
		get s() {return this.sign(); }
		set s(value) {
			if (value == 0) { this.e = 0; this.m = 0; }
			if (this.sgn() != value) { this.m = -this.m; }
		}
		
		round() {
			if (this.exponent < 0)
			{
				return new Decimal(0);
			}
			else if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.round(this.toNumber()));
			}
			return this;
		}
		
		static round(value) {
			value = Decimal.fromValue(value);
			
			return value.round();
		}
		
		floor() {
			if (this.exponent < 0)
			{
				return Math.sign(this.mantissa) >= 0 ? new Decimal(0) : new Decimal(-1);
			}
			else if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.floor(this.toNumber()));
			}
			return this;
		}
		
		static floor(value) {
			value = Decimal.fromValue(value);
			
			return value.floor();
		}
		
		ceil() {
			if (this.exponent < 0)
			{
				return Math.sign(this.mantissa) > 0 ? new Decimal(1) : new Decimal(0);
			}
			if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.ceil(this.toNumber()));
			}
			return this;
		}
		
		static ceil(value) {
			value = Decimal.fromValue(value);
			
			return value.ceil();
		}
		
		trunc() {
			if (this.exponent < 0)
			{
				return new Decimal(0);
			}
			else if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.trunc(this.toNumber()));
			}
			return this;
		}
		
		static trunc(value) {
			value = Decimal.fromValue(value);
			
			return value.trunc();
		}
		
		add(value) {
			//figure out which is bigger, shrink the mantissa of the smaller by the difference in exponents, add mantissas, normalize and return
			
			//TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8
			
			value = Decimal.fromValue(value);
			
			if (this.mantissa == 0) { return value; }
			if (value.mantissa == 0) { return this; }
			
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
				//have to do this because adding numbers that were once integers but scaled down is imprecise.
				//Example: 299 + 18
				return Decimal.fromMantissaExponent(
				Math.round(1e14*biggerDecimal.mantissa + 1e14*smallerDecimal.mantissa*powersof10[(smallerDecimal.exponent-biggerDecimal.exponent)+indexof0inpowersof10]),
				biggerDecimal.exponent-14);
			}
		}
		
		static add(value, other) {
			value = Decimal.fromValue(value);
			
			return value.add(other);
		}
		
		plus(value) {
			return this.add(value);
		}
		
		static plus(value, other) {
			value = Decimal.fromValue(value);
			
			return value.add(other);
		}
		
		sub(value) {
			value = Decimal.fromValue(value);
			
			return this.add(Decimal.fromMantissaExponent(-value.mantissa, value.exponent));
		}
		
		static sub(value, other) {
			value = Decimal.fromValue(value);
			
			return value.sub(other);
		}
		
		subtract(value) {
			return this.sub(value);
		}
		
		static subtract(value, other) {
			value = Decimal.fromValue(value);
			
			return value.sub(other);
		}
		
		minus(value) {
			return this.sub(value);
		}
		
		static minus(value, other) {
			value = Decimal.fromValue(value);
			
			return value.sub(other);
		}
		
		mul(value) {
			/*
			a_1*10^b_1 * a_2*10^b_2
			= a_1*a_2*10^(b_1+b_2)
			*/
		
			value = Decimal.fromValue(value);

			return Decimal.fromMantissaExponent(this.mantissa*value.mantissa, this.exponent+value.exponent);
		}
		
		static mul(value, other) {
			value = Decimal.fromValue(value);
			
			return value.mul(other);
		}
		
		multiply(value) {
			return this.mul(value);
		}
		
		static multiply(value, other) {
			value = Decimal.fromValue(value);
			
			return value.mul(other);
		}
		
		times(value) {
			return this.mul(value);
		}
		
		static times(value, other) {
			value = Decimal.fromValue(value);
			
			return value.mul(other);
		}
		
		div(value) {
			value = Decimal.fromValue(value);
			
			return this.mul(value.recip());
		}
		
		static div(value, other) {
			value = Decimal.fromValue(value);
			
			return value.div(other);
		}
		
		divide(value) {
			return this.div(value);
		}
		
		static divide(value, other) {
			value = Decimal.fromValue(value);
			
			return value.div(other);
		}
		
		divideBy(value) { return this.div(value); }
		dividedBy(value) { return this.div(value); }
		
		recip() {
			return Decimal.fromMantissaExponent(1/this.mantissa, -this.exponent);
		}
		
		static recip(value) {
			value = Decimal.fromValue(value);
			
			return value.recip();
		}
		
		reciprocal() {
			return this.recip();
		}
		
		static reciprocal(value) {
			value = Decimal.fromValue(value);
			
			return value.recip();
		}
		
		reciprocate() {
			return this.recip();
		}
		
		static reciprocate(value) {
			value = Decimal.fromValue(value);
			
			return value.reciprocate();
		}
		
		//-1 for less than value, 0 for equals value, 1 for greater than value
		cmp(value) {
			value = Decimal.fromValue(value);
			
			//TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12
			
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
				if (this.mantissa > value.mantissa) { return 1; }
				if (this.mantissa < value.mantissa) { return -1; }
				return 0;
			}
		}
		
		static cmp(value, other) {
			value = Decimal.fromValue(value);
			
			return value.cmp(other);
		}
		
		compare(value) {
			return this.cmp(value);
		}
		
		static compare(value, other) {
			value = Decimal.fromValue(value);
			
			return value.cmp(other);
		}
		
		eq(value) {
			value = Decimal.fromValue(value);
			
			return this.e == value.e && this.m == value.m
		}
		
		static eq(value, other) {
			value = Decimal.fromValue(value);
			
			return value.eq(other);
		}
		
		equals(value) {
			return this.eq(value);
		}
		
		static equals(value, other) {
			value = Decimal.fromValue(value);
			
			return value.eq(other);
		}
		
		neq(value) {
			value = Decimal.fromValue(value);
			
			return this.e != value.e || this.m != value.m
		}
		
		static neq(value, other) {
			value = Decimal.fromValue(value);
			
			return value.neq(other);
		}
		
		notEquals(value) {
			return this.neq(value);
		}
		
		static notEquals(value, other) {
			value = Decimal.fromValue(value);
			
			return value.notEquals(other);
		}
		
		lt(value) {
			value = Decimal.fromValue(value);
			
			if (this.m == 0) return value.m > 0
			if (value.m == 0) return this.m <= 0
			if (this.e == value.e) return this.m < value.m;
			if (this.m > 0) return value.m > 0 && this.e < value.e;
			return value.m > 0 || this.e > value.e
		}
		
		static lt(value, other) {
			value = Decimal.fromValue(value);
			
			return value.lt(other);
		}
		
		lte(value) {
			value = Decimal.fromValue(value);
			
			if (this.m == 0) return value.m >= 0
			if (value.m == 0) return this.m <= 0
			if (this.e == value.e) return this.m <= value.m;
			if (this.m > 0) return value.m > 0 && this.e < value.e;
			return value.m > 0 || this.e > value.e
		}
		
		static lte(value, other) {
			value = Decimal.fromValue(value);
			
			return value.lte(other);
		}
		
		gt(value) {
			value = Decimal.fromValue(value);
			
			if (this.m == 0) return value.m < 0
			if (value.m == 0) return this.m > 0
			if (this.e == value.e) return this.m > value.m;
			if (this.m > 0) return value.m < 0 || this.e > value.e;
			return value.m < 0 && this.e < value.e
		}
		
		static gt(value, other) {
			value = Decimal.fromValue(value);
			
			return value.gt(other);
		}
		
		gte(value) {
			value = Decimal.fromValue(value);
			
			if (this.m == 0) return value.m <= 0
			if (value.m == 0) return this.m > 0
			if (this.e == value.e) return this.m >= value.m;
			if (this.m > 0) return value.m < 0 || this.e >= value.e;
			return value.m < 0 && this.e <= value.e
		}
		
		static gte(value, other) {
			value = Decimal.fromValue(value);
			
			return value.gte(other);
		}
		
		max(value) {
			value = Decimal.fromValue(value);
			
			var discriminant = this.cmp(value);
			if (discriminant >= 0) return this;
			return value;
		}
		
		static max(value, other) {
			value = Decimal.fromValue(value);
			
			return value.max(other);
		}
		
		min(value) {
			value = Decimal.fromValue(value);
			
			var discriminant = this.cmp(value);
			if (discriminant <= 0) return this;
			return value;
		}
		
		static min(value, other) {
			value = Decimal.fromValue(value);
			
			return value.min(other);
		}
		
		cmp_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
			
			if (this.eq_tolerance(value, tolerance)) return 0;
			return this.cmp(value);
		}
		
		static cmp_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.cmp_tolerance(other, tolerance);
		}
		
		compare_tolerance(value, tolerance) {
			return this.cmp_tolerance(value, tolerance);
		}
		
		static compare_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.cmp_tolerance(other, tolerance);
		}
		
		//tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments. For example, if you put in 1e-9, then any number closer to the larger number than (larger number)*1e-9 will be considered equal.
		eq_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
		
			// https://stackoverflow.com/a/33024979
			//return abs(a-b) <= tolerance * max(abs(a), abs(b))
			
			return Decimal.lte(
				this.sub(value).abs(),
				Decimal.max(this.abs(), value.abs()).mul(tolerance)
				);
		}
		
		static eq_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.eq_tolerance(other, tolerance);
		}
		
		equals_tolerance(value, tolerance) {
			return this.eq_tolerance(value, tolerance);
		}
		
		static equals_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.eq_tolerance(other, tolerance);
		}
		
		neq_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
			
			return !this.eq_tolerance(value, tolerance);
		}
		
		static neq_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.neq_tolerance(other, tolerance);
		}
		
		notEquals_tolerance(value, tolerance) {
			return this.neq_tolerance(value, tolerance);
		}
		
		static notEquals_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.notEquals_tolerance(other, tolerance);
		}
		
		lt_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
			
			if (this.eq_tolerance(value, tolerance)) return false;
			return this.lt(value);
		}
		
		static lt_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.lt_tolerance(other, tolerance);
		}
		
		lte_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
			
			if (this.eq_tolerance(value, tolerance)) return true;
			return this.lt(value);
		}
		
		static lte_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.lte_tolerance(other, tolerance);
		}
		
		gt_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
			
			if (this.eq_tolerance(value, tolerance)) return false;
			return this.gt(value);
		}
		
		static gt_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.gt_tolerance(other, tolerance);
		}
		
		gte_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);
			
			if (this.eq_tolerance(value, tolerance)) return true;
			return this.gt(value);
		}
		
		static gte_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);
			
			return value.gte_tolerance(other, tolerance);
		}
		
		log10() {
			return this.exponent + Math.log10(this.mantissa);
		}
		
		static log10(value) {
			value = Decimal.fromValue(value);
			
			return value.log10();
		}
		
		log(base) {
			//UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater). We assume this to be true and thus only need to return a number, not a Decimal, and don't do any other kind of error checking.
			return (Math.LN10/Math.log(base))*this.log10();
		}
		
		static log(value, base) {
			value = Decimal.fromValue(value);
			
			return value.log(base);
		}
		
		log2() {
			return 3.32192809488736234787*this.log10();
		}
		
		static log2(value) {
			value = Decimal.fromValue(value);
			
			return value.log2();
		}
		
		ln() {
			return 2.30258509299404568402*this.log10();
		}
		
		static ln(value) {
			value = Decimal.fromValue(value);
			
			return value.ln();
		}
		
		logarithm(base) {
			return this.log(base);
		}
		
		static logarithm(value, base) {
			value = Decimal.fromValue(value);
			
			return value.logarithm(base);
		}
		
		pow(value) {
			//UN-SAFETY: Accuracy not guaranteed beyond ~9~11 decimal places.
			
			if (value instanceof Decimal) { value = value.toNumber(); }
			
			//TODO: Fast track seems about neutral for performance. It might become faster if an integer pow is implemented, or it might not be worth doing (see https://github.com/Patashu/break_infinity.js/issues/4 )
			
			//Fast track: If (this.exponent*value) is an integer and mantissa^value fits in a Number, we can do a very fast method.
			var temp = this.exponent*value;
			if (Number.isSafeInteger(temp))
			{
				var newMantissa = Math.pow(this.mantissa, value);
				if (Number.isFinite(newMantissa))
				{
					return Decimal.fromMantissaExponent(newMantissa, temp);
				}
			}
			
			//return Decimal.exp(value*this.ln());
			return Decimal.pow10(value*this.log10()); //this is 2x faster and gives same values AFAIK
		}
		
		static pow10(value) {
			if (Number.isInteger(value))
			{
				return Decimal.fromMantissaExponent_noNormalize(1,value);
			}
			return Decimal.fromMantissaExponent(Math.pow(10,value%1),Math.trunc(value));
		}
		
		pow_base(value) {
			value = Decimal.fromValue(value);
			
			return value.pow(this);
		}
		
		static pow(value, other) {
			//Fast track: 10^integer
			if (value == 10 && Number.isInteger(other)) { return Decimal.fromMantissaExponent(1, other); }
			
			value = Decimal.fromValue(value);
			
			return value.pow(other);
		}
		
		factorial() {
			//Using Stirling's Approximation. https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
			
			var n = this.toNumber() + 1;
			
			return Decimal.pow((n/Math.E)*Math.sqrt(n*Math.sinh(1/n)+1/(810*Math.pow(n, 6))), n).mul(Math.sqrt(2*Math.PI/n));
		}
		
		exp() {
			//UN-SAFETY: Assuming this value is between [-2.1e15, 2.1e15]. Accuracy not guaranteed beyond ~9~11 decimal places.
			
			//Fast track: if -706 < this < 709, we can use regular exp.
			var x = this.toNumber();
			if (-706 < x && x < 709)
			{
				return Decimal.fromNumber(Math.exp(x));
			}
			else
			{
				//This has to be implemented fundamentally, so that pow(value) can be implemented on top of it.
				//Should be fast and accurate over the range [-2.1e15, 2.1e15]. Outside that it overflows, so we don't care about these cases.
				
				// Implementation from SpeedCrunch: https://bitbucket.org/heldercorreia/speedcrunch/src/9cffa7b674890affcb877bfebc81d39c26b20dcc/src/math/floatexp.c?at=master&fileviewer=file-view-default
				
				var exp, tmp, expx;
				
				exp = 0;
				expx = this.exponent;
				
				if (expx >= 0)
				{
					exp = Math.trunc(x/Math.LN10);
					tmp = exp*Math.LN10;
					x -= tmp;
					if (x >= Math.LN10)
					{
						++exp;
						x -= Math.LN10;
					}
				}
				if (x < 0)
				{
					--exp;
					x += Math.LN10;
				}
				
				//when we get here 0 <= x < ln 10
				x = Math.exp(x);
				
				if (exp != 0)
				{
					expx = Math.floor(exp); //TODO: or round, or even nothing? can it ever be non-integer?
					x = Decimal.fromMantissaExponent(x, expx);
				}
				
				return x;
			}
		}
		
		static exp(value) {
			value = Decimal.fromValue(value);
			
			return value.exp();
		}
		
		sqr() {
			return Decimal.fromMantissaExponent(Math.pow(this.mantissa, 2), this.exponent*2);
		}
		
		static sqr(value) {
			value = Decimal.fromValue(value);
			
			return value.sqr();
		}
		
		sqrt() {
			if (this.mantissa < 0) { return new Decimal(Number.NaN) };
			if (this.exponent % 2 != 0) { return Decimal.fromMantissaExponent(Math.sqrt(this.mantissa)*3.16227766016838, Math.floor(this.exponent/2)); } //mod of a negative number is negative, so != means '1 or -1'
			return Decimal.fromMantissaExponent(Math.sqrt(this.mantissa), Math.floor(this.exponent/2));
		}
		
		static sqrt(value) {
			value = Decimal.fromValue(value);
			
			return value.sqrt();
		}
		
		cube() {
			return Decimal.fromMantissaExponent(Math.pow(this.mantissa, 3), this.exponent*3);
		}
		
		static cube(value) {
			value = Decimal.fromValue(value);
			
			return value.cube();
		}
		
		cbrt() {
			var sign = 1;
			var mantissa = this.mantissa;
			if (mantissa < 0) { sign = -1; mantissa = -mantissa; };
			var newmantissa = sign*Math.pow(mantissa, (1/3));
			
			var mod = this.exponent % 3;
			if (mod == 1 || mod == -1) { return Decimal.fromMantissaExponent(newmantissa*2.1544346900318837, Math.floor(this.exponent/3)); }
			if (mod != 0) { return Decimal.fromMantissaExponent(newmantissa*4.6415888336127789, Math.floor(this.exponent/3)); } //mod != 0 at this point means 'mod == 2 || mod == -2'
			return Decimal.fromMantissaExponent(newmantissa, Math.floor(this.exponent/3));
		}
		
		static cbrt(value) {
			value = Decimal.fromValue(value);
			
			return value.cbrt();
		}
		
		//If you're willing to spend 'resourcesAvailable' and want to buy something with exponentially increasing cost each purchase (start at priceStart, multiply by priceRatio, already own currentOwned), how much of it can you buy? Adapted from Trimps source code.
		static affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned)
		{
			resourcesAvailable = Decimal.fromValue(resourcesAvailable);
			priceStart = Decimal.fromValue(priceStart);
			priceRatio = Decimal.fromValue(priceRatio);
			var actualStart = priceStart.mul(Decimal.pow(priceRatio, currentOwned));
			
			//return Math.floor(log10(((resourcesAvailable / (priceStart * Math.pow(priceRatio, currentOwned))) * (priceRatio - 1)) + 1) / log10(priceRatio));
		
			return Decimal.floor(Decimal.log10(((resourcesAvailable.div(actualStart)).mul((priceRatio.sub(1)))).add(1)) / (Decimal.log10(priceRatio)));
		}
		
		//How much resource would it cost to buy (numItems) items if you already have currentOwned, the initial price is priceStart and it multiplies by priceRatio each purchase?
		static sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned)
		{
			priceStart = Decimal.fromValue(priceStart);
			priceRatio = Decimal.fromValue(priceRatio);
			var actualStart = priceStart.mul(Decimal.pow(priceRatio, currentOwned));
			
			return (actualStart.mul(Decimal.sub(1,Decimal.pow(priceRatio,numItems)))).div(Decimal.sub(1,priceRatio));
		}
		
		//If you're willing to spend 'resourcesAvailable' and want to buy something with additively increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned), how much of it can you buy?
		static affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned)
		{
			resourcesAvailable = Decimal.fromValue(resourcesAvailable);
			priceStart = Decimal.fromValue(priceStart);
			priceAdd = Decimal.fromValue(priceAdd);
			currentOwned = Decimal.fromValue(currentOwned);
			var actualStart = priceStart.add(Decimal.mul(currentOwned,priceAdd));
			
			//n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
			//where a is actualStart, d is priceAdd and S is resourcesAvailable
			//then floor it and you're done!
			
			var b = actualStart.sub(priceAdd.div(2));
			var b2 = b.pow(2);
			
			return Decimal.floor(
			(b.neg().add(Decimal.sqrt(b2.add(Decimal.mul(priceAdd, resourcesAvailable).mul(2))))
			).div(priceAdd)
			);
			
			//return Decimal.floor(something);
		}
		
		//How much resource would it cost to buy (numItems) items if you already have currentOwned, the initial price is priceStart and it adds priceAdd each purchase? Adapted from http://www.mathwords.com/a/arithmetic_series.htm
		static sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned)
		{
			numItems = Decimal.fromValue(numItems);
			priceStart = Decimal.fromValue(priceStart);
			priceAdd = Decimal.fromValue(priceAdd);
			currentOwned = Decimal.fromValue(currentOwned);
			var actualStart = priceStart.add(Decimal.mul(currentOwned,priceAdd));
			
			//(n/2)*(2*a+(n-1)*d)
			
			return Decimal.div(numItems,2).mul(Decimal.mul(2,actualStart).plus(numItems.sub(1).mul(priceAdd)))
		}
		
		//Joke function from Realm Grinder
		ascensionPenalty(ascensions) {
			if (ascensions == 0) return this;
			return this.pow(Math.pow(10, -ascensions));
		}
		
		//When comparing two purchases that cost (resource) and increase your resource/sec by (delta_RpS), the lowest efficiency score is the better one to purchase. From Frozen Cookies: http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
		static efficiencyOfPurchase(cost, current_RpS, delta_RpS)
		{
			cost = Decimal.fromValue(cost);
			current_RpS = Decimal.fromValue(current_RpS);
			delta_RpS = Decimal.fromValue(delta_RpS);
			return Decimal.add(cost.div(current_RpS), cost.div(delta_RpS));
		}
		
		//Joke function from Cookie Clicker. It's 'egg'
		egg() { return this.add(9); }
        
        //  Porting some function from Decimal.js 
        lessThanOrEqualTo(other) {return this.cmp(other) < 1; }
        lessThan(other) {return this.cmp(other) < 0; }
        greaterThanOrEqualTo(other) { return this.cmp(other) > -1; }
        greaterThan(other) {return this.cmp(other) > 0; }


		static randomDecimalForTesting(absMaxExponent)
		{
			//NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
			//5% of the time, have a mantissa of 0
			if (Math.random()*20 < 1) { return Decimal.fromMantissaExponent(0, 0); }
			var mantissa = Math.random()*10;
			//10% of the time, have a simple mantissa
			if (Math.random()*10 < 1) { mantissa = Math.round(mantissa); }
			mantissa *= Math.sign(Math.random()*2-1);
			var exponent = Math.floor(Math.random()*absMaxExponent*2) - absMaxExponent;
			return Decimal.fromMantissaExponent(mantissa, exponent);
			
			/*
Examples:

randomly test pow:
			
var a = Decimal.randomDecimalForTesting(1000);
var pow = Math.random()*20-10;
if (Math.random()*2 < 1) { pow = Math.round(pow); }
var result = Decimal.pow(a, pow);
["(" + a.toString() + ")^" + pow.toString(), result.toString()]

randomly test add:

var a = Decimal.randomDecimalForTesting(1000);
var b = Decimal.randomDecimalForTesting(17);
var c = a.mul(b);
var result = a.add(c);
[a.toString() + "+" + c.toString(), result.toString()]
			*/
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
