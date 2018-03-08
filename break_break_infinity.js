//START pad-end ( https://www.npmjs.com/package/pad-end )

var padEnd = function (string, maxLength, fillString) {

  if (string == null || maxLength == null) {
    return string;
  }

  var result    = String(string);

  var length = result.length;
  if (length >= maxLength) {
    return result;
  }

  var filled = fillString == null ? '' : String(fillString);
  if (filled === '') {
    filled = ' ';
  }

  var fillLen = maxLength - length;

  while (filled.length < fillLen) {
    filled += filled;
  }

  var truncated = filled.length > fillLen ? filled.substr(0, fillLen) : filled;

  return result + truncated;
};

//END pad-end

//IE6 shims

Math.log10 = Math.log10 || function(x) {
	return Math.log(x) * Math.LOG10E;
};

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

Number.isSafeInteger = Number.isSafeInteger || function (value) {
   return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
};

//TODO: Import big integer instead of just pasting it here
//big integer benchmark: http://yaffle.github.io/BigInteger/benchmark/
//Going with https://github.com/Yaffle/BigInteger as it has incredibly fast create-10, add, mul, div and toString

!function(r){"use strict";function t(r,t,n,e){this.sign=r,this.magnitude=t,this.length=n,this.value=e}function n(){}for(var e=function(r,t,n,e){for(var i=t-1,a=0,u=10>e?e:10;++i<n;){var o=r.charCodeAt(i),f=o-48;if((0>f||f>=u)&&(f=-55+o,(10>f||f>=e)&&(f=-87+o,10>f||f>=e)))throw new RangeError;a=a*e+f}return a},i=function(r){for(var t=new Array(r),n=-1;++n<r;)t[n]=0;return t},a=function(r,t){for(var n=1,e=r,i=t;i>1;){var a=Math.floor(i/2);2*a!==i&&(n*=e),e*=e,i=a}return n*e},u=2/9007199254740992;1+u/2!==1;)u/=2;for(var o=2/u,f=134217728;2/u>f*f;)f*=2;var g=f+1,v=function(r,t,n){var e=g*r,i=e-(e-r),a=r-i,u=g*t,o=u-(u-t),f=t-o,v=i*o+n+i*f+a*o+a*f;return v},d=function(r){var t=r-o+o;return t>r?t-1:t},h=function(r,t,n){var e=t*n,i=v(t,n,-e),a=d(e/o),u=e-a*o+i;return 0>u&&(u+=o,a-=1),u+=r-o,0>u?u+=o:a+=1,{lo:u,hi:a}},l=function(r,t,n){if(r>=n)throw new RangeError;var e=r*o,i=d(e/n),a=0-v(i,n,-e);0>a&&(i-=1,a+=n),a+=t-n,0>a?a+=n:i+=1;var u=d(a/n);return a-=u*n,i+=u,{q:i,r:a}},m=function(r,n,e,i){return new t(r,n,e,i)};t.parseInt=function(r,t){if(void 0==t&&(t=10),10!==t&&(2>t||t>36||t!==Math.floor(t)))throw new RangeError("radix argument must be an integer between 2 and 36");var n=r.length;if(0===n)throw new RangeError;var u=0,f=r.charCodeAt(0),g=0;if(43===f&&(g=1),45===f&&(g=1,u=1),n-=g,0===n)throw new RangeError;if(a(t,n)<=o){var v=e(r,g,g+n,t);return m(0===v?0:u,void 0,0===v?0:1,v)}for(var l=0,c=1,s=d(o/t);s>=c;)l+=1,c*=t;for(var p=Math.floor((n-1)/l)+1,y=i(p),b=p,w=n;w>0;)b-=1,y[b]=e(r,g+(w>l?w-l:0),g+w,t),w-=l;for(var R=-1;++R<p;){for(var E=y[R],A=-1;++A<R;){var I=h(E,y[A],c),M=I.lo,S=I.hi;y[A]=M,E=S}y[R]=E}for(;p>0&&0===y[p-1];)p-=1;return m(0===p?0:u,y,p,y[0])};var c=function(r,t){if(r.length!==t.length)return r.length<t.length?-1:1;for(var n=r.length;--n>=0;)if((void 0==r.magnitude?r.value:r.magnitude[n])!==(void 0==t.magnitude?t.value:t.magnitude[n]))return(void 0==r.magnitude?r.value:r.magnitude[n])<(void 0==t.magnitude?t.value:t.magnitude[n])?-1:1;return 0};t.prototype.compareTo=function(r){var t=this,n=t.sign===r.sign?c(t,r):1;return 1===t.sign?0-n:n},t.prototype.addAndSubtract=function(r,t){var n=this,e=c(n,r),a=0>e?0!==t?1-r.sign:r.sign:n.sign,u=0>e?n:r,f=0>e?r:n;if(0===u.length)return m(a,f.magnitude,f.length,f.value);var g=0,v=f.length;if(n.sign!==(0!==t?1-r.sign:r.sign)){if(g=1,u.length===v)for(;v>0&&(void 0==u.magnitude?u.value:u.magnitude[v-1])===(void 0==f.magnitude?f.value:f.magnitude[v-1]);)v-=1;if(0===v)return m(0,i(0),0,0)}for(var d=i(v+(1-g)),h=-1,l=0;++h<v;){var s=h<u.length?void 0==u.magnitude?u.value:u.magnitude[h]:0;l+=(void 0==f.magnitude?f.value:f.magnitude[h])+(0!==g?0-s:s-o),0>l?(d[h]=o+l,l=0-g):(d[h]=l,l=1-g)}for(0!==l&&(d[v]=l,v+=1);v>0&&0===d[v-1];)v-=1;return m(a,d,v,d[0])},t.prototype.add=function(r){return this.addAndSubtract(r,0)},t.prototype.subtract=function(r){return this.addAndSubtract(r,1)},t.prototype.multiply=function(r){var t=this;if(0===t.length||0===r.length)return m(0,i(0),0,0);var n=1===t.sign?1-r.sign:r.sign;if(1===t.length&&1===(void 0==t.magnitude?t.value:t.magnitude[0]))return m(n,r.magnitude,r.length,r.value);if(1===r.length&&1===(void 0==r.magnitude?r.value:r.magnitude[0]))return m(n,t.magnitude,t.length,t.value);for(var e=t.length+r.length,a=i(e),u=-1;++u<r.length;){for(var f=0,g=-1;++g<t.length;){var v=0;f+=a[g+u]-o,f>=0?v=1:f+=o;var d=h(f,void 0==t.magnitude?t.value:t.magnitude[g],void 0==r.magnitude?r.value:r.magnitude[u]),l=d.lo,c=d.hi;a[g+u]=l,f=c+v}a[t.length+u]=f}for(;e>0&&0===a[e-1];)e-=1;return m(n,a,e,a[0])},t.prototype.divideAndRemainder=function(r,t){var n=this;if(0===r.length)throw new RangeError;if(0===n.length)return m(0,i(0),0,0);var e=1===n.sign?1-r.sign:r.sign;if(1===r.length&&1===(void 0==r.magnitude?r.value:r.magnitude[0]))return 0!==t?m(e,n.magnitude,n.length,n.value):m(0,i(0),0,0);for(var a=n.length+1,u=i(a+r.length+1),f=u,g=u,v=-1;++v<n.length;)g[v]=void 0==n.magnitude?n.value:n.magnitude[v];for(var c=-1;++c<r.length;)f[a+c]=void 0==r.magnitude?r.value:r.magnitude[c];var s=f[a+r.length-1],p=1;if(r.length>1){if(p=d(o/(s+1)),p>1){for(var y=0,b=-1;++b<a+r.length;){var w=h(y,u[b],p),R=w.lo,E=w.hi;u[b]=R,y=E}u[a+r.length]=y,s=f[a+r.length-1]}if(s<d(o/2))throw new RangeError}var A=n.length-r.length+1;0>A&&(A=0);for(var I=void 0,M=0,S=A;--S>=0;){var N=r.length+S,q=o-1;if(g[N]!==s){var T=l(g[N],g[N-1],s),x=T.q;q=x}for(var B=0,C=0,j=S-1;++j<=N;){var k=g[j],z=h(C,q,f[a+j-S]),D=z.lo,F=z.hi;g[j]=D,C=F,B+=k-g[j],0>B?(g[j]=o+B,B=-1):(g[j]=B,B=0)}for(;0!==B;){q-=1;for(var G=0,H=S-1;++H<=N;)G+=g[H]-o+f[a+H-S],0>G?(g[H]=o+G,G=0):(g[H]=G,G=1);B+=G}0!==t&&0!==q&&(0===M&&(M=S+1,I=i(M)),I[S]=q)}if(0!==t)return 0===M?m(0,i(0),0,0):m(e,I,M,I[0]);var J=n.length+1;if(p>1){for(var K=0,L=J;--L>=0;){var O=l(K,g[L],p),P=O.q,Q=O.r;g[L]=P,K=Q}if(0!==K)throw new RangeError}for(;J>0&&0===g[J-1];)J-=1;if(0===J)return m(0,i(0),0,0);for(var U=i(J),V=-1;++V<J;)U[V]=g[V];return m(n.sign,U,J,U[0])},t.prototype.divide=function(r){return this.divideAndRemainder(r,1)},t.prototype.remainder=function(r){return this.divideAndRemainder(r,0)},t.prototype.negate=function(){var r=this;return m(0===r.length?r.sign:1-r.sign,r.magnitude,r.length,r.value)},t.prototype.toString=function(r){if(void 0==r&&(r=10),10!==r&&(2>r||r>36||r!==Math.floor(r)))throw new RangeError("radix argument must be an integer between 2 and 36");var t=this,n=1===t.sign?"-":"",e=t.length;if(0===e)return"0";if(1===e)return n+=(void 0==t.magnitude?t.value:t.magnitude[0]).toString(r);for(var a=0,u=1,f=d(o/r);f>=u;)a+=1,u*=r;if(o>=u*r)throw new RangeError;for(var g=e+Math.floor((e-1)/a)+1,v=i(g),h=-1;++h<e;)v[h]=void 0==t.magnitude?t.value:t.magnitude[h];for(var m=g;0!==e;){for(var c=0,s=e;--s>=0;){var p=l(c,v[s],u),y=p.q,b=p.r;v[s]=y,c=b}for(;e>0&&0===v[e-1];)e-=1;m-=1,v[m]=c}for(n+=v[m].toString(r);++m<g;){for(var w=v[m].toString(r),R=a-w.length;--R>=0;)n+="0";n+=w}return n},t.fromNumber=function(r){return m(0>r?1:0,void 0,0===r?0:1,0>r?0-r:0+r)},t.prototype.toNumber=function(){return 0===this.length?0:1===this.length?1===this.sign?0-this.value:this.value:this};var s=function(r,n){try{}catch(e){}return t.parseInt(r,n)},p=function(r){return"number"==typeof r?t.fromNumber(r):r},y=function(r,t){try{}catch(n){}var e=p(r),i=p(t);return e.compareTo(i)},b=function(r){return r.toNumber()},w=function(r,t){try{}catch(n){}var e=p(r),i=p(t);return b(e.add(i))},R=function(r,t){try{}catch(n){}var e=p(r),i=p(t);return b(e.subtract(i))},E=function(r,t){try{}catch(n){}var e=p(r),i=p(t);return b(e.multiply(i))},A=function(r,t){try{}catch(n){}var e=p(r),i=p(t);return b(e.divide(i))},I=function(r,t){try{}catch(n){}var e=p(r),i=p(t);return b(e.remainder(i))},M=function(r){try{}catch(t){}var n=p(r);return b(n.negate())};n.parseInt=function(r,t){if("string"==typeof r&&"number"==typeof t){var n=0+Number.parseInt(r,t);if(n>=-9007199254740991&&9007199254740991>=n)return n}return s(r,t)},n.compareTo=function(r,t){return"number"==typeof r&&"number"==typeof t?t>r?-1:r>t?1:0:y(r,t)},n.add=function(r,t){if("number"==typeof r&&"number"==typeof t){var n=r+t;if(n>=-9007199254740991&&9007199254740991>=n)return n}return w(r,t)},n.subtract=function(r,t){if("number"==typeof r&&"number"==typeof t){var n=r-t;if(n>=-9007199254740991&&9007199254740991>=n)return n}return R(r,t)},n.multiply=function(r,t){if("number"==typeof r&&"number"==typeof t){var n=0+r*t;if(n>=-9007199254740991&&9007199254740991>=n)return n}return E(r,t)},n.divide=function(r,t){return"number"==typeof r&&"number"==typeof t&&0!==t?0===r?0:r>0&&t>0||0>r&&0>t?0+Math.floor(r/t):0-Math.floor((0-r)/t):A(r,t)},n.remainder=function(r,t){return"number"==typeof r&&"number"==typeof t&&0!==t?0+r%t:I(r,t)},n.negate=function(r){return"number"==typeof r?0-r:M(r)},r.BigInteger=n,r.BigIntegerInternal=t}(this);

