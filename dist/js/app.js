(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],2:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":17,"./_wks":45}],3:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":21}],4:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":38,"./_to-iobject":40,"./_to-length":41}],5:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],6:[function(require,module,exports){
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],7:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":1}],8:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],9:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":13}],10:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":15,"./_is-object":21}],11:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],12:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":6,"./_ctx":7,"./_global":15,"./_hide":17,"./_redefine":34}],13:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],14:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":37}],15:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],16:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],17:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":9,"./_object-dp":28,"./_property-desc":33}],18:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":15}],19:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":9,"./_dom-create":10,"./_fails":13}],20:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":5}],21:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],22:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":17,"./_object-create":27,"./_property-desc":33,"./_set-to-string-tag":35,"./_wks":45}],23:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":12,"./_hide":17,"./_iter-create":22,"./_iterators":25,"./_library":26,"./_object-gpo":30,"./_redefine":34,"./_set-to-string-tag":35,"./_wks":45}],24:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],25:[function(require,module,exports){
module.exports = {};

},{}],26:[function(require,module,exports){
module.exports = false;

},{}],27:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":3,"./_dom-create":10,"./_enum-bug-keys":11,"./_html":18,"./_object-dps":29,"./_shared-key":36}],28:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":3,"./_descriptors":9,"./_ie8-dom-define":19,"./_to-primitive":43}],29:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":3,"./_descriptors":9,"./_object-dp":28,"./_object-keys":32}],30:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":16,"./_shared-key":36,"./_to-object":42}],31:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":4,"./_has":16,"./_shared-key":36,"./_to-iobject":40}],32:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":11,"./_object-keys-internal":31}],33:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],34:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":6,"./_function-to-string":14,"./_global":15,"./_has":16,"./_hide":17,"./_uid":44}],35:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":16,"./_object-dp":28,"./_wks":45}],36:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":37,"./_uid":44}],37:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":6,"./_global":15,"./_library":26}],38:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":39}],39:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],40:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":8,"./_iobject":20}],41:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":39}],42:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":8}],43:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":21}],44:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],45:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":15,"./_shared":37,"./_uid":44}],46:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":2,"./_iter-define":23,"./_iter-step":24,"./_iterators":25,"./_to-iobject":40}],47:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":15,"./_hide":17,"./_iterators":25,"./_object-keys":32,"./_redefine":34,"./_wks":45,"./es6.array.iterator":46}],48:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable.js");
const {
  findPlatform,
  detectEA,
  getOfficialName,
  getPlatformOrder,
  loadAssetInfo,
  setRadioSelectors
} = require('./common');
const {
  jvmVariant,
  variant
} = require('./common');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');

// When archive page loads, run:
module.exports.load = () => {
  setRadioSelectors();
  loadAssetInfo(variant, jvmVariant, 'ga', undefined, undefined, undefined, 'adoptopenjdk', buildArchiveHTML, () => {
    // if there are no releases (beyond the latest one)...
    // report an error, remove the loading dots
    loading.innerHTML = '';
    errorContainer.innerHTML = `<p>There are no archived releases yet for ${variant} on the ${jvmVariant} JVM.
      See the <a href='./releases.html?variant=${variant}&jvmVariant=${jvmVariant}'>Latest release</a> page.</p>`;
  });
};
function buildArchiveHTML(aReleases) {
  const releases = [];
  aReleases.forEach(aRelease => {
    const publishedAt = moment(aRelease.timestamp);
    const release = {
      release_name: aRelease.release_name,
      release_link: aRelease.release_link,
      dashboard_link: `https://dash.adoptopenjdk.net/version.html?version=${variant}` + `&tag=${encodeURIComponent(aRelease.release_name)}`,
      release_day: publishedAt.format('D'),
      release_month: publishedAt.format('MMMM'),
      release_year: publishedAt.format('YYYY'),
      early_access: detectEA(aRelease.version_data),
      platforms: {}
    };

    // populate 'platformTableRows' with one row per binary for this release...
    aRelease.binaries.forEach(aReleaseAsset => {
      const platform = findPlatform(aReleaseAsset);

      // Skip this asset if its platform could not be matched (see the website's 'config.json')
      if (!platform) {
        return;
      }

      // Skip this asset if it's not a binary type we're interested in displaying
      const binary_type = aReleaseAsset.image_type.toUpperCase();
      if (!['INSTALLER', 'JDK', 'JRE'].includes(binary_type)) {
        return;
      }
      if (!release.platforms[platform]) {
        release.platforms[platform] = {
          official_name: getOfficialName(platform),
          ordinal: getPlatformOrder(platform),
          assets: []
        };
      }
      let binary_constructor = {
        type: binary_type,
        link: aReleaseAsset.package.link,
        checksum: aReleaseAsset.package.checksum,
        size: Math.floor(aReleaseAsset.package.size / 1000 / 1000)
      };
      if (aReleaseAsset.installer) {
        binary_constructor.installer_link = aReleaseAsset.installer.link;
        binary_constructor.installer_checksum = aReleaseAsset.installer.checksum;
        binary_constructor.installer_size = Math.floor(aReleaseAsset.installer.size / 1000 / 1000);
      }

      // Add the new binary to the release asset
      release.platforms[platform].assets.push(binary_constructor);
    });
    releases.push(release);
  });
  const template = Handlebars.compile(document.getElementById('template').innerHTML);
  document.getElementById('archive-table-body').innerHTML = template({
    releases
  });
  setPagination();
  loading.innerHTML = ''; // remove the loading dots

  // show the archive list and filter box, with fade-in animation
  const archiveList = document.getElementById('archive-list');
  archiveList.className = archiveList.className.replace(/(?:^|\s)hide(?!\S)/g, ' animated fadeIn ');
}
function setPagination() {
  const container = document.getElementById('pagination-container');
  const archiveTableBody = document.getElementById('archive-table-body');
  $(container).pagination({
    dataSource: Array.from(archiveTableBody.getElementsByClassName('release-row')).map(row => row.outerHTML),
    pageSize: 5,
    callback: rows => {
      archiveTableBody.innerHTML = rows.join('');
    }
  });
  if (container.getElementsByTagName('li').length <= 3) {
    container.classList.add('hide');
  }
}

},{"./common":49,"core-js/modules/web.dom.iterable.js":47}],49:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("core-js/modules/web.dom.iterable.js");
// prefix for assets (e.g. logo)