//END big integer

//START decimal.js repurposed into ExpHelper ( https://github.com/MikeMcl/decimal.js/ )

!function(n){"use strict";function r(n){var r,t,e,i=n.length-1,o="",s=n[0];if(i>0){for(o+=s,r=1;i>r;r++)e=n[r]+"",t=Z-e.length,t&&(o+=u(t)),o+=e;s=n[r],e=s+"",t=Z-e.length,t&&(o+=u(t))}else if(0===s)return"0";for(;s%10===0;)s/=10;return o+s}function t(n,r,t){if(n!==~~n||r>n||n>t)throw Error(T+n)}function e(n,r,t,e){var i,o,s,u,f,c,h,d,l,a=n.constructor;n:if(null!=r){if(d=n.d,!d)return n;for(i=1,u=d[0];u>=10;u/=10)i++;if(o=r-i,0>o)o+=Z,s=r,h=d[l=0],f=h/C(10,i-s-1)%10|0;else if(l=Math.ceil((o+1)/Z),u=d.length,l>=u){if(!e)break n;for(;u++<=l;)d.push(0);h=f=0,i=1,o%=Z,s=o-Z+1}else{for(h=u=d[l],i=1;u>=10;u/=10)i++;o%=Z,s=o-Z+i,f=0>s?0:h/C(10,i-s-1)%10|0}if(e=e||0>r||void 0!==d[l+1]||(0>s?h:h%C(10,i-s-1)),c=4>t?(f||e)&&(0==t||t==(n.s<0?3:2)):f>5||5==f&&(4==t||e||6==t&&(o>0?s>0?h/C(10,i-s):0:d[l-1])%10&1||t==(n.s<0?8:7)),1>r||!d[0])return d.length=0,c?(r-=n.e+1,d[0]=C(10,(Z-r%Z)%Z),n.e=-r||0):d[0]=n.e=0,n;if(0==o?(d.length=l,u=1,l--):(d.length=l+1,u=C(10,Z-o),d[l]=s>0?(h/C(10,i-s)%C(10,s)|0)*u:0),c)for(;;){if(0==l){for(o=1,s=d[0];s>=10;s/=10)o++;for(s=d[0]+=u,u=1;s>=10;s/=10)u++;o!=u&&(n.e++,d[0]==S&&(d[0]=1));break}if(d[l]+=u,d[l]!=S)break;d[l--]=0,u=1}for(o=d.length;0===d[--o];)d.pop()}return F&&(n.e>a.maxE?(n.d=null,n.e=NaN):n.e<a.minE&&(n.e=0,n.d=[0])),n}function i(n,t,e){if(!n.isFinite())return c(n);var i,o=n.e,s=r(n.d),f=s.length;return t?(e&&(i=e-f)>0?s=s.charAt(0)+"."+s.slice(1)+u(i):f>1&&(s=s.charAt(0)+"."+s.slice(1)),s=s+(n.e<0?"e":"e+")+n.e):0>o?(s="0."+u(-o-1)+s,e&&(i=e-f)>0&&(s+=u(i))):o>=f?(s+=u(o+1-f),e&&(i=e-o-1)>0&&(s=s+"."+u(i))):((i=o+1)<f&&(s=s.slice(0,i)+"."+s.slice(i)),e&&(i=e-f)>0&&(o+1===f&&(s+="."),s+=u(i))),s}function o(n,r){var t=n[0];for(r*=Z;t>=10;t/=10)r++;return r}function s(n){var r=n.length-1,t=r*Z+1;if(r=n[r]){for(;r%10==0;r/=10)t--;for(r=n[0];r>=10;r/=10)t++}return t}function u(n){for(var r="";n--;)r+="0";return r}function f(n,r,t){for(var e,i=new n(r[0]),o=0;++o<r.length;){if(e=new n(r[o]),!e.s){i=e;break}i[t](e)&&(i=e)}return i}function c(n){return String(n.s*n.s/0)}function h(n,r){var t,e,i;for((t=r.indexOf("."))>-1&&(r=r.replace(".","")),(e=r.search(/e/i))>0?(0>t&&(t=e),t+=+r.slice(e+1),r=r.substring(0,e)):0>t&&(t=r.length),e=0;48===r.charCodeAt(e);e++);for(i=r.length;48===r.charCodeAt(i-1);--i);if(r=r.slice(e,i)){if(i-=e,n.e=t=t-e-1,n.d=[],e=(t+1)%Z,0>t&&(e+=Z),i>e){for(e&&n.d.push(+r.slice(0,e)),i-=Z;i>e;)n.d.push(+r.slice(e,e+=Z));r=r.slice(e),e=Z-r.length}else e-=i;for(;e--;)r+="0";n.d.push(+r),F&&(n.e>n.constructor.maxE?(n.d=null,n.e=NaN):n.e<n.constructor.minE&&(n.e=0,n.d=[0]))}else n.e=0,n.d=[0];return n}function d(n,r){if("Infinity"===r||"NaN"===r)return+r||(n.s=NaN),n.e=NaN,n.d=null,n;throw Error(T+r)}function l(n){return new this(n).abs()}function a(n,r){return new this(n).plus(r)}function g(n){return e(n=new this(n),n.e+1,2)}function v(n){if(!n||"object"!=typeof n)throw Error(I+"Object expected");var r,t,e,i=["precision",1,U,"rounding",0,8,"toExpNeg",-R,0,"toExpPos",0,R,"maxE",0,R,"minE",-R,0,"modulo",0,9];for(r=0;r<i.length;r+=3)if(void 0!==(e=n[t=i[r]])){if(!(k(e)===e&&e>=i[r+1]&&e<=i[r+2]))throw Error(T+t+": "+e);this[t]=e}if(void 0!==(e=n[t="crypto"])){if(e!==!0&&e!==!1&&0!==e&&1!==e)throw Error(T+t+": "+e);if(e){if("undefined"==typeof crypto||!crypto||!crypto.getRandomValues&&!crypto.randomBytes)throw Error(H);this[t]=!0}else this[t]=!1}return this}function p(n){function r(n){var t,e,i,o=this;if(!(o instanceof r))return new r(n);if(o.constructor=r,n instanceof r)return o.s=n.s,o.e=n.e,void(o.d=(n=n.d)?n.slice():n);if(i=typeof n,"number"===i){if(0===n)return o.s=0>1/n?-1:1,o.e=0,void(o.d=[0]);if(0>n?(n=-n,o.s=-1):o.s=1,n===~~n&&1e7>n){for(t=0,e=n;e>=10;e/=10)t++;return o.e=t,void(o.d=[n])}return 0*n!==0?(n||(o.s=NaN),o.e=NaN,void(o.d=null)):h(o,n.toString())}if("string"!==i)throw Error(T+n);return 45===n.charCodeAt(0)?(n=n.slice(1),o.s=-1):o.s=1,M.test(n)?h(o,n):d(o,n)}var t,e,i;if(r.prototype=q,r.ROUND_UP=0,r.ROUND_DOWN=1,r.ROUND_CEIL=2,r.ROUND_FLOOR=3,r.ROUND_HALF_UP=4,r.ROUND_HALF_DOWN=5,r.ROUND_HALF_EVEN=6,r.ROUND_HALF_CEIL=7,r.ROUND_HALF_FLOOR=8,r.EUCLID=9,r.config=r.set=v,r.clone=p,r.abs=l,r.add=a,r.ceil=g,r.div=N,r.floor=w,r.max=m,r.min=E,r.mod=x,r.mul=O,r.round=b,r.sign=y,r.sub=D,r.trunc=P,void 0===n&&(n={}),n)for(i=["precision","rounding","toExpNeg","toExpPos","maxE","minE","modulo","crypto"],t=0;t<i.length;)n.hasOwnProperty(e=i[t++])||(n[e]=this[e]);return r.config(n),r}function N(n,r){return new this(n).div(r)}function w(n){return e(n=new this(n),n.e+1,3)}function m(){return f(this,arguments,"lt")}function E(){return f(this,arguments,"gt")}function x(n,r){return new this(n).mod(r)}function O(n,r){return new this(n).mul(r)}function b(n){return e(n=new this(n),n.e+1,this.rounding)}function y(n){return n=new this(n),n.d?n.d[0]?n.s:0*n.s:n.s||NaN}function D(n,r){return new this(n).sub(r)}function P(n){return e(n=new this(n),n.e+1,1)}var _,R=9e15,U=1e9,L="2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058",A={precision:20,rounding:4,modulo:1,toExpNeg:-7,toExpPos:21,minE:-R,maxE:R,crypto:!1},F=!0,I="[DecimalError] ",T=I+"Invalid argument: ",H=I+"crypto unavailable",k=Math.floor,C=Math.pow,M=/^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,S=1e7,Z=7,q=(L.length-1,{});q.absoluteValue=q.abs=function(){var n=new this.constructor(this);return n.s<0&&(n.s=1),e(n)},q.ceil=function(){return e(new this.constructor(this),this.e+1,2)},q.comparedTo=q.cmp=function(n){var r,t,e,i,o=this,s=o.d,u=(n=new o.constructor(n)).d,f=o.s,c=n.s;if(!s||!u)return f&&c?f!==c?f:s===u?0:!s^0>f?1:-1:NaN;if(!s[0]||!u[0])return s[0]?f:u[0]?-c:0;if(f!==c)return f;if(o.e!==n.e)return o.e>n.e^0>f?1:-1;for(e=s.length,i=u.length,r=0,t=i>e?e:i;t>r;++r)if(s[r]!==u[r])return s[r]>u[r]^0>f?1:-1;return e===i?0:e>i^0>f?1:-1},q.decimalPlaces=q.dp=function(){var n,r=this.d,t=NaN;if(r){if(n=r.length-1,t=(n-k(this.e/Z))*Z,n=r[n])for(;n%10==0;n/=10)t--;0>t&&(t=0)}return t},q.dividedBy=q.div=function(n){return B(this,new this.constructor(n))},q.dividedToIntegerBy=q.divToInt=function(n){var r=this,t=r.constructor;return e(B(r,new t(n),0,1,1),t.precision,t.rounding)},q.equals=q.eq=function(n){return 0===this.cmp(n)},q.floor=function(){return e(new this.constructor(this),this.e+1,3)},q.greaterThan=q.gt=function(n){return this.cmp(n)>0},q.greaterThanOrEqualTo=q.gte=function(n){var r=this.cmp(n);return 1==r||0===r},q.isFinite=function(){return!!this.d},q.isInteger=q.isInt=function(){return!!this.d&&k(this.e/Z)>this.d.length-2},q.isNaN=function(){return!this.s},q.isNegative=q.isNeg=function(){return this.s<0},q.isPositive=q.isPos=function(){return this.s>0},q.isZero=function(){return!!this.d&&0===this.d[0]},q.lessThan=q.lt=function(n){return this.cmp(n)<0},q.lessThanOrEqualTo=q.lte=function(n){return this.cmp(n)<1},q.minus=q.sub=function(n){var r,t,i,s,u,f,c,h,d,l,a,g,v=this,p=v.constructor;if(n=new p(n),!v.d||!n.d)return v.s&&n.s?v.d?n.s=-n.s:n=new p(n.d||v.s!==n.s?v:NaN):n=new p(NaN),n;if(v.s!=n.s)return n.s=-n.s,v.plus(n);if(d=v.d,g=n.d,c=p.precision,h=p.rounding,!d[0]||!g[0]){if(g[0])n.s=-n.s;else{if(!d[0])return new p(3===h?-0:0);n=new p(v)}return F?e(n,c,h):n}if(t=k(n.e/Z),l=k(v.e/Z),d=d.slice(),u=l-t){for(a=0>u,a?(r=d,u=-u,f=g.length):(r=g,t=l,f=d.length),i=Math.max(Math.ceil(c/Z),f)+2,u>i&&(u=i,r.length=1),r.reverse(),i=u;i--;)r.push(0);r.reverse()}else{for(i=d.length,f=g.length,a=f>i,a&&(f=i),i=0;f>i;i++)if(d[i]!=g[i]){a=d[i]<g[i];break}u=0}for(a&&(r=d,d=g,g=r,n.s=-n.s),f=d.length,i=g.length-f;i>0;--i)d[f++]=0;for(i=g.length;i>u;){if(d[--i]<g[i]){for(s=i;s&&0===d[--s];)d[s]=S-1;--d[s],d[i]+=S}d[i]-=g[i]}for(;0===d[--f];)d.pop();for(;0===d[0];d.shift())--t;return d[0]?(n.d=d,n.e=o(d,t),F?e(n,c,h):n):new p(3===h?-0:0)},q.modulo=q.mod=function(n){var r,t=this,i=t.constructor;return n=new i(n),!t.d||!n.s||n.d&&!n.d[0]?new i(NaN):!n.d||t.d&&!t.d[0]?e(new i(t),i.precision,i.rounding):(F=!1,9==i.modulo?(r=B(t,n.abs(),0,3,1),r.s*=n.s):r=B(t,n,0,i.modulo,1),r=r.times(n),F=!0,t.minus(r))},q.negated=q.neg=function(){var n=new this.constructor(this);return n.s=-n.s,e(n)},q.plus=q.add=function(n){var r,t,i,s,u,f,c,h,d,l,a=this,g=a.constructor;if(n=new g(n),!a.d||!n.d)return a.s&&n.s?a.d||(n=new g(n.d||a.s===n.s?a:NaN)):n=new g(NaN),n;if(a.s!=n.s)return n.s=-n.s,a.minus(n);if(d=a.d,l=n.d,c=g.precision,h=g.rounding,!d[0]||!l[0])return l[0]||(n=new g(a)),F?e(n,c,h):n;if(u=k(a.e/Z),i=k(n.e/Z),d=d.slice(),s=u-i){for(0>s?(t=d,s=-s,f=l.length):(t=l,i=u,f=d.length),u=Math.ceil(c/Z),f=u>f?u+1:f+1,s>f&&(s=f,t.length=1),t.reverse();s--;)t.push(0);t.reverse()}for(f=d.length,s=l.length,0>f-s&&(s=f,t=l,l=d,d=t),r=0;s;)r=(d[--s]=d[s]+l[s]+r)/S|0,d[s]%=S;for(r&&(d.unshift(r),++i),f=d.length;0==d[--f];)d.pop();return n.d=d,n.e=o(d,i),F?e(n,c,h):n},q.precision=q.sd=function(n){var r,t=this;if(void 0!==n&&n!==!!n&&1!==n&&0!==n)throw Error(T+n);return t.d?(r=s(t.d),n&&t.e+1>r&&(r=t.e+1)):r=NaN,r},q.round=function(){var n=this,r=n.constructor;return e(new r(n),n.e+1,r.rounding)},q.times=q.mul=function(n){var r,t,i,s,u,f,c,h,d,l=this,a=l.constructor,g=l.d,v=(n=new a(n)).d;if(n.s*=l.s,!(g&&g[0]&&v&&v[0]))return new a(!n.s||g&&!g[0]&&!v||v&&!v[0]&&!g?NaN:g&&v?0*n.s:n.s/0);for(t=k(l.e/Z)+k(n.e/Z),h=g.length,d=v.length,d>h&&(u=g,g=v,v=u,f=h,h=d,d=f),u=[],f=h+d,i=f;i--;)u.push(0);for(i=d;--i>=0;){for(r=0,s=h+i;s>i;)c=u[s]+v[i]*g[s-i-1]+r,u[s--]=c%S|0,r=c/S|0;u[s]=(u[s]+r)%S|0}for(;!u[--f];)u.pop();return r?++t:u.shift(),n.d=u,n.e=o(u,t),F?e(n,a.precision,a.rounding):n},q.toDecimalPlaces=q.toDP=function(n,r){var i=this,o=i.constructor;return i=new o(i),void 0===n?i:(t(n,0,U),void 0===r?r=o.rounding:t(r,0,8),e(i,n+i.e+1,r))},q.toExponential=function(n,r){var o,s=this,u=s.constructor;return void 0===n?o=i(s,!0):(t(n,0,U),void 0===r?r=u.rounding:t(r,0,8),s=e(new u(s),n+1,r),o=i(s,!0,n+1)),s.isNeg()&&!s.isZero()?"-"+o:o},q.toFixed=function(n,r){var o,s,u=this,f=u.constructor;return void 0===n?o=i(u):(t(n,0,U),void 0===r?r=f.rounding:t(r,0,8),s=e(new f(u),n+u.e+1,r),o=i(s,!1,n+s.e+1)),u.isNeg()&&!u.isZero()?"-"+o:o},q.toNearest=function(n,r){var i=this,o=i.constructor;if(i=new o(i),null==n){if(!i.d)return i;n=new o(1),r=o.rounding}else{if(n=new o(n),void 0!==r&&t(r,0,8),!i.d)return n.s?i:n;if(!n.d)return n.s&&(n.s=i.s),n}return n.d[0]?(F=!1,4>r&&(r=[4,5,7,8][r]),i=B(i,n,0,r,1).times(n),F=!0,e(i)):(n.s=i.s,i=n),i},q.toNumber=function(){return+this},q.toPrecision=function(n,r){var o,s=this,u=s.constructor;return void 0===n?o=i(s,s.e<=u.toExpNeg||s.e>=u.toExpPos):(t(n,1,U),void 0===r?r=u.rounding:t(r,0,8),s=e(new u(s),n,r),o=i(s,n<=s.e||s.e<=u.toExpNeg,n)),s.isNeg()&&!s.isZero()?"-"+o:o},q.toSignificantDigits=q.toSD=function(n,r){var i=this,o=i.constructor;return void 0===n?(n=o.precision,r=o.rounding):(t(n,1,U),void 0===r?r=o.rounding:t(r,0,8)),e(new o(i),n,r)},q.toString=function(){var n=this,r=n.constructor,t=i(n,n.e<=r.toExpNeg||n.e>=r.toExpPos);return n.isNeg()&&!n.isZero()?"-"+t:t},q.truncated=q.trunc=function(){return e(new this.constructor(this),this.e+1,1)},q.valueOf=q.toJSON=function(){var n=this,r=n.constructor,t=i(n,n.e<=r.toExpNeg||n.e>=r.toExpPos);return n.isNeg()?"-"+t:t};var B=function(){function n(n,r,t){var e,i=0,o=n.length;for(n=n.slice();o--;)e=n[o]*r+i,n[o]=e%t|0,i=e/t|0;return i&&n.unshift(i),n}function r(n,r,t,e){var i,o;if(t!=e)o=t>e?1:-1;else for(i=o=0;t>i;i++)if(n[i]!=r[i]){o=n[i]>r[i]?1:-1;break}return o}function t(n,r,t,e){for(var i=0;t--;)n[t]-=i,i=n[t]<r[t]?1:0,n[t]=i*e+n[t]-r[t];for(;!n[0]&&n.length>1;)n.shift()}return function(i,o,s,u,f,c){var h,d,l,a,g,v,p,N,w,m,E,x,O,b,y,D,P,R,U,L,A=i.constructor,F=i.s==o.s?1:-1,I=i.d,T=o.d;if(!(I&&I[0]&&T&&T[0]))return new A(i.s&&o.s&&(I?!T||I[0]!=T[0]:T)?I&&0==I[0]||!T?0*F:F/0:NaN);for(c?(g=1,d=i.e-o.e):(c=S,g=Z,d=k(i.e/g)-k(o.e/g)),U=T.length,P=I.length,w=new A(F),m=w.d=[],l=0;T[l]==(I[l]||0);l++);if(T[l]>(I[l]||0)&&d--,null==s?(b=s=A.precision,u=A.rounding):b=f?s+(i.e-o.e)+1:s,0>b)m.push(1),v=!0;else{if(b=b/g+2|0,l=0,1==U){for(a=0,T=T[0],b++;(P>l||a)&&b--;l++)y=a*c+(I[l]||0),m[l]=y/T|0,a=y%T|0;v=a||P>l}else{for(a=c/(T[0]+1)|0,a>1&&(T=n(T,a,c),I=n(I,a,c),U=T.length,P=I.length),D=U,E=I.slice(0,U),x=E.length;U>x;)E[x++]=0;L=T.slice(),L.unshift(0),R=T[0],T[1]>=c/2&&++R;do a=0,h=r(T,E,U,x),0>h?(O=E[0],U!=x&&(O=O*c+(E[1]||0)),a=O/R|0,a>1?(a>=c&&(a=c-1),p=n(T,a,c),N=p.length,x=E.length,h=r(p,E,N,x),1==h&&(a--,t(p,N>U?L:T,N,c))):(0==a&&(h=a=1),p=T.slice()),N=p.length,x>N&&p.unshift(0),t(E,p,x,c),-1==h&&(x=E.length,h=r(T,E,U,x),1>h&&(a++,t(E,x>U?L:T,x,c))),x=E.length):0===h&&(a++,E=[0]),m[l++]=a,h&&E[0]?E[x++]=I[D]||0:(E=[I[D]],x=1);while((D++<P||void 0!==E[0])&&b--);v=void 0!==E[0]}m[0]||m.shift()}if(1==g)w.e=d,_=v;else{for(l=1,a=m[0];a>=10;a/=10)l++;w.e=l+d*g-1,e(w,f?s+w.e+1:s,u,v)}return w}}();A=p(A),A["default"]=A.ExpHelper=A,L=new A(L),A.LN10=L,n.ExpHelper=A}(this);

//END decimal.js repurposed into ExpHelper
	
;(function (globalScope) {
	'use strict';
	
	/*
	
	# break_break_infinity.js
	A replacement for decimal.js for incremental games who want to deal with very large numbers (bigger in magnitude than 1.78e308, up to as much as 1e(1.79e308) ) and want to prioritize speed over accuracy.
	If you want to prioritize accuracy over speed, please use decimal.js instead.
	If you only need to handle numbers as big as 1e(9e15), use break_infinity.js instead.
	
	https://github.com/Patashu/break_infinity.js
	
	This library is open source and free to use/modify/fork for any purpose you want.
	
	By Patashu.
	
	---
	
	Decimal has only two fields:
	
	mantissa: A number (double) with absolute value between [1, 10) OR exactly 0. If mantissa is ever 10 or greater, it should be normalized (divide by 10 and add 1 to exponent until it is less than 10, or multiply by 10 and subtract 1 from exponent until it is 1 or greater). Infinity/-Infinity/NaN will cause bad things to happen.
	exponent: A big-integer between -EXP_LIMIT and EXP_LIMIT.
	
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
	
	Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.
	
	Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal
	
	*/
	
	var MAX_SIGNIFICANT_DIGITS = 17; //for example: if two exponents are more than 17 apart, consider adding them together pointless, just return the larger one
	var EXP_LIMIT = 1.79769e308; //putting something bigger than Number.MAX_VALUE here could work, but it'd require more changes to the library
	
	var NUMBER_EXP_MAX = 308; //the largest exponent that can appear in a Number, though not all mantissas are valid here.
	var NUMBER_EXP_MIN = -324; //The smallest exponent that can appear in a Number, though not all mantissas are valid here.
	
	var BIG_INT_0 = BigInteger.parseInt("0");
	var BIG_INT_1 = BigInteger.parseInt("1");
	var BIG_INT_MINUS_1 = BigInteger.parseInt("-1");
	var BIG_INT_MINUS_7 = BigInteger.parseInt("-7");
	var BIG_INT_14 = BigInteger.parseInt("14");
	var BIG_INT_21 = BigInteger.parseInt("21");
	var BIG_INT_EXP_MAX = BigInteger.parseInt("308");
	var BIG_INT_EXP_MIN = BigInteger.parseInt("-324");
	var BIG_INT_INFINITY = BigInteger.parseInt(padEnd("179769", 309, "0"));
	var BIG_INT_INFINITESIMAL = BIG_INT_INFINITY.negate();
	var BIG_INT_MAX_SIGNIFICANT_DIGITS = BigInteger.parseInt("17");
	
	//we need this lookup table because Math.pow(10, exponent) when exponent's absolute value is large is slightly inaccurate. you can fix it with the power of math... or just make a lookup table. faster AND simpler
	var powersof10 = [1e-323, 1e-322, 1e-321, 1e-320, 1e-319, 1e-318, 1e-317, 1e-316, 1e-315, 1e-314, 1e-313, 1e-312, 1e-311, 1e-310, 1e-309, 1e-308, 1e-307, 1e-306, 1e-305, 1e-304, 1e-303, 1e-302, 1e-301, 1e-300, 1e-299, 1e-298, 1e-297, 1e-296, 1e-295, 1e-294, 1e-293, 1e-292, 1e-291, 1e-290, 1e-289, 1e-288, 1e-287, 1e-286, 1e-285, 1e-284, 1e-283, 1e-282, 1e-281, 1e-280, 1e-279, 1e-278, 1e-277, 1e-276, 1e-275, 1e-274, 1e-273, 1e-272, 1e-271, 1e-270, 1e-269, 1e-268, 1e-267, 1e-266, 1e-265, 1e-264, 1e-263, 1e-262, 1e-261, 1e-260, 1e-259, 1e-258, 1e-257, 1e-256, 1e-255, 1e-254, 1e-253, 1e-252, 1e-251, 1e-250, 1e-249, 1e-248, 1e-247, 1e-246, 1e-245, 1e-244, 1e-243, 1e-242, 1e-241, 1e-240, 1e-239, 1e-238, 1e-237, 1e-236, 1e-235, 1e-234, 1e-233, 1e-232, 1e-231, 1e-230, 1e-229, 1e-228, 1e-227, 1e-226, 1e-225, 1e-224, 1e-223, 1e-222, 1e-221, 1e-220, 1e-219, 1e-218, 1e-217, 1e-216, 1e-215, 1e-214, 1e-213, 1e-212, 1e-211, 1e-210, 1e-209, 1e-208, 1e-207, 1e-206, 1e-205, 1e-204, 1e-203, 1e-202, 1e-201, 1e-200, 1e-199, 1e-198, 1e-197, 1e-196, 1e-195, 1e-194, 1e-193, 1e-192, 1e-191, 1e-190, 1e-189, 1e-188, 1e-187, 1e-186, 1e-185, 1e-184, 1e-183, 1e-182, 1e-181, 1e-180, 1e-179, 1e-178, 1e-177, 1e-176, 1e-175, 1e-174, 1e-173, 1e-172, 1e-171, 1e-170, 1e-169, 1e-168, 1e-167, 1e-166, 1e-165, 1e-164, 1e-163, 1e-162, 1e-161, 1e-160, 1e-159, 1e-158, 1e-157, 1e-156, 1e-155, 1e-154, 1e-153, 1e-152, 1e-151, 1e-150, 1e-149, 1e-148, 1e-147, 1e-146, 1e-145, 1e-144, 1e-143, 1e-142, 1e-141, 1e-140, 1e-139, 1e-138, 1e-137, 1e-136, 1e-135, 1e-134, 1e-133, 1e-132, 1e-131, 1e-130, 1e-129, 1e-128, 1e-127, 1e-126, 1e-125, 1e-124, 1e-123, 1e-122, 1e-121, 1e-120, 1e-119, 1e-118, 1e-117, 1e-116, 1e-115, 1e-114, 1e-113, 1e-112, 1e-111, 1e-110, 1e-109, 1e-108, 1e-107, 1e-106, 1e-105, 1e-104, 1e-103, 1e-102, 1e-101, 1e-100, 1e-99, 1e-98, 1e-97, 1e-96, 1e-95, 1e-94, 1e-93, 1e-92, 1e-91, 1e-90, 1e-89, 1e-88, 1e-87, 1e-86, 1e-85, 1e-84, 1e-83, 1e-82, 1e-81, 1e-80, 1e-79, 1e-78, 1e-77, 1e-76, 1e-75, 1e-74, 1e-73, 1e-72, 1e-71, 1e-70, 1e-69, 1e-68, 1e-67, 1e-66, 1e-65, 1e-64, 1e-63, 1e-62, 1e-61, 1e-60, 1e-59, 1e-58, 1e-57, 1e-56, 1e-55, 1e-54, 1e-53, 1e-52, 1e-51, 1e-50, 1e-49, 1e-48, 1e-47, 1e-46, 1e-45, 1e-44, 1e-43, 1e-42, 1e-41, 1e-40, 1e-39, 1e-38, 1e-37, 1e-36, 1e-35, 1e-34, 1e-33, 1e-32, 1e-31, 1e-30, 1e-29, 1e-28, 1e-27, 1e-26, 1e-25, 1e-24, 1e-23, 1e-22, 1e-21, 1e-20, 1e-19, 1e-18, 1e-17, 1e-16, 1e-15, 1e-14, 1e-13, 1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30, 1e31, 1e32, 1e33, 1e34, 1e35, 1e36, 1e37, 1e38, 1e39, 1e40, 1e41, 1e42, 1e43, 1e44, 1e45, 1e46, 1e47, 1e48, 1e49, 1e50, 1e51, 1e52, 1e53, 1e54, 1e55, 1e56, 1e57, 1e58, 1e59, 1e60, 1e61, 1e62, 1e63, 1e64, 1e65, 1e66, 1e67, 1e68, 1e69, 1e70, 1e71, 1e72, 1e73, 1e74, 1e75, 1e76, 1e77, 1e78, 1e79, 1e80, 1e81, 1e82, 1e83, 1e84, 1e85, 1e86, 1e87, 1e88, 1e89, 1e90, 1e91, 1e92, 1e93, 1e94, 1e95, 1e96, 1e97, 1e98, 1e99, 1e100, 1e101, 1e102, 1e103, 1e104, 1e105, 1e106, 1e107, 1e108, 1e109, 1e110, 1e111, 1e112, 1e113, 1e114, 1e115, 1e116, 1e117, 1e118, 1e119, 1e120, 1e121, 1e122, 1e123, 1e124, 1e125, 1e126, 1e127, 1e128, 1e129, 1e130, 1e131, 1e132, 1e133, 1e134, 1e135, 1e136, 1e137, 1e138, 1e139, 1e140, 1e141, 1e142, 1e143, 1e144, 1e145, 1e146, 1e147, 1e148, 1e149, 1e150, 1e151, 1e152, 1e153, 1e154, 1e155, 1e156, 1e157, 1e158, 1e159, 1e160, 1e161, 1e162, 1e163, 1e164, 1e165, 1e166, 1e167, 1e168, 1e169, 1e170, 1e171, 1e172, 1e173, 1e174, 1e175, 1e176, 1e177, 1e178, 1e179, 1e180, 1e181, 1e182, 1e183, 1e184, 1e185, 1e186, 1e187, 1e188, 1e189, 1e190, 1e191, 1e192, 1e193, 1e194, 1e195, 1e196, 1e197, 1e198, 1e199, 1e200, 1e201, 1e202, 1e203, 1e204, 1e205, 1e206, 1e207, 1e208, 1e209, 1e210, 1e211, 1e212, 1e213, 1e214, 1e215, 1e216, 1e217, 1e218, 1e219, 1e220, 1e221, 1e222, 1e223, 1e224, 1e225, 1e226, 1e227, 1e228, 1e229, 1e230, 1e231, 1e232, 1e233, 1e234, 1e235, 1e236, 1e237, 1e238, 1e239, 1e240, 1e241, 1e242, 1e243, 1e244, 1e245, 1e246, 1e247, 1e248, 1e249, 1e250, 1e251, 1e252, 1e253, 1e254, 1e255, 1e256, 1e257, 1e258, 1e259, 1e260, 1e261, 1e262, 1e263, 1e264, 1e265, 1e266, 1e267, 1e268, 1e269, 1e270, 1e271, 1e272, 1e273, 1e274, 1e275, 1e276, 1e277, 1e278, 1e279, 1e280, 1e281, 1e282, 1e283, 1e284, 1e285, 1e286, 1e287, 1e288, 1e289, 1e290, 1e291, 1e292, 1e293, 1e294, 1e295, 1e296, 1e297, 1e298, 1e299, 1e300, 1e301, 1e302, 1e303, 1e304, 1e305, 1e306, 1e307, 1e308];
	var indexof0inpowersof10 = 323;
	
	class Decimal { 
	
		static toBigInteger(value) {
			if (value instanceof Decimal) {
				return BigInteger.parseInt(value.round().toFixed());
			}
			else if (typeof(value) == 'number') {
				//Number.toFixed() returns exponential notation above 1e+21.
				return BigInteger.parseInt(new Decimal(value).round().toFixed());
			}
			else if (typeof(value) == 'string') {
				return BigInteger.parseInt(value);
			}
			else if (value instanceof BigIntegerInternal) {
				return value;
			}
			return BIG_INT_0;
		}
	
		normalize() {
			//When mantissa is very denormalized, use this to normalize much faster.
			
			//TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter
			if (this.mantissa == 0) { this.mantissa = 0; this.exponent = BIG_INT_0; return; }
			if (this.mantissa >= 1 && this.mantissa < 10) { return; }
			if (isNaN(this.mantissa) || isNaN(this.exponent)) { return; }
			
			var temp_exponent = Math.floor(Math.log10(Math.abs(this.mantissa)));
			this.mantissa = this.mantissa/powersof10[temp_exponent+indexof0inpowersof10];
			this.exponent = this.exponent.add(Decimal.toBigInteger(temp_exponent));
			
			return this;
		}
		
		fromMantissaExponent(mantissa, exponent) {
			//SAFETY: don't let in non-numbers
			if (!isFinite(mantissa)) { mantissa = Number.NaN; exponent = BIG_INT_INFINITY; }
			this.mantissa = mantissa;
			this.exponent = Decimal.toBigInteger(exponent);
			this.normalize(); //Non-normalized mantissas can easily get here, so this is mandatory.
			return this;
		}
		
		fromMantissaExponent_noNormalize(mantissa, exponent) {
			//Well, you know what you're doing!
			this.mantissa = mantissa;
			this.exponent = Decimal.toBigInteger(exponent);
			return this;
		}
		
		fromDecimal(value) {
			this.mantissa = value.mantissa;
			this.exponent = value.exponent;
			return this;
		}
		
		fromNumber(value) {
			//SAFETY: Handle Infinity and NaN in a somewhat meaningful way.
			if (isNaN(value)) { this.mantissa = Number.NaN; this.exponent = BIG_INT_INFINITY; }
			else if (value == Number.POSITIVE_INFINITY) { this.mantissa = 1; this.exponent = BIG_INT_INFINITY; }
			else if (value == Number.NEGATIVE_INFINITY) { this.mantissa = -1; this.exponent = BIG_INT_INFINITY; }
			else if (value == 0) { this.mantissa = 0; this.exponent = BIG_INT_0; }
			else
			{
				var tempexponent = Math.floor(Math.log10(Math.abs(value)));
				this.exponent = Decimal.toBigInteger(tempexponent);
				//SAFETY: handle 5e-324, -5e-324 separately
				if (tempexponent == NUMBER_EXP_MIN)
				{
					this.mantissa = (value*10)/1e-323;
				}
				else
				{
					this.mantissa = value/powersof10[tempexponent+indexof0inpowersof10];
				}
				this.normalize(); //SAFETY: Prevent weirdness.
			}
			return this;
		}
		
		fromString(value) {
			if (value.indexOf("e") != -1)
			{
				value = value.replace("(", "").replace(")", "");
				var indexOfE = value.indexOf("e");
				var parts = [value.substring(0, indexOfE), value.substring(indexOfE+1)];
				
				this.mantissa = parseFloat(parts[0]);
				this.exponent = Decimal.toBigInteger(parseFloat(parts[1]));
				this.normalize(); //Non-normalized mantissas can easily get here, so this is mandatory.
			}
			else if (value == "NaN") { this.mantissa = Number.NaN; this.exponent = BIG_INT_INFINITY; }
			else
			{
				this.fromNumber(parseFloat(value));
				if (isNaN(this.mantissa)) { throw Error("[DecimalError] Invalid argument: " + value); }
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
			
			if (!isFinite(this.mantissa)) { return Number.NaN; }
			if (this.exponent.compareTo(BIG_INT_EXP_MAX) > 0) { return this.mantissa > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY; }
			if (this.exponent.compareTo(BIG_INT_EXP_MIN) < 0) { return 0; }
			//SAFETY: again, handle 5e-324, -5e-324 separately
			if (this.exponent.compareTo(BIG_INT_EXP_MIN) == 0) { return this.mantissa > 0 ? 5e-324 : -5e-324; }
			
			var result = this.mantissa*powersof10[parseInt(this.exponent.toString())+indexof0inpowersof10];
			if (!isFinite(result) || this.exponent.compareTo(BIG_INT_0) < 0) { return result; }
			var resultrounded = Math.round(result);
			if (Math.abs(resultrounded-result) < 1e-10) return resultrounded;
			return result;
		}
		
		mantissaWithDecimalPlaces(places) {
			// https://stackoverflow.com/a/37425022
		
			if (isNaN(this.mantissa)) return Number.NaN;
			if (this.mantissa == 0) return 0;
			
			var len = places+1;
			var numDigits = Math.ceil(Math.log10(Math.abs(this.mantissa)));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len); 
			return parseFloat(rounded.toFixed(Math.max(len-numDigits,0)));
		}
		
		toString() {
			if (isNaN(this.mantissa)) { return "NaN"; }
			if (this.exponent.compareTo(BIG_INT_INFINITY) >= 0)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent.compareTo(BIG_INT_INFINITESIMAL) <= 0 || this.mantissa == 0) { return "0"; }
			
			if (this.exponent.compareTo(BIG_INT_21) < 0 && this.exponent.compareTo(BIG_INT_MINUS_7) > 0)
			{
				return this.toNumber().toString();
			}
			
			return this.mantissa + "e" + (this.exponent.compareTo(BIG_INT_0) >= 0 ? "+" : "") + this.exponent.toString();
		}
		
		toExponential(places) {
			// https://stackoverflow.com/a/37425022
			
			//TODO: Some unfixed cases:
			//new Decimal("1.2345e-999").toExponential()
			//"1.23450000000000015e-999"
			//new Decimal("1e-999").toExponential()
			//"1.000000000000000000e-999"
			//TBH I'm tempted to just say it's a feature. If you're doing pretty formatting then why don't you know how many decimal places you want...?
		
			if (isNaN(this.mantissa)) { return "NaN"; }
			if (this.exponent.compareTo(BIG_INT_INFINITY) >= 0)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent.compareTo(BIG_INT_INFINITESIMAL) <= 0 || this.mantissa == 0) { return "0" + (places > 0 ? padEnd(".", places+1, "0") : "") + "e+0"; }
			
			// two cases:
			// 1) exponent is < 308 and > -324: use basic toFixed
			// 2) everything else: we have to do it ourselves!
			
			if (this.exponent.compareTo(BIG_INT_EXP_MIN) > 0 && this.exponent.compareTo(BIG_INT_EXP_MAX) < 0) { return this.toNumber().toExponential(places); }
			
			if (!isFinite(places)) { places = MAX_SIGNIFICANT_DIGITS; }
			
			var len = places+1;
			var numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.mantissa))));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);
			
			return rounded.toFixed(Math.max(len-numDigits,0)) + "e" + (this.exponent.compareTo(BIG_INT_0) >= 0 ? "+" : "") + this.exponent.toString();
		}
		
		toFixed(places) {
			if (isNaN(this.mantissa)) { return "NaN"; }
			if (this.exponent.compareTo(BIG_INT_INFINITY) >= 0)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent.compareTo(BIG_INT_INFINITESIMAL) <= 0 || this.mantissa == 0) { return "0" + (places > 0 ? padEnd(".", places+1, "0") : ""); }
			
			// two cases:
			// 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
			// 2) exponent is 16 or less: use basic toFixed
			
			if (this.exponent.compareTo(BIG_INT_MAX_SIGNIFICANT_DIGITS) >= 0)
			{
				return padEnd(this.mantissa.toString().replace(".", ""), this.exponent.add(BIG_INT_1).toString(), "0") + (places > 0 ? padEnd(".", places+1, "0") : "");
			}
			else
			{
				return this.toNumber().toFixed(places);
			}
		}
		
		toPrecision(places) {
			if (parseFloat(this.exponent.toString()) <= -7)
			{
				return this.toExponential(places-1);
			}
			if (places > parseFloat(this.exponent.toString()))
			{
				return this.toFixed(places - parseFloat(this.exponent.toString()) - 1);
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
		
		round() {
			if (this.exponent.compareTo(BIG_INT_MINUS_1) < 0)
			{
				return new Decimal(0);
			}
			else if (this.exponent.compareTo(BIG_INT_MAX_SIGNIFICANT_DIGITS) < 0)
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
			if (this.exponent.compareTo(BIG_INT_MINUS_1) < 0)
			{
				return Math.sign(this.mantissa) >= 0 ? new Decimal(0) : new Decimal(-1);
			}
			else if (this.exponent.compareTo(BIG_INT_MAX_SIGNIFICANT_DIGITS) < 0)
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
			if (this.exponent.compareTo(BIG_INT_MINUS_1) < 0)
			{
				return Math.sign(this.mantissa) > 0 ? new Decimal(1) : new Decimal(0);
			}
			else if (this.exponent.compareTo(BIG_INT_MAX_SIGNIFICANT_DIGITS) < 0)
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
			if (this.exponent.compareTo(BIG_INT_0) < 0)
			{
				return new Decimal(0);
			}
			else if (this.exponent.compareTo(BIG_INT_MAX_SIGNIFICANT_DIGITS) < 0)
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
			
			value = Decimal.fromValue(value);
			
			//TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8
			
			if (this.mantissa == 0) { return value; }
			if (value.mantissa == 0) { return this; }
			
			var biggerDecimal, smallerDecimal;
			if (this.exponent.compareTo(value.exponent) >= 0)
			{
				biggerDecimal = this;
				smallerDecimal = value;
			}
			else
			{
				biggerDecimal = value;
				smallerDecimal = this;
			}
			
			if (biggerDecimal.exponent.subtract(smallerDecimal.exponent).compareTo(BIG_INT_MAX_SIGNIFICANT_DIGITS) > 0)
			{
				return biggerDecimal;
			}
			else
			{
				//have to do this because adding numbers that were once integers but scaled down is imprecise.
				//Example: 299 + 18
				return Decimal.fromMantissaExponent(
				Math.round(1e14*biggerDecimal.mantissa + 1e14*smallerDecimal.mantissa*powersof10[parseInt(smallerDecimal.exponent.subtract(biggerDecimal.exponent).toString())+indexof0inpowersof10]),
				biggerDecimal.exponent.subtract(BIG_INT_14));
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

			return Decimal.fromMantissaExponent(this.mantissa*value.mantissa, this.exponent.add(value.exponent));
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
			return Decimal.fromMantissaExponent(1/this.mantissa, this.exponent.negate());
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
				if (this.exponent.compareTo(value.exponent) > 0) { return 1; }
				if (this.exponent.compareTo(value.exponent) < 0) { return -1; }
				if (this.mantissa > value.mantissa) { return 1; }
				if (this.mantissa < value.mantissa) { return -1; }
				return 0;
			}
			else if (this.mantissa < 0) // negative
			{
				if (value.mantissa > 0) { return -1; }
				if (this.exponent.compareTo(value.exponent) > 0) { return -1; }
				if (this.exponent.compareTo(value.exponent) < 0) { return 1; }
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
			
			return this.mantissa == value.mantissa && this.exponent.compareTo(value.exponent) == 0
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
			
			return this.mantissa != value.mantissa || this.exponent.compareTo(value.exponent) != 0
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
			
			if (this.mantissa == 0) return value.mantissa > 0;
			if (value.mantissa == 0) return this.mantissa <= 0;
			if (this.exponent.compareTo(value.exponent) == 0) return this.mantissa < value.mantissa;
			if (this.mantissa > 0) return value.mantissa > 0 && this.exponent.compareTo(value.exponent) < 0;
			return value.mantissa > 0 || this.exponent.compareTo(value.exponent) > 0; 
		}
		
		static lt(value, other) {
			value = Decimal.fromValue(value);
			
			return value.lt(other);
		}
		
		lte(value) {
			value = Decimal.fromValue(value);
			
			if (this.mantissa == 0) return value.mantissa >= 0;
			if (value.mantissa == 0) return this.mantissa <= 0;
			if (this.exponent.compareTo(value.exponent) == 0) return this.mantissa <= value.mantissa;
			if (this.mantissa > 0) return value.mantissa > 0 && this.exponent.compareTo(value.exponent) < 0;
			return value.mantissa > 0 || this.exponent.compareTo(value.exponent) > 0; 
		}
		
		static lte(value, other) {
			value = Decimal.fromValue(value);
			
			return value.lte(other);
		}
		
		gt(value) {
			value = Decimal.fromValue(value);
			
			if (this.mantissa == 0) return value.mantissa < 0;
			if (value.mantissa == 0) return this.mantissa > 0;
			if (this.exponent.compareTo(value.exponent) == 0) return this.mantissa > value.mantissa;
			if (this.mantissa > 0) return value.mantissa < 0 || this.exponent.compareTo(value.exponent) > 0;
			return value.mantissa < 0 && this.exponent.compareTo(value.exponent) < 0;
		}
		
		static gt(value, other) {
			value = Decimal.fromValue(value);
			
			return value.gt(other);
		}
		
		gte(value) {
			value = Decimal.fromValue(value);
			
			if (this.mantissa == 0) return value.mantissa <= 0;
			if (value.mantissa == 0) return this.mantissa > 0;
			if (this.exponent.compareTo(value.exponent) == 0) return this.mantissa >= value.mantissa;
			if (this.mantissa > 0) return value.mantissa < 0 || this.exponent.compareTo(value.exponent) > 0;
			return value.mantissa < 0 && this.exponent.compareTo(value.exponent) < 0;
		}
		
		static gte(value, other) {
			value = Decimal.fromValue(value);
			
			return value.gte(other);
		}
		
		max(value) {
			value = Decimal.fromValue(value);
			
			if (this.gte(value)) return this;
			return value;
		}
		
		static max(value, other) {
			value = Decimal.fromValue(value);
			
			return value.max(other);
		}
		
		min(value) {
			value = Decimal.fromValue(value);
			
			if (this.lte(value)) return this;
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
			//UN-SAFETY: Returns a Number, not something with arbitrary precision, so expect inaccuracies if abs(exponent) is greater than 9e15. 
		
			return parseInt(this.exponent.toString()) + Math.log10(this.mantissa);
		}
		
		static log10(value) {
			value = Decimal.fromValue(value);
			
			return value.log10();
		}
		
		log(base) {
			//UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater). We assume this to be true and thus only need to return a number, not a Decimal, and don't do any other kind of error checking.
			
			//UN-SAFETY: Returns a Number, not something with arbitrary precision, so expect inaccuracies if abs(exponent) is greater than 9e15. 
			
			return (Math.LN10/Math.log(base))*this.log10();
		}
		
		static log(value, base) {
			value = Decimal.fromValue(value);
			
			return value.log(base);
		}
		
		log2() {
			//UN-SAFETY: Returns a Number, not something with arbitrary precision, so expect inaccuracies if abs(exponent) is greater than 9e15.
		
			return 3.32192809488736234787*this.log10();
		}
		
		static log2(value) {
			value = Decimal.fromValue(value);
			
			return value.log2();
		}
		
		ln() {
			//UN-SAFETY: Returns a Number, not something with arbitrary precision, so expect inaccuracies if abs(exponent) is greater than 9e15.
			
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
			var bigintegervalue = null;
			if (value instanceof Decimal) { value = value.toNumber(); }
			if (value instanceof BigIntegerInternal) { bigintegervalue = value; value = parseInt(value.toString()); }
			if (typeof(value) == 'string')
			{
				if (value.indexOf(".") == -1 && value.indexOf("e") == -1)
				{
					bigintegervalue = BigInteger.parseInt(value);
				}
				value = parseFloat(value);
			}
			
			//Fast track: If value is an integer and mantissa^value fits in a Number, we can do a very fast method.
			if (Number.isInteger(value))
			{
				var newMantissa = Math.pow(this.mantissa, value);
				if (isFinite(newMantissa))
				{
					if (bigintegervalue != null)
					{
						return Decimal.fromMantissaExponent(newMantissa, this.exponent.multiply(bigintegervalue));
					}
					return Decimal.fromMantissaExponent(newMantissa, this.exponent.multiply(Decimal.toBigInteger(value)));
				}
			}
			
			///ExpHelper time, to get dat precision!
				
			ExpHelper.precision = MAX_SIGNIFICANT_DIGITS + this.exponent.toString().length;
			var temp = new ExpHelper(value).mul(new ExpHelper(this.exponent.toString()));
			var newexponent = temp.trunc();
			var residue = temp.sub(newexponent).toNumber();
			var newMantissa = Math.pow(10, value*Math.log10(this.mantissa)+residue);
			if (isFinite(newMantissa))
			{
				return Decimal.fromMantissaExponent(newMantissa, newexponent.toFixed());
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
			//Fast track: if -706 < this < 709, we can use regular exp.
			var tmp = this.toNumber();
			if (!isFinite(tmp)) return tmp;
			if (-706 < tmp && tmp < 709)
			{
				return Decimal.fromNumber(Math.exp(tmp));
			}
			else
			{
				//This has to be implemented fundamentally, so that pow(value) can be implemented on top of it.
				
				// Implementation from SpeedCrunch: https://bitbucket.org/heldercorreia/speedcrunch/src/9cffa7b674890affcb877bfebc81d39c26b20dcc/src/math/floatexp.c?at=master&fileviewer=file-view-default
				
				var x, exp, expx;
				
				ExpHelper.precision = MAX_SIGNIFICANT_DIGITS + parseInt(this.exponent.toString());
				x = new ExpHelper(this.toNumber());
				exp = 0;
				expx = parseInt(this.exponent.toString());
				
				if (expx >= 0)
				{
					exp = x.div(ExpHelper.LN10).trunc();
					tmp = exp.mul(ExpHelper.LN10);
					x = x.sub(tmp).toNumber();
					if (x >= Math.LN10)
					{
						exp = exp.add(1);
						x = x - Math.LN10;
					}
				}
				if (x < 0)
				{
					exp = exp.sub(1);
					x = x + Math.LN10;
				}
				
				//when we get here 0 <= x < ln 10
				x = Math.exp(x);
				
				if (!exp.eq(0))
				{
					expx = Decimal.toBigInteger(exp.floor().toFixed()); //TODO: or round, or even nothing? can it ever be non-integer?
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
			return this.pow(2);
		}
		
		static sqr(value) {
			value = Decimal.fromValue(value);
			
			return value.sqr();
		}
		
		sqrt() {
			return this.pow(0.5);
		}
		
		static sqrt(value) {
			value = Decimal.fromValue(value);
			
			return value.sqrt();
		}
		
		cube() {
			return this.pow(3);
		}
		
		static cube(value) {
			value = Decimal.fromValue(value);
			
			return value.cube();
		}
		
		cbrt() {
			return this.pow(1/3);
		}
		
		static cbrt(value) {
			value = Decimal.fromValue(value);
			
			return value.cbrt();
		}
		
		//Some hyperbolic trig functions that happen to be easy
		sinh() {
			return this.exp().sub(this.negate().exp()).div(2);
		}
		cosh() {
			return this.exp().add(this.negate().exp()).div(2);
		}
		tanh() {
			return this.sinh().div(this.cosh());
		}
		asinh() {
			return Decimal.ln(this.add(this.sqr().add(1).sqrt()));
		}
		acosh() {
			return Decimal.ln(this.add(this.sqr().sub(1).sqrt()));
		}
		atanh() {
		if (this.abs().gte(1)) return Number.NaN;
		return Decimal.ln(this.add(1).div(new Decimal(1).sub(this))).div(2);
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
		
		//Porting some function from Decimal.js 
		lessThanOrEqualTo(other) {return this.cmp(other) < 1; }
		lessThan(other) {return this.cmp(other) < 0; }
		greaterThanOrEqualTo(other) { return this.cmp(other) > -1; }
		greaterThan(other) {return this.cmp(other) > 0; }
		
		static randomDecimalForTesting(absMaxExponent)
		{
			//NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
			//5% of the time, have a mantissa of 0
			if (Math.random()*20 < 1) return Decimal.fromMantissaExponent(0, 0);
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