const {
  platforms,
  installCommands,
  variants
} = require('../json/config');

// Enables things like 'lookup["X64_MAC"]'
const lookup = {};
platforms.forEach(platform => lookup[platform.searchableName] = platform);
let defaultVariant;

// Set the default JDK based on config.json
for (let variant of variants) {
  if (variant.default) {
    defaultVariant = variant.searchableName;
  }
}
let variant = module.exports.variant = getQueryByName('variant') || defaultVariant;
let jvmVariant = module.exports.jvmVariant = getQueryByName('jvmVariant') || 'hotspot';
module.exports.getVariantObject = variantName => variants.find(variant => variant.searchableName === variantName);
module.exports.findPlatform = binaryData => {
  const matchedPlatform = platforms.filter(platform => {
    return Object.prototype.hasOwnProperty.call(platform, 'attributes') && Object.keys(platform.attributes).every(attr => platform.attributes[attr] === binaryData[attr]);
  })[0];
  return matchedPlatform === undefined ? null : matchedPlatform.searchableName;
};

// gets the OFFICIAL NAME when you pass in 'searchableName'
module.exports.getOfficialName = searchableName => lookup[searchableName].officialName;
module.exports.getPlatformOrder = searchableName => {
  return platforms.findIndex(platform => platform.searchableName == searchableName);
};
module.exports.orderPlatforms = function (input) {
  let attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'thisPlatformOrder';
  return sortByProperty(input, attr);
};
const sortByProperty = module.exports.sortByProperty = (input, property, descending) => {
  const invert = descending ? -1 : 1;
  const sorter = (a, b) => {
    return invert * (a[property] > b[property] ? 1 : a[property] < b[property] ? -1 : 0);
  };
  if (Array.isArray(input)) {
    return input.sort(sorter);
  } else {
    // Preserve the source object key as '_key'
    return Object.keys(input).map(_key => Object.assign(input[_key], {
      _key
    })).sort(sorter);
  }
};

// gets the Supported Version WITH PATH when you pass in 'searchableName'
// Version numbers use >= logic and need to be specified in ascending order
module.exports.getSupportedVersion = searchableName => {
  let supported_version = lookup[searchableName].supported_version;
  if (typeof supported_version === 'object') {
    supported_version = supported_version[jvmVariant];
    if (typeof supported_version === 'object') {
      let major_version = parseInt(variant.replace(/\D/g, ''));
      let supported_version_string;
      for (let version in supported_version) {
        if (major_version >= parseInt(version)) {
          supported_version_string = supported_version[version];
        }
      }
      supported_version = supported_version_string;
    }
  }
  return supported_version;
};

// gets the INSTALLATION COMMANDS when you pass in 'os'
module.exports.getInstallCommands = os => {
  let installObject;
  switch (os) {
    case 'windows':
      installObject = fetchInstallObject('powershell');
      break;
    case 'aix':
      installObject = fetchInstallObject('gunzip');
      break;
    case 'solaris':
      installObject = fetchInstallObject('gunzip');
      break;
    default:
      // defaults to tar installation
      installObject = fetchInstallObject('tar');
  }
  return installObject;
};
function fetchInstallObject(command) {
  for (let installCommand of installCommands) {
    if (command == installCommand.name) {
      return installCommand;
    }
  }
}

// This function returns an object containing all information about the user's OS.
// The OS info comes from the 'platforms' array, which in turn comes from 'config.json'.
// `platform` comes from `platform.js`, which should be included on the page where `detectOS` is used.
module.exports.detectOS = () => {
  return platforms.find(aPlatform => {
    /*global platform*/
    // Workaround for Firefox on macOS which is 32 bit only
    if (platform.os.family == 'OS X') {
      platform.os.architecture = 64;
    }
    return aPlatform.osDetectionString.toUpperCase().includes(platform.os.family.toUpperCase()) && aPlatform.attributes.architecture.endsWith(platform.os.architecture); // 32 or 64 int
  }) || null;
};
module.exports.detectLTS = version => {
  for (let variant of variants) {
    if (variant.searchableName == version) {
      if (variant.lts == true) {
        return 'LTS';
      } else if (variant.lts == false) {
        return null;
      } else {
        return variant.lts;
      }
    }
  }
};
module.exports.detectEA = version => {
  if (version.pre && version.pre == 'ea') {
    return true;
  } else {
    return false;
  }
};
function toJson(response) {
  while (typeof response === 'string') {
    try {
      response = JSON.parse(response);
    } catch (e) {
      return null;
    }
  }
  return response;
}

// load latest_nightly.json/nightly.json/releases.json/latest_release.json files
// This will first try to load from openjdk<X>-binaries repos and if that fails
// try openjdk<X>-release, i.e will try the following:

// https://github.com/AdoptOpenJDK/openjdk10-binaries/blob/master/latest_release.json
// https://github.com/AdoptOpenJDK/openjdk10-releases/blob/master/latest_release.json
function queryAPI(release, url, openjdkImp, vendor, errorHandler, handleResponse) {
  if (!url.endsWith('?') && !url.endsWith('&')) {
    url += '?';
  }
  if (release !== undefined) {
    url += `release=${release}&`;
  }
  if (openjdkImp !== undefined) {
    url += `jvm_impl=${openjdkImp}&`;
  }
  if (vendor !== undefined) {
    url += `vendor=${vendor}&`;
  }
  if (vendor === 'openjdk') {
    url += 'page_size=1';
  }
  loadUrl(url, response => {
    if (response === null) {
      errorHandler();
    } else {
      handleResponse(toJson(response), false);
    }
  });
}
module.exports.loadAssetInfo = (variant, openjdkImp, releaseType, pageSize, datePicker, release, vendor, handleResponse, errorHandler) => {
  if (variant === 'amber') {
    variant = 'openjdk-amber';
  }
  let url = `https://api.adoptopenjdk.net/v3/assets/feature_releases/${variant.replace(/\D/g, '')}/${releaseType}`;
  if (pageSize) {
    url += `?page_size=${pageSize}&`;
  }
  if (datePicker) {
    url += `before=${datePicker}&`;
  }
  queryAPI(release, url, openjdkImp, vendor, errorHandler, handleResponse);
};
module.exports.loadLatestAssets = (variant, openjdkImp, release, handleResponse, errorHandler) => {
  if (variant === 'amber') {
    variant = 'openjdk-amber';
  }
  const url = `https://api.adoptopenjdk.net/v3/assets/latest/${variant.replace(/\D/g, '')}/${openjdkImp}`;
  queryAPI(release, url, openjdkImp, 'adoptopenjdk', errorHandler, handleResponse);
};
function loadUrl(url, callback) {
  const xobj = new XMLHttpRequest();
  xobj.open('GET', url, true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // if the status is 'ok', run the callback function that has been passed in.
      callback(xobj.responseText);
    } else if (xobj.status != '200' &&
    // if the status is NOT 'ok', remove the loading dots, and display an error:
    xobj.status != '0') {
      // for IE a cross domain request has status 0, we're going to execute this block fist, than the above as well.
      callback(null);
    }
  };
  xobj.send(null);
}

// build the menu twisties
module.exports.buildMenuTwisties = () => {
  const submenus = document.getElementById('menu-content').getElementsByClassName('submenu');
  for (let i = 0; i < submenus.length; i++) {
    const twisty = document.createElement('span');
    const twistyContent = document.createTextNode('>');
    twisty.appendChild(twistyContent);
    twisty.className = 'twisty';
    const thisLine = submenus[i].getElementsByTagName('a')[0];
    thisLine.appendChild(twisty);
    thisLine.onclick = function () {
      this.parentNode.classList.toggle('open');
    };
  }
};
module.exports.setTickLink = () => {
  const ticks = document.getElementsByClassName('tick');
  for (let i = 0; i < ticks.length; i++) {
    ticks[i].addEventListener('click', event => {
      var win = window.open('https://en.wikipedia.org/wiki/Technology_Compatibility_Kit', '_blank');
      if (win) {
        win.focus();
      } else {
        alert('New tab blocked - please allow popups.');
      }
      event.preventDefault();
    });
  }
};

// builds up a query string (e.g. "variant=openjdk8&jvmVariant=hotspot")
const makeQueryString = module.exports.makeQueryString = params => {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
};
module.exports.setUrlQuery = params => {
  window.location.search = makeQueryString(params);
};
function getQueryByName(name) {
  const url = window.location.href;
  const regex = new RegExp('[?&]' + name.replace(/[[]]/g, '\\$&') + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
module.exports.persistUrlQuery = () => {
  const links = Array.from(document.getElementsByTagName('a'));
  const link = (window.location.hostname !== 'localhost' ? 'https://' : '') + window.location.hostname;
  links.forEach(eachLink => {
    if (eachLink.href.includes(link)) {
      if (eachLink.href.includes('#')) {
        const anchor = '#' + eachLink.href.split('#').pop();
        eachLink.href = eachLink.href.substr(0, eachLink.href.indexOf('#'));
        if (eachLink.href.includes('?')) {
          eachLink.href = eachLink.href.substr(0, eachLink.href.indexOf('?'));
        }
        eachLink.href = eachLink.href + window.location.search + anchor;
      } else {
        eachLink.href = eachLink.href + window.location.search;
      }
    }
  });
};
module.exports.setRadioSelectors = () => {
  const jdkSelector = document.getElementById('jdk-selector');
  const jvmSelector = document.getElementById('jvm-selector');
  const listedVariants = [];
  function createRadioButtons(name, group, variant, element) {
    if (!listedVariants.length || !listedVariants.some(aVariant => aVariant === name)) {
      const btnLabel = document.createElement('label');
      btnLabel.setAttribute('class', 'btn-label');
      const input = document.createElement('input');
      input.setAttribute('type', 'radio');
      input.setAttribute('name', group);
      input.setAttribute('value', name);
      input.setAttribute('class', 'radio-button');
      input.setAttribute('lts', variant.lts);
      btnLabel.appendChild(input);
      if (group === 'jdk') {
        if (variant.lts === true) {
          btnLabel.innerHTML += `<span>${variant.label} (LTS)</span>`;
        } else if (variant.lts === 'latest') {
          btnLabel.innerHTML += `<span>${variant.label} (Latest)</span>`;
        } else {
          btnLabel.innerHTML += `<span>${variant.label}</span>`;
        }
      } else {
        btnLabel.innerHTML += `<span>${variant}</span>`;
      }
      element.appendChild(btnLabel);
      listedVariants.push(name);
    }
  }
  for (let variant of variants) {
    for (let jvmVariantOption of variant.jvm) {
      const jdkName = variant.searchableName;
      const jvmName = jvmVariantOption.toLowerCase();
      createRadioButtons(jdkName, 'jdk', variant, jdkSelector);
      if (jvmSelector) {
        createRadioButtons(jvmName, 'jvm', jvmVariantOption, jvmSelector);
      }
    }
  }
  const jdkButtons = document.getElementsByName('jdk');
  const jvmButtons = document.getElementsByName('jvm');
  jdkSelector.onchange = () => {
    const jdkButton = Array.from(jdkButtons).find(button => button.checked);
    module.exports.setUrlQuery({
      variant: jdkButton.value.match(/(openjdk\d+|amber)/)[1],
      jvmVariant
    });
  };
  if (jvmSelector) {
    jvmSelector.onchange = () => {
      const jvmButton = Array.from(jvmButtons).find(button => button.checked);
      module.exports.setUrlQuery({
        variant,
        jvmVariant: jvmButton.value.match(/([a-zA-Z0-9]+)/)[1]
      });
    };
  }
  for (let jdkButton of jdkButtons) {
    if (jdkButton.value === variant) {
      jdkButton.setAttribute('checked', 'checked');
      break;
    }
  }
  for (let i = 0; i < jvmButtons.length; i++) {
    if (jvmButtons[i].value === jvmVariant) {
      jvmButtons[i].setAttribute('checked', 'checked');
      break;
    }
  }
};
global.renderChecksum = function (checksum) {
  var modal = document.getElementById('myModal');
  document.getElementById('modal-body').innerHTML = checksum;
  modal.style.display = 'inline';
};
global.hideChecksum = function () {
  var modal = document.getElementById('myModal');
  modal.style.display = 'none';
};
global.showHideReleaseNotes = function (notes_id) {
  var notes_div = document.getElementById(notes_id);
  if (notes_div.classList.contains('softHide')) {
    notes_div.classList.remove('softHide');
  } else {
    notes_div.classList.add('softHide');
  }
};
global.copyStringToClipboard = function () {
  document.getElementById('modal-body').select();
  document.execCommand('copy');
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../json/config":54,"core-js/modules/web.dom.iterable.js":47}],50:[function(require,module,exports){
"use strict";

const {
  buildMenuTwisties,
  persistUrlQuery
} = require('./common');
document.addEventListener('DOMContentLoaded', () => {
  persistUrlQuery();
  buildMenuTwisties();

  // '/index.html' --> 'index'
  // NOTE: Browserify requires strings in `require()`, so this is intentionally more explicit than
  // it normally would be.
  switch (window.location.pathname.split('/').pop().replace(/\.html$/i, '')) {
    case '':
    case 'index':
      return require('./index').load();
    case 'archive':
      return require('./archive').load();
    case 'releases':
      return require('./releases').load();
    case 'upstream':
      return require('./upstream').load();
  }
});

},{"./archive":48,"./common":49,"./index":51,"./releases":52,"./upstream":53}],51:[function(require,module,exports){
"use strict";

const {
  detectOS,
  loadLatestAssets,
  setRadioSelectors
} = require('./common');
const {
  jvmVariant,
  variant
} = require('./common');

// set variables for all index page HTML elements that will be used by the JS
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const dlText = document.getElementById('dl-text');
const dlLatest = document.getElementById('dl-latest');
const dlLatestText = document.getElementById('dl-latest-text');
const dlArchive = document.getElementById('dl-archive');
const dlOther = document.getElementById('dl-other');
const dlVersionText = document.getElementById('dl-version-text');

// When index page loads, run:
module.exports.load = () => {
  setRadioSelectors();
  removeRadioButtons();

  // Try to match up the detected OS with a platform from 'config.json'
  const OS = detectOS();
  if (OS) {
    dlText.innerHTML = `Download for <var platform-name>${OS.officialName}</var>`;
  }
  dlText.classList.remove('invisible');
  const handleResponse = () => {
    buildHomepageHTML(jvmVariant);
  };
  loadLatestAssets(variant, jvmVariant, 'latest', handleResponse, undefined, () => {
    errorContainer.innerHTML = `<p>There are no releases available for ${variant} on the ${jvmVariant} JVM.
      Please check our <a href='nightly.html?variant=${variant}&jvmVariant=${jvmVariant}' target='blank'>Nightly Builds</a>.</p>`;
    loading.innerHTML = ''; // remove the loading dots
  });
};

function removeRadioButtons() {
  const buttons = document.getElementsByClassName('btn-label');
  for (var a = 0; a < buttons.length; a++) {
    if (buttons[a].firstChild.getAttribute('lts') === 'false') {
      buttons[a].style.display = 'none';
    }
  }
}
function buildHomepageHTML(jvmVariant) {
  if (jvmVariant == 'hotspot') {
    let version = variant.replace(/\D/g, '');
    dlLatest.href = 'https://adoptium.net/temurin/releases?version=' + version;
    dlLatestText.textContent = 'adoptium.net';
    dlVersionText.innerHTML = 'AdoptOpenJDK has moved...';
  } else if (jvmVariant == 'openj9') {
    dlLatest.href = 'https://developer.ibm.com/languages/java/semeru-runtimes/downloads';
    dlLatestText.textContent = 'developer.ibm.com';
    dlVersionText.innerHTML = 'AdoptOpenJDK has moved...';
  }

  // remove the loading dots, and make all buttons visible, with animated fade-in
  loading.classList.add('hide');
  dlLatest.className = dlLatest.className.replace(/(?:^|\s)invisible(?!\S)/g, ' animated ');
  dlOther.className = dlOther.className.replace(/(?:^|\s)invisible(?!\S)/g, ' animated ');
  dlArchive.className = dlArchive.className.replace(/(?:^|\s)invisible(?!\S)/g, ' animated ');
  dlLatest.onclick = () => {
    document.getElementById('installation-link').className += ' animated pulse infinite transition-bright';
  };

  // animate the main download button shortly after the initial animation has finished.
  setTimeout(() => {
    dlLatest.className = 'dl-button a-button animated pulse';
  }, 1000);
}

},{"./common":49}],52:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("core-js/modules/web.dom.iterable.js");
const {
  findPlatform,
  getSupportedVersion,
  getOfficialName,
  getPlatformOrder,
  detectLTS,
  detectEA,
  loadLatestAssets,
  orderPlatforms,
  setRadioSelectors,
  setTickLink
} = require('./common');
const {
  jvmVariant,
  variant
} = require('./common');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');

// When releases page loads, run:
module.exports.load = () => {
  Handlebars.registerHelper('fetchOS', function (title) {
    return title.split(' ')[0];
  });
  Handlebars.registerHelper('fetchArch', function (title) {
    return title.split(' ')[1];
  });
  Handlebars.registerHelper('formatVersion', function (version) {
    return version.replace(/\D/g, '');
  });
  Handlebars.registerHelper('fetchExtension', function (filename) {
    let extension = `.${filename.split('.').pop()}`;
    // Workaround to prevent extension returning as .gz
    if (extension == '.gz') {
      extension = '.tar.gz';
    }
    return extension;
  });
  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
  const LTS = detectLTS(variant);
  const styles = `
  .download-last-version:after {
      content: "${LTS}";
  }
  `;
  if (LTS !== null) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
  setRadioSelectors();
  loadLatestAssets(variant, jvmVariant, 'latest', buildLatestHTML, undefined, () => {
    errorContainer.innerHTML = `<p>There are no releases available for ${variant} on the ${jvmVariant} JVM.
      Please check our <a href='nightly.html?variant=${variant}&jvmVariant=${jvmVariant}' target='blank'>Nightly Builds</a>.</p>`;
    loading.innerHTML = ''; // remove the loading dots
  });
};

function buildLatestHTML(releasesJson) {
  // Array of releases that have binaries we want to display
  let releases = [];
  releasesJson.forEach(releaseAsset => {
    const platform = findPlatform(releaseAsset.binary);

    // Skip this asset if its platform could not be matched (see the website's 'config.json')
    if (!platform) {
      return;
    }
    let heap_size;
    if (releaseAsset.binary.heap_size == 'large') {
      heap_size = 'Large Heap';
    } else if (releaseAsset.binary.heap_size == 'normal') {
      heap_size = 'Normal';
    }

    // Skip this asset if it's not a binary type we're interested in displaying
    const binary_type = releaseAsset.binary.image_type.toUpperCase();
    if (!['INSTALLER', 'JDK', 'JRE'].includes(binary_type)) {
      return;
    }
    // Get the existing release asset (passed to the template) or define a new one
    let release = releases.find(release => release.platform_name === platform);
    if (!release) {
      release = {
        platform_name: platform,
        platform_official_name: getOfficialName(platform),
        platform_ordinal: getPlatformOrder(platform),
        platform_supported_version: getSupportedVersion(platform),
        release_name: releaseAsset.release_name,
        heap_size: heap_size,
        release_link: releaseAsset.release_link,
        release_datetime: moment(releaseAsset.timestamp).format('YYYY-MM-DD hh:mm:ss'),
        early_access: detectEA(releaseAsset.version),
        vendor: releaseAsset.vendor,
        variant: variant,
        binaries: []
      };
    }
    let binary_constructor = {
      type: binary_type,
      link: releaseAsset.binary.package.link,
      checksum: releaseAsset.binary.package.checksum,
      size: Math.floor(releaseAsset.binary.package.size / 1000 / 1000)
    };
    if (releaseAsset.binary.installer) {
      binary_constructor.installer_link = releaseAsset.binary.installer.link;
      binary_constructor.installer_checksum = releaseAsset.binary.installer.checksum;
      binary_constructor.installer_size = Math.floor(releaseAsset.binary.installer.size / 1000 / 1000);
    }

    // Add the new binary to the release asset
    release.binaries.push(binary_constructor);

    // We have the first binary, so add the release asset.
    if (release.binaries.length === 1) {
      releases.push(release);
    }
  });
  releases = orderPlatforms(releases, 'platform_ordinal');
  releases.forEach(release => {
    release.binaries.sort((binaryA, binaryB) => binaryA.type > binaryB.type ? 1 : binaryA.type < binaryB.type ? -1 : 0);
  });
  const templateSelector = Handlebars.compile(document.getElementById('template-selector').innerHTML);
  document.getElementById('latest-selector').innerHTML = templateSelector({
    releases
  });
  setTickLink();
  global.populateFilters('all');
  loading.innerHTML = ''; // remove the loading dots

  const latestContainer = document.getElementById('latest-container');
  latestContainer.className = latestContainer.className.replace(/(?:^|\s)invisible(?!\S)/g, ' animated fadeIn '); // make this section visible (invisible by default), with animated fade-in
}

global.filterOS = () => {
  let os = document.getElementById('os-filter');
  let arch = document.getElementById('arch-filter');
  if (arch.options[arch.selectedIndex].value === 'Any') {
    filterTable(os.options[os.selectedIndex].value, 'os');
    global.populateFilters('arch');
  } else if (os.options[os.selectedIndex].value == 'Any') {
    global.filterArch();
  } else {
    filterTable(os.options[os.selectedIndex].value, 'multi', arch.options[arch.selectedIndex].value);
  }
};
global.filterArch = () => {
  let arch = document.getElementById('arch-filter');
  let os = document.getElementById('os-filter');
  if (os.options[os.selectedIndex].value === 'Any') {
    filterTable(arch.options[arch.selectedIndex].value, 'arch');
  } else if (arch.options[arch.selectedIndex].value == 'Any') {
    global.filterOS();
  } else {
    filterTable(arch.options[arch.selectedIndex].value, 'multi', os.options[os.selectedIndex].value);
  }
};
global.populateFilters = filter => {
  let releaseTable = document.getElementById('latest-selector').getElementsByClassName('releases-table');
  let OSES = ['Any'];
  let ARCHES = ['Any'];
  for (let release of releaseTable) {
    if (release.style.display !== 'none') {
      OSES.push(release.querySelector('.os').innerHTML.split(' ')[0]);
      ARCHES.push(release.querySelector('.arch').innerHTML);
    }
  }
  if (filter == 'all' || filter == 'os') {
    let osFilter = document.getElementById('os-filter');
    let selected = osFilter.options[osFilter.selectedIndex].value;
    osFilter.innerHTML = '';
    for (let os of new Set(OSES)) {
      let option = document.createElement('option');
      option.text = os;
      option.value = os;
      osFilter.appendChild(option);
    }
    osFilter.value = selected;
  }
  if (filter == 'all' || filter == 'arch') {
    let archFilter = document.getElementById('arch-filter');
    let selected = archFilter.options[archFilter.selectedIndex].value;
    archFilter.innerHTML = '';
    for (let arch of new Set(ARCHES)) {
      let option = document.createElement('option');
      option.text = arch;
      option.value = arch;
      archFilter.appendChild(option);
    }
    archFilter.value = selected;
  }
};
function filterTable(string, type, string1) {
  let tables = document.getElementById('latest-selector').getElementsByClassName('releases-table');
  for (let table of tables) {
    if (type === 'multi') {
      let os = table.querySelector('.os').innerHTML;
      let arch = table.querySelector('.arch').innerHTML;
      if (os.startsWith(string) || arch === string) {
        if (os.startsWith(string1) || arch === string1) {
          table.style.display = '';
        } else {
          table.style.display = 'none';
        }
      } else {
        table.style.display = 'none';
      }
    }
    if (type === 'os') {
      if (string === 'Any') {
        table.style.display = '';
      } else {
        let os = table.querySelector('.os').innerHTML;
        if (os.startsWith(string)) {
          table.style.display = '';
        } else {
          table.style.display = 'none';
        }
      }
    }
    if (type === 'arch') {
      if (string == 'Any') {
        table.style.display = '';
      } else {
        let arch = table.querySelector('.arch').innerHTML;
        if (arch === string) {
          table.style.display = '';
        } else {
          table.style.display = 'none';
        }
      }
    }
  }
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./common":49,"core-js/modules/web.dom.iterable.js":47}],53:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("core-js/modules/web.dom.iterable.js");
const {
  findPlatform,
  getSupportedVersion,
  getOfficialName,
  getPlatformOrder,
  detectLTS,
  setUrlQuery,
  loadAssetInfo,
  orderPlatforms,
  setRadioSelectors,
  setTickLink
} = require('./common');
const {
  variant
} = require('./common');

// Hard coded as Red Hat only ship hotspot
const jvmVariant = 'hotspot';
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const gaSelector = document.getElementById('ga-selector');
const gaButtons = document.getElementsByName('ga');
const urlParams = new URLSearchParams(window.location.search);
const ga = urlParams.get('ga') || 'ga';
gaSelector.onchange = () => {
  const gaButton = Array.from(gaButtons).find(button => button.checked);
  setUrlQuery({
    variant,
    ga: gaButton.value
  });
};
for (let button of gaButtons) {
  if (button.value === ga) {
    button.setAttribute('checked', 'checked');
    break;
  }
}

// When releases page loads, run:
module.exports.load = () => {
  Handlebars.registerHelper('fetchOS', function (title) {
    if (title.split(' ')[2]) {
      // This is so that XL binaries have Large Heap in the name still
      return title.replace(title.split(' ')[1], '');
    } else {
      return title.split(' ')[0];
    }
  });
  Handlebars.registerHelper('fetchArch', function (title) {
    return title.split(' ')[1];
  });
  Handlebars.registerHelper('fetchExtension', function (filename) {
    let extension = `.${filename.split('.').pop()}`;
    // Workaround to prevent extension returning as .gz
    if (extension == '.gz') {
      extension = '.tar.gz';
    }
    return extension;
  });
  const LTS = detectLTS(variant);
  const styles = `
  .download-last-version:after {
      content: "${LTS}";
  }
  `;
  if (LTS !== null) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
  setRadioSelectors();
  loadAssetInfo(variant, jvmVariant, ga, undefined, undefined, undefined, 'openjdk', buildUpstreamHTML, () => {
    // if there are no releases (beyond the latest one)...
    // report an error, remove the loading dots
    loading.innerHTML = '';
    errorContainer.innerHTML = `<p>There are no archived releases yet for ${variant} on the ${jvmVariant} JVM.
      See the <a href='./releases.html?variant=${variant}&jvmVariant=${jvmVariant}'>Latest release</a> page.</p>`;
  });
  const buttons = document.getElementsByClassName('btn-label');
  for (var a = 0; a < buttons.length; a++) {
    if (buttons[a].firstChild.getAttribute('lts') !== 'true') {
      buttons[a].style.display = 'none';
    }
  }
};
function buildUpstreamHTML(releasesJson) {
  // Array of releases that have binaries we want to display
  let releases = [];
  releasesJson[0].binaries.forEach(releaseAsset => {
    const platform = findPlatform(releaseAsset);

    // Skip this asset if its platform could not be matched (see the website's 'config.json')
    if (!platform) {
      return;
    }

    // Skip this asset if it's not a binary type we're interested in displaying
    const binary_type = releaseAsset.image_type.toUpperCase();
    if (!['INSTALLER', 'JDK', 'JRE'].includes(binary_type)) {
      return;
    }

    // Get the existing release asset (passed to the template) or define a new one
    let release = releases.find(release => release.platform_name === platform);
    if (!release) {
      release = {
        platform_name: platform,
        platform_official_name: getOfficialName(platform),
        platform_ordinal: getPlatformOrder(platform),
        platform_supported_version: getSupportedVersion(platform),
        release_name: releasesJson[0].version_data.openjdk_version,
        release_link: releaseAsset.release_link,
        release_datetime: moment(releaseAsset.timestamp).format('YYYY-MM-DD hh:mm:ss'),
        source: releasesJson[0].source.link,
        binaries: []
      };
    }
    let binary_constructor = {
      type: binary_type,
      link: releaseAsset.package.link,
      signature_link: releaseAsset.package.signature_link,
      size: Math.floor(releaseAsset.package.size / 1000 / 1000)
    };

    // Add the new binary to the release asset
    release.binaries.push(binary_constructor);

    // We have the first binary, so add the release asset.
    if (release.binaries.length === 1) {
      releases.push(release);
    }
  });
  releases = orderPlatforms(releases, 'platform_ordinal');
  releases.forEach(release => {
    release.binaries.sort((binaryA, binaryB) => binaryA.type > binaryB.type ? 1 : binaryA.type < binaryB.type ? -1 : 0);
  });
  const templateSelector = Handlebars.compile(document.getElementById('template-selector').innerHTML);
  document.getElementById('latest-selector').innerHTML = templateSelector({
    releases
  });
  setTickLink();
  global.populateFilters('all');
  loading.innerHTML = ''; // remove the loading dots

  const latestContainer = document.getElementById('latest-container');
  latestContainer.className = latestContainer.className.replace(/(?:^|\s)invisible(?!\S)/g, ' animated fadeIn '); // make this section visible (invisible by default), with animated fade-in
}

global.filterOS = () => {
  let os = document.getElementById('os-filter');
  let arch = document.getElementById('arch-filter');
  if (arch.options[arch.selectedIndex].value === 'Any') {
    filterTable(os.options[os.selectedIndex].value, 'os');
    global.populateFilters('arch');
  } else if (os.options[os.selectedIndex].value == 'Any') {
    global.filterArch();
  } else {
    filterTable(os.options[os.selectedIndex].value, 'multi', arch.options[arch.selectedIndex].value);
  }
};
global.filterArch = () => {
  let arch = document.getElementById('arch-filter');
  let os = document.getElementById('os-filter');
  if (os.options[os.selectedIndex].value === 'Any') {
    filterTable(arch.options[arch.selectedIndex].value, 'arch');
  } else if (arch.options[arch.selectedIndex].value == 'Any') {
    global.filterOS();
  } else {
    filterTable(arch.options[arch.selectedIndex].value, 'multi', os.options[os.selectedIndex].value);
  }
};
global.populateFilters = filter => {
  let releaseTable = document.getElementById('latest-selector').getElementsByClassName('releases-table');
  let OSES = ['Any'];
  let ARCHES = ['Any'];
  for (let release of releaseTable) {
    if (release.style.display !== 'none') {
      OSES.push(release.querySelector('.os').innerHTML.split(' ')[0]);
      ARCHES.push(release.querySelector('.arch').innerHTML);
    }
  }
  if (filter == 'all' || filter == 'os') {
    let osFilter = document.getElementById('os-filter');
    let selected = osFilter.options[osFilter.selectedIndex].value;
    osFilter.innerHTML = '';
    for (let os of new Set(OSES)) {
      let option = document.createElement('option');
      option.text = os;
      option.value = os;
      osFilter.append(option);
    }
    osFilter.value = selected;
  }
  if (filter == 'all' || filter == 'arch') {
    let archFilter = document.getElementById('arch-filter');
    let selected = archFilter.options[archFilter.selectedIndex].value;
    archFilter.innerHTML = '';
    for (let arch of new Set(ARCHES)) {
      let option = document.createElement('option');
      option.text = arch;
      option.value = arch;
      archFilter.append(option);
    }
    archFilter.value = selected;
  }
};
function filterTable(string, type, string1) {
  let tables = document.getElementById('latest-selector').getElementsByClassName('releases-table');
  for (let table of tables) {
    if (type === 'multi') {
      let os = table.querySelector('.os').innerHTML;
      let arch = table.querySelector('.arch').innerHTML;
      if (os.startsWith(string) || arch === string) {
        if (os.startsWith(string1) || arch === string1) {
          table.style.display = '';
        } else {
          table.style.display = 'none';
        }
      } else {
        table.style.display = 'none';
      }
    }
    if (type === 'os') {
      if (string === 'Any') {
        table.style.display = '';
      } else {
        let os = table.querySelector('.os').innerHTML;
        if (os.startsWith(string)) {
          table.style.display = '';
        } else {
          table.style.display = 'none';
        }
      }
    }
    if (type === 'arch') {
      if (string == 'Any') {
        table.style.display = '';
      } else {
        let arch = table.querySelector('.arch').innerHTML;
        if (arch === string) {
          table.style.display = '';
        } else {
          table.style.display = 'none';
        }
      }
    }
  }
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./common":49,"core-js/modules/web.dom.iterable.js":47}],54:[function(require,module,exports){
module.exports={
  "variants": [
    {
      "searchableName": "openjdk8",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 8",
      "lts": true
    },
    {
      "searchableName": "openjdk9",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 9",
      "lts": false
    },
    {
      "searchableName": "openjdk10",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 10",
      "lts": false
    },
    {
      "searchableName": "openjdk11",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 11",
      "default": true,
      "lts": true
    },
    {
      "searchableName": "openjdk12",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 12",
      "lts": false
    },
    {
      "searchableName": "openjdk13",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 13",
      "lts": false
    },
    {
      "searchableName": "openjdk14",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 14",
      "lts": false
    },
    {
      "searchableName": "openjdk15",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 15",
      "lts": "false"
    },
    {
      "searchableName": "openjdk16",
      "jvm": ["HotSpot", "OpenJ9"],
      "label": "OpenJDK 16",
      "lts": "latest"
    }
  ],
  "installCommands": [
    {
      "name": "tar",
      "installCommand": "tar xzf FILENAME",
      "pathCommand": "export PATH=$PWD/DIRNAME/bin:$PATH",
      "checksumCommand": "sha256sum FILENAME",
      "checksumAutoCommandHint": " (the command must be run on a terminal in the same directory you download the binary file)",
      "checksumAutoCommand": "wget -O- -q -T 1 -t 1 FILEHASHURL | sha256sum -c"
    },
    {
      "name": "gunzip",
      "installCommand": "gunzip -c FILENAME | tar xf -",
      "pathCommand": "export PATH=$PWD/DIRNAME/bin:$PATH",
      "checksumCommand": "sha256sum FILENAME",
      "checksumAutoCommandHint": " (the command must be run on a terminal in the same directory you download the binary file)",
      "checksumAutoCommand": "wget -O- -q -T 1 -t 1 FILEHASHURL | sha256sum -c"
    },
    {
        "name": "powershell",
        "installCommand": "powershell -Command Expand-Archive -Path .\\FILENAME -DestinationPath .",
        "pathCommand": "set PATH=%cd%\\DIRNAME\\bin;%PATH%",
        "checksumCommand": "certutil -hashfile FILENAME SHA256",
        "checksumAutoCommandHint": " (the command must be run using Command Prompt in the same directory you download the binary file and requires PowerShell 3.0+)",
        "checksumAutoCommand": "powershell -command \"[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  iwr -outf FILEHASHNAME FILEHASHURL\" && powershell \"$CHECKSUMVAR=($(Get-FileHash -Algorithm SHA256 -LiteralPath FILENAME | Format-List -Property Hash | Out-String) -replace \\\"Hash : \\\", \\\"\\\" -replace \\\"`r`n\\\", \\\"\\\"); Select-String -LiteralPath FILEHASHNAME -Pattern $CHECKSUMVAR | Format-List -Property FileName | Out-String\" | find /i \"FILEHASHNAME\">Nul && ( echo \"FILENAME: The SHA-256 fingerprint matches\" ) || ( echo \"FILENAME: The SHA-256 fingerprint does NOT match\" )"
    }
  ],
  "platforms": [
    {
      "officialName": "Linux x64",
      "searchableName": "X64_LINUX",
      "attributes": {
        "heap_size": "normal",
        "os": "linux",
        "architecture": "x64"
      },
      "osDetectionString": "Linux Mint Debian Fedora FreeBSD Gentoo Haiku Kubuntu OpenBSD Red Hat RHEL SuSE Ubuntu Xubuntu hpwOS webOS Tizen",
      "supported_version": {
        "_comment_": "Version numbers use >= logic and need to be specified in ascending order",
        "hotspot": "glibc version 2.12 or higher",
        "openj9": {
          "8": "glibc version 2.12 or higher",
          "15": "glibc version 2.17 or higher"
        }
      }
    },
    {
      "officialName": "Alpine x64",
      "searchableName": "LINUXALPINE",
      "attributes": {
        "heap_size": "normal",
        "os": "alpine-linux",
        "architecture": "x64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "Alpine Linux 3.5 or later"
    },
    {
      "officialName": "Linux x64 Large Heap",
      "searchableName": "LINUXXL",
      "attributes": {
        "heap_size": "large",
        "os": "linux",
        "architecture": "x64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": {
        "_comment_": "Version numbers use >= logic and need to be specified in ascending order",
        "openj9": {
          "8": "glibc version 2.12 or higher",
          "15": "glibc version 2.17 or higher"
        }
      }
    },
    {
      "officialName": "Windows x86",
      "searchableName": "X86-32_WIN",
      "attributes": {
        "heap_size": "normal",
        "os": "windows",
        "architecture": "x32"
      },
      "osDetectionString": "Windows Win Cygwin Windows Server 2008 R2 / 7 Windows Server 2008 / Vista Windows XP",
      "supported_version": "2012r2 or later"
    },
    {
      "officialName": "Windows x64",
      "searchableName": "X64_WIN",
      "attributes": {
        "heap_size": "normal",
        "os": "windows",
        "architecture": "x64"
      },
      "osDetectionString": "Windows Win Cygwin Windows Server 2008 R2 / 7 Windows Server 2008 / Vista Windows XP",
      "supported_version": "2012r2 or later"
    },
    {
      "officialName": "Windows aarch64",
      "searchableName": "AARCH64_WIN",
      "attributes": {
        "heap_size": "normal",
        "os": "windows",
        "architecture": "aarch64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "2016 or later"
    },
    {
      "officialName": "Windows x64 Large Heap",
      "searchableName": "X64_WINXL",
      "attributes": {
        "heap_size": "large",
        "os": "windows",
        "architecture": "x64"
      },
      "osDetectionString": "Windows Win Cygwin Windows Server 2008 R2 / 7 Windows Server 2008 / Vista Windows XP",
      "supported_version": "2012r2 or later"
    },
    {
      "officialName": "macOS x64",
      "searchableName": "X64_MAC",
      "attributes": {
        "heap_size": "normal",
        "os": "mac",
        "architecture": "x64"
      },
      "osDetectionString": "Mac OS X OSX macOS Macintosh",
      "supported_version": "10.10 or later"
    },
    {
      "officialName": "macOS x64 Large Heap",
      "searchableName": "MACOSXL",
      "attributes": {
        "heap_size": "large",
        "os": "mac",
        "architecture": "x64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "10.10 or later"
    },
    {
      "officialName": "Linux s390x",
      "searchableName": "S390X_LINUX",
      "attributes": {
        "heap_size": "normal",
        "os": "linux",
        "architecture": "s390x"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Linux s390x Large Heap",
      "searchableName": "LINUXS390XXL",
      "attributes": {
        "heap_size": "large",
        "os": "linux",
        "architecture": "s390x"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Linux ppc64le",
      "searchableName": "PPC64LE_LINUX",
      "attributes": {
        "heap_size": "normal",
        "os": "linux",
        "architecture": "ppc64le"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Linux ppc64le Large Heap",
      "searchableName": "LINUXPPC64LEXL",
      "attributes": {
        "heap_size": "large",
        "os": "linux",
        "architecture": "ppc64le"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Linux aarch64",
      "searchableName": "AARCH64_LINUX",
      "attributes": {
        "heap_size": "normal",
        "os": "linux",
        "architecture": "aarch64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Linux aarch64 Large Heap",
      "searchableName": "AARCH64_LINUXXL",
      "attributes": {
        "heap_size": "large",
        "os": "linux",
        "architecture": "aarch64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Linux arm32",
      "searchableName": "ARM32_LINUX",
      "attributes": {
        "heap_size": "normal",
        "os": "linux",
        "architecture": "arm"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.17 or higher"
    },
    {
      "officialName": "Solaris sparcv9",
      "searchableName": "SPARCV9_SOLARIS",
      "attributes": {
        "heap_size": "normal",
        "os": "solaris",
        "architecture": "sparcv9"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "solaris 10,11"
    },
    {
      "officialName": "Solaris x64",
      "searchableName": "X64_SOLARIS",
      "attributes": {
        "heap_size": "normal",
        "os": "solaris",
        "architecture": "x64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "solaris 10,11"
    },
    {
      "officialName": "AIX ppc64",
      "searchableName": "PPC64_AIX",
      "attributes": {
        "heap_size": "normal",
        "os": "aix",
        "architecture": "ppc64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "7.1 TL4 or later"
    },
    {
      "officialName": "Linux riscv64",
      "searchableName": "RISCV64",
      "attributes": {
        "heap_size": "normal",
        "os": "linux",
        "architecture": "riscv64"
      },
      "osDetectionString": "not-to-be-detected",
      "supported_version": "glibc version 2.27 or higher"
    }
  ]
}

},{}]},{},[50]);
