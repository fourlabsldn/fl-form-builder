function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }

function blinkRed(el) {
  if (!el || !el.classList) {
    return;
  }

  el.classList.add('fl-blink-red');
  setTimeout(function () {
    el.classList.remove('fl-blink-red');
  }, 1500);
}

var _core = __commonjs(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var require$$2 = (_core && typeof _core === 'object' && 'default' in _core ? _core['default'] : _core);

var _fails = __commonjs(function (module) {
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
});

var require$$0$3 = (_fails && typeof _fails === 'object' && 'default' in _fails ? _fails['default'] : _fails);

var _descriptors = __commonjs(function (module) {
// Thank's IE8 for his funny defineProperty
module.exports = !require$$0$3(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
});

var require$$0$2 = (_descriptors && typeof _descriptors === 'object' && 'default' in _descriptors ? _descriptors['default'] : _descriptors);

var _isObject = __commonjs(function (module) {
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
});

var require$$3$1 = (_isObject && typeof _isObject === 'object' && 'default' in _isObject ? _isObject['default'] : _isObject);

var _toPrimitive = __commonjs(function (module) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require$$3$1;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
});

var require$$3 = (_toPrimitive && typeof _toPrimitive === 'object' && 'default' in _toPrimitive ? _toPrimitive['default'] : _toPrimitive);

var _global = __commonjs(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var require$$3$2 = (_global && typeof _global === 'object' && 'default' in _global ? _global['default'] : _global);

var _domCreate = __commonjs(function (module) {
var isObject = require$$3$1
  , document = require$$3$2.document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
});

var require$$1$2 = (_domCreate && typeof _domCreate === 'object' && 'default' in _domCreate ? _domCreate['default'] : _domCreate);

var _ie8DomDefine = __commonjs(function (module) {
module.exports = !require$$0$2 && !require$$0$3(function(){
  return Object.defineProperty(require$$1$2('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
});

var require$$1$1 = (_ie8DomDefine && typeof _ie8DomDefine === 'object' && 'default' in _ie8DomDefine ? _ie8DomDefine['default'] : _ie8DomDefine);

var _anObject = __commonjs(function (module) {
var isObject = require$$3$1;
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
});

var require$$2$1 = (_anObject && typeof _anObject === 'object' && 'default' in _anObject ? _anObject['default'] : _anObject);

var _objectDp = __commonjs(function (module, exports) {
var anObject       = require$$2$1
  , IE8_DOM_DEFINE = require$$1$1
  , toPrimitive    = require$$3
  , dP             = Object.defineProperty;

exports.f = require$$0$2 ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
});

var require$$1 = (_objectDp && typeof _objectDp === 'object' && 'default' in _objectDp ? _objectDp['default'] : _objectDp);

var _uid = __commonjs(function (module) {
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
});

var require$$4 = (_uid && typeof _uid === 'object' && 'default' in _uid ? _uid['default'] : _uid);

var _shared = __commonjs(function (module) {
var global = require$$3$2
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
});

var require$$1$3 = (_shared && typeof _shared === 'object' && 'default' in _shared ? _shared['default'] : _shared);

var _wks = __commonjs(function (module) {
var store      = require$$1$3('wks')
  , uid        = require$$4
  , Symbol     = require$$3$2.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
});

var require$$0$5 = (_wks && typeof _wks === 'object' && 'default' in _wks ? _wks['default'] : _wks);

var _wksExt = __commonjs(function (module, exports) {
exports.f = require$$0$5;
});

var require$$0$4 = (_wksExt && typeof _wksExt === 'object' && 'default' in _wksExt ? _wksExt['default'] : _wksExt);

var _library = __commonjs(function (module) {
module.exports = true;
});

var require$$9 = (_library && typeof _library === 'object' && 'default' in _library ? _library['default'] : _library);

var _wksDefine = __commonjs(function (module) {
var global         = require$$3$2
  , core           = require$$2
  , LIBRARY        = require$$9
  , wksExt         = require$$0$4
  , defineProperty = require$$1.f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
});

var require$$17 = (_wksDefine && typeof _wksDefine === 'object' && 'default' in _wksDefine ? _wksDefine['default'] : _wksDefine);

var es7_symbol_observable = __commonjs(function (module) {
require$$17('observable');
});

var es7_symbol_asyncIterator = __commonjs(function (module) {
require$$17('asyncIterator');
});

var _propertyDesc = __commonjs(function (module) {
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
});

var require$$3$3 = (_propertyDesc && typeof _propertyDesc === 'object' && 'default' in _propertyDesc ? _propertyDesc['default'] : _propertyDesc);

var _hide = __commonjs(function (module) {
var dP         = require$$1
  , createDesc = require$$3$3;
module.exports = require$$0$2 ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
});

var require$$1$4 = (_hide && typeof _hide === 'object' && 'default' in _hide ? _hide['default'] : _hide);

var _objectGops = __commonjs(function (module, exports) {
exports.f = Object.getOwnPropertySymbols;
});

var require$$1$5 = (_objectGops && typeof _objectGops === 'object' && 'default' in _objectGops ? _objectGops['default'] : _objectGops);

var _objectPie = __commonjs(function (module, exports) {
exports.f = {}.propertyIsEnumerable;
});

var require$$0$6 = (_objectPie && typeof _objectPie === 'object' && 'default' in _objectPie ? _objectPie['default'] : _objectPie);

var _enumBugKeys = __commonjs(function (module) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
});

var require$$3$4 = (_enumBugKeys && typeof _enumBugKeys === 'object' && 'default' in _enumBugKeys ? _enumBugKeys['default'] : _enumBugKeys);

var _sharedKey = __commonjs(function (module) {
var shared = require$$1$3('keys')
  , uid    = require$$4;
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
});

var require$$0$8 = (_sharedKey && typeof _sharedKey === 'object' && 'default' in _sharedKey ? _sharedKey['default'] : _sharedKey);

var _toInteger = __commonjs(function (module) {
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
});

var require$$1$8 = (_toInteger && typeof _toInteger === 'object' && 'default' in _toInteger ? _toInteger['default'] : _toInteger);

var _toIndex = __commonjs(function (module) {
var toInteger = require$$1$8
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
});

var require$$0$9 = (_toIndex && typeof _toIndex === 'object' && 'default' in _toIndex ? _toIndex['default'] : _toIndex);

var _toLength = __commonjs(function (module) {
// 7.1.15 ToLength
var toInteger = require$$1$8
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
});

var require$$1$9 = (_toLength && typeof _toLength === 'object' && 'default' in _toLength ? _toLength['default'] : _toLength);

var _defined = __commonjs(function (module) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
});

var require$$0$10 = (_defined && typeof _defined === 'object' && 'default' in _defined ? _defined['default'] : _defined);

var _cof = __commonjs(function (module) {
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
});

var require$$0$11 = (_cof && typeof _cof === 'object' && 'default' in _cof ? _cof['default'] : _cof);

var _iobject = __commonjs(function (module) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require$$0$11;
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
});

var require$$1$11 = (_iobject && typeof _iobject === 'object' && 'default' in _iobject ? _iobject['default'] : _iobject);

var _toIobject = __commonjs(function (module) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require$$1$11
  , defined = require$$0$10;
module.exports = function(it){
  return IObject(defined(it));
};
});

var require$$1$10 = (_toIobject && typeof _toIobject === 'object' && 'default' in _toIobject ? _toIobject['default'] : _toIobject);

var _arrayIncludes = __commonjs(function (module) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require$$1$10
  , toLength  = require$$1$9
  , toIndex   = require$$0$9;
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
});

var require$$1$7 = (_arrayIncludes && typeof _arrayIncludes === 'object' && 'default' in _arrayIncludes ? _arrayIncludes['default'] : _arrayIncludes);

var _has = __commonjs(function (module) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
});

var require$$2$2 = (_has && typeof _has === 'object' && 'default' in _has ? _has['default'] : _has);

var _objectKeysInternal = __commonjs(function (module) {
var has          = require$$2$2
  , toIObject    = require$$1$10
  , arrayIndexOf = require$$1$7(false)
  , IE_PROTO     = require$$0$8('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
});

var require$$1$6 = (_objectKeysInternal && typeof _objectKeysInternal === 'object' && 'default' in _objectKeysInternal ? _objectKeysInternal['default'] : _objectKeysInternal);

var _objectGopn = __commonjs(function (module, exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require$$1$6
  , hiddenKeys = require$$3$4.concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
});

var require$$0$7 = (_objectGopn && typeof _objectGopn === 'object' && 'default' in _objectGopn ? _objectGopn['default'] : _objectGopn);

var _objectKeys = __commonjs(function (module) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require$$1$6
  , enumBugKeys = require$$3$4;

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
});

var require$$1$12 = (_objectKeys && typeof _objectKeys === 'object' && 'default' in _objectKeys ? _objectKeys['default'] : _objectKeys);

var _objectGopd = __commonjs(function (module, exports) {
var pIE            = require$$0$6
  , createDesc     = require$$3$3
  , toIObject      = require$$1$10
  , toPrimitive    = require$$3
  , has            = require$$2$2
  , IE8_DOM_DEFINE = require$$1$1
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require$$0$2 ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
});

var require$$7 = (_objectGopd && typeof _objectGopd === 'object' && 'default' in _objectGopd ? _objectGopd['default'] : _objectGopd);

var _objectGopnExt = __commonjs(function (module) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require$$1$10
  , gOPN      = require$$0$7.f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};
});

var require$$8 = (_objectGopnExt && typeof _objectGopnExt === 'object' && 'default' in _objectGopnExt ? _objectGopnExt['default'] : _objectGopnExt);

var _html = __commonjs(function (module) {
module.exports = require$$3$2.document && document.documentElement;
});

var require$$0$12 = (_html && typeof _html === 'object' && 'default' in _html ? _html['default'] : _html);

var _objectDps = __commonjs(function (module) {
var dP       = require$$1
  , anObject = require$$2$1
  , getKeys  = require$$1$12;

module.exports = require$$0$2 ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
});

var require$$4$2 = (_objectDps && typeof _objectDps === 'object' && 'default' in _objectDps ? _objectDps['default'] : _objectDps);

var _objectCreate = __commonjs(function (module) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require$$2$1
  , dPs         = require$$4$2
  , enumBugKeys = require$$3$4
  , IE_PROTO    = require$$0$8('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require$$1$2('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require$$0$12.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
});

var require$$4$1 = (_objectCreate && typeof _objectCreate === 'object' && 'default' in _objectCreate ? _objectCreate['default'] : _objectCreate);

var _isArray = __commonjs(function (module) {
// 7.2.2 IsArray(argument)
var cof = require$$0$11;
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
});

var require$$14 = (_isArray && typeof _isArray === 'object' && 'default' in _isArray ? _isArray['default'] : _isArray);

var _enumKeys = __commonjs(function (module) {
// all enumerable object keys, includes symbols
var getKeys = require$$1$12
  , gOPS    = require$$1$5
  , pIE     = require$$0$6;
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
});

var require$$15 = (_enumKeys && typeof _enumKeys === 'object' && 'default' in _enumKeys ? _enumKeys['default'] : _enumKeys);

var _keyof = __commonjs(function (module) {
var getKeys   = require$$1$12
  , toIObject = require$$1$10;
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
});

var require$$16 = (_keyof && typeof _keyof === 'object' && 'default' in _keyof ? _keyof['default'] : _keyof);

var _setToStringTag = __commonjs(function (module) {
var def = require$$1.f
  , has = require$$2$2
  , TAG = require$$0$5('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
});

var require$$2$3 = (_setToStringTag && typeof _setToStringTag === 'object' && 'default' in _setToStringTag ? _setToStringTag['default'] : _setToStringTag);

var _meta = __commonjs(function (module) {
var META     = require$$4('meta')
  , isObject = require$$3$1
  , has      = require$$2$2
  , setDesc  = require$$1.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require$$0$3(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
});

var require$$24 = (_meta && typeof _meta === 'object' && 'default' in _meta ? _meta['default'] : _meta);

var _redefine = __commonjs(function (module) {
module.exports = require$$1$4;
});

var require$$7$1 = (_redefine && typeof _redefine === 'object' && 'default' in _redefine ? _redefine['default'] : _redefine);

var _aFunction = __commonjs(function (module) {
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
});

var require$$0$13 = (_aFunction && typeof _aFunction === 'object' && 'default' in _aFunction ? _aFunction['default'] : _aFunction);

var _ctx = __commonjs(function (module) {
// optional / simple context binding
var aFunction = require$$0$13;
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
});

var require$$1$13 = (_ctx && typeof _ctx === 'object' && 'default' in _ctx ? _ctx['default'] : _ctx);

var _export = __commonjs(function (module, exports) {
var global    = require$$3$2
  , core      = require$$2
  , ctx       = require$$1$13
  , hide      = require$$1$4
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
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
});

var require$$8$1 = (_export && typeof _export === 'object' && 'default' in _export ? _export['default'] : _export);

var es6_symbol = __commonjs(function (module) {
'use strict';
// ECMAScript 6 symbols shim
var global         = require$$3$2
  , has            = require$$2$2
  , DESCRIPTORS    = require$$0$2
  , $export        = require$$8$1
  , redefine       = require$$7$1
  , META           = require$$24.KEY
  , $fails         = require$$0$3
  , shared         = require$$1$3
  , setToStringTag = require$$2$3
  , uid            = require$$4
  , wks            = require$$0$5
  , wksExt         = require$$0$4
  , wksDefine      = require$$17
  , keyOf          = require$$16
  , enumKeys       = require$$15
  , isArray        = require$$14
  , anObject       = require$$2$1
  , toIObject      = require$$1$10
  , toPrimitive    = require$$3
  , createDesc     = require$$3$3
  , _create        = require$$4$1
  , gOPNExt        = require$$8
  , $GOPD          = require$$7
  , $DP            = require$$1
  , $keys          = require$$1$12
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require$$0$7.f = gOPNExt.f = $getOwnPropertyNames;
  require$$0$6.f  = $propertyIsEnumerable;
  require$$1$5.f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require$$9){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require$$1$4($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
});

var index = __commonjs(function (module) {
module.exports = require$$2.Symbol;
});

var require$$0$1 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

var symbol = __commonjs(function (module) {
module.exports = { "default": require$$0$1, __esModule: true };
});

var require$$0 = (symbol && typeof symbol === 'object' && 'default' in symbol ? symbol['default'] : symbol);

var _iterators = __commonjs(function (module) {
module.exports = {};
});

var require$$4$3 = (_iterators && typeof _iterators === 'object' && 'default' in _iterators ? _iterators['default'] : _iterators);

var _toObject = __commonjs(function (module) {
// 7.1.13 ToObject(argument)
var defined = require$$0$10;
module.exports = function(it){
  return Object(defined(it));
};
});

var require$$1$16 = (_toObject && typeof _toObject === 'object' && 'default' in _toObject ? _toObject['default'] : _toObject);

var _objectGpo = __commonjs(function (module) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require$$2$2
  , toObject    = require$$1$16
  , IE_PROTO    = require$$0$8('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
});

var require$$1$15 = (_objectGpo && typeof _objectGpo === 'object' && 'default' in _objectGpo ? _objectGpo['default'] : _objectGpo);

var _iterCreate = __commonjs(function (module) {
'use strict';
var create         = require$$4$1
  , descriptor     = require$$3$3
  , setToStringTag = require$$2$3
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require$$1$4(IteratorPrototype, require$$0$5('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
});

var require$$3$5 = (_iterCreate && typeof _iterCreate === 'object' && 'default' in _iterCreate ? _iterCreate['default'] : _iterCreate);

var _iterDefine = __commonjs(function (module) {
'use strict';
var LIBRARY        = require$$9
  , $export        = require$$8$1
  , redefine       = require$$7$1
  , hide           = require$$1$4
  , has            = require$$2$2
  , Iterators      = require$$4$3
  , $iterCreate    = require$$3$5
  , setToStringTag = require$$2$3
  , getPrototypeOf = require$$1$15
  , ITERATOR       = require$$0$5('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
});

var require$$0$15 = (_iterDefine && typeof _iterDefine === 'object' && 'default' in _iterDefine ? _iterDefine['default'] : _iterDefine);

var _iterStep = __commonjs(function (module) {
module.exports = function(done, value){
  return {value: value, done: !!done};
};
});

var require$$3$6 = (_iterStep && typeof _iterStep === 'object' && 'default' in _iterStep ? _iterStep['default'] : _iterStep);

var _addToUnscopables = __commonjs(function (module) {
module.exports = function(){ /* empty */ };
});

var require$$4$4 = (_addToUnscopables && typeof _addToUnscopables === 'object' && 'default' in _addToUnscopables ? _addToUnscopables['default'] : _addToUnscopables);

var es6_array_iterator = __commonjs(function (module) {
'use strict';
var addToUnscopables = require$$4$4
  , step             = require$$3$6
  , Iterators        = require$$4$3
  , toIObject        = require$$1$10;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require$$0$15(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
});

var web_dom_iterable = __commonjs(function (module) {
var global        = require$$3$2
  , hide          = require$$1$4
  , Iterators     = require$$4$3
  , TO_STRING_TAG = require$$0$5('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
});

var _stringAt = __commonjs(function (module) {
var toInteger = require$$1$8
  , defined   = require$$0$10;
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
});

var require$$1$17 = (_stringAt && typeof _stringAt === 'object' && 'default' in _stringAt ? _stringAt['default'] : _stringAt);

var es6_string_iterator = __commonjs(function (module) {
'use strict';
var $at  = require$$1$17(true);

// 21.1.3.27 String.prototype[@@iterator]()
require$$0$15(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
});

var iterator$1 = __commonjs(function (module) {
module.exports = require$$0$4.f('iterator');
});

var require$$0$14 = (iterator$1 && typeof iterator$1 === 'object' && 'default' in iterator$1 ? iterator$1['default'] : iterator$1);

var iterator = __commonjs(function (module) {
module.exports = { "default": require$$0$14, __esModule: true };
});

var require$$1$14 = (iterator && typeof iterator === 'object' && 'default' in iterator ? iterator['default'] : iterator);

var _typeof = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _iterator = require$$1$14;

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require$$0;

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof$1 = (_typeof && typeof _typeof === 'object' && 'default' in _typeof ? _typeof['default'] : _typeof);

/**
 * @function throttle
 * @param  {integer}   FuncDelay
 * @param  {Function} callback
 * @return {Function}                  the throttled function
 */
function throttle(FuncDelay, callback) {
  var lastCall = +new Date();
  var delay = FuncDelay;
  var params = void 0;
  var context = {};
  var calledDuringDelay = false;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = +new Date();
    var diff = now - lastCall;
    var timeToEndOfDelay = void 0;

    params = args;

    if (diff > delay) {
      callback.apply(context, params); // Call function with latest parameters
      calledDuringDelay = false;
      lastCall = now;
    } else if (!calledDuringDelay) {
      // If it wasn't called yet, call it when there is enough delay.
      timeToEndOfDelay = delay - diff;

      setTimeout(function () {
        callback.apply(context, params); // Call function with latest parameters
      }, timeToEndOfDelay);

      calledDuringDelay = true;
      lastCall = now + timeToEndOfDelay;
    } // Otherwise do nothing.
  };
}

/**
 * Will take care of the dragging and reordering a list for one drag.
 * @function trackReorderDrag
 * @param  {event} paramE        The dragstart event, from which this should be called.
 * @param  {HTMLElement} paramEl       The main Element being dragged
 * @param  {Array} paramElements Array of elements to be tracked.
 * @return {void}
 */
function trackReorderDrag(paramE, paramEl, paramElements) {
  function setTranslation(el, val) {
    el.style.transform = 'translate3d(0, ' + val + 'px, 0)'; //  eslint-disable-line no-param-reassign
  }

  /**
   * @function resetElementsPositions
   * @param {Array[HTMLElement]} els Elements being tracked
   */
  function resetElementsPositions(els) {
    els.forEach(function (el) {
      setTranslation(el, 0);
    });
  }

  /**
   * @function calculateElementHeight
   * @param  {Array[HTMLElement]} els    Elements ordered by vertical position
   * @param  {Integer} elIndex
   * @return {void}
   */
  function calculateElementHeight(els, elIndex) {
    var spaceOccupied = void 0;

    // If not the last element
    if (elIndex < els.length - 1) {
      var elTop = els[elIndex].getBoundingClientRect().top;
      var nextElTop = els[elIndex + 1].getBoundingClientRect().top;
      spaceOccupied = nextElTop - elTop;
    } else {
      // let's estimate the general vertical distance between elements by
      // subtracting the size of the first element from the distance between
      // its top and the next element.
      var firstElSpaceOccupied = els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
      var verticalDistance = firstElSpaceOccupied - els[0].clientHeight;
      var height = els[elIndex].clientHeight;
      spaceOccupied = height + verticalDistance;
    }

    return spaceOccupied;
  }

  /**
   * @function createDragMover
   * @param  {Array[HTMLElements]} els         [description]
   * @param  {Array[Integer]} tops        Initial tops
   * @param  {Integer} targetIndex Index of element being dragged around
   * @return {function}             The function to translate elements in the
   *                                  list to make room for the dragged element
   */
  function createDragMover(els, tops, targetIndex) {
    var target = els[targetIndex];
    var targetInitialTop = tops[targetIndex];
    var targetHeight = calculateElementHeight(els, targetIndex);
    return function doDragMove() {
      var targetTop = target.getBoundingClientRect().top;
      var movedUp = targetTop < targetInitialTop;

      var i = void 0;
      for (i = 0; i < tops.length; i++) {
        if (i === targetIndex) {
          continue;
        } else if (!movedUp && targetTop > tops[i] && tops[i] > targetInitialTop) {
          setTranslation(els[i], -targetHeight);
        } else if (movedUp && targetTop < tops[i + 1] && tops[i] < targetInitialTop) {
          setTranslation(els[i], targetHeight);
        } else {
          setTranslation(els[i], 0);
        }
      }
    };
  }

  function createDragListener(els, tops, targetIndex, initialY) {
    var target = els[targetIndex];
    var doDragMove = createDragMover(els, tops, targetIndex);
    var shouldStopListening = void 0;
    function dragListener(e) {
      if (shouldStopListening) {
        return;
      }

      doDragMove();
      var newY = e.pageY;
      if (newY === 0) {
        return;
      } // correct weird behaviour when mouse goes up

      var diff = newY - initialY;
      setTranslation(target, diff);
    }

    dragListener.stop = function () {
      shouldStopListening = true;
    };

    return dragListener;
  }

  function getElementsCurrentTop(els) {
    var tops = [];
    els.forEach(function (el) {
      tops.push(el.getBoundingClientRect().top);
    });

    return tops;
  }

  // function adjustElementsToTops(els, tops) {
  //   const currentTops = getElementsCurrentTop(els);
  //   els.forEach(function (el, i) {
  //     const diff =  currentTops[i] - tops[i];
  //     setTranslation(el, diff);
  //   });
  // }

  function insertTargetInRightPlace(els, initialTops, targetIndex) {
    var target = els[targetIndex];
    var topsBeforeInsertion = getElementsCurrentTop(els);
    var targetTop = topsBeforeInsertion[targetIndex];
    var i = 0;

    // Pass by all elements that are above the target
    while (topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop || i === targetIndex) {
      i++;
    }

    // Take away transitions from all elements and save them
    var initialTransitions = [];
    els.forEach(function (anEl) {
      initialTransitions.push(anEl.style.transition);
      anEl.style.transition = 'none'; // eslint-disable-line no-param-reassign
    });

    // Put everyone at translate3d(0,0,0) without transitions
    resetElementsPositions(els);

    // Add the element in the appropriate place. This will displace everyone else.
    var parent = els[i] ? els[i].parentElement : els[els.length - 1].parentElement;
    if (!parent || !parent.appendChild) {
      throw new Error('trackReorderDrag(): No parent found in element list.');
    } else if (els[i]) {
      parent.insertBefore(target, els[i]);
    } else {
      var lastEl = els[els.length - 1];
      parent.insertBefore(target, lastEl);
      parent.insertBefore(lastEl, target);
    }

    // Now let's translate it to where it was just before it was repositioned
    // All without transitions. It will seem like it never left that spot.
    var futureTop = target.getBoundingClientRect().top;
    var displacement = targetTop - futureTop;
    setTranslation(target, displacement);

    // Let's add a timeout to get the last place in the UI queue and let the
    // CSS renderer to process the fact that all these elements do not have
    // transitions and should appear wherever their coordinates say immediately.
    setTimeout(function () {
      // Restore all transitions
      els.forEach(function (anEl, k) {
        anEl.style.transition = initialTransitions[k]; // eslint-disable-line no-param-reassign
      });

      // Now transition the target can transition smoothly from where it
      // was dropped to its final position at translate value 0.
      setTranslation(target, 0);
    }, 15);

    //  adjustElementsToTops(els, topsBeforeInsertion);
  }

  function init(e, el, elements) {
    if ((typeof el === 'undefined' ? 'undefined' : _typeof$1(el)) !== 'object') {
      throw new Error('trackReorderDrag(): Invalid parameter');
    }

    // Reorder elements
    elements.sort(function (el1, el2) {
      return el1.getBoundingClientRect().top > el2.getBoundingClientRect().top;
    });

    // Set initial states
    var initialTops = [];
    elements.forEach(function (element) {
      initialTops.push(element.getBoundingClientRect().top);
    });

    var elIndex = elements.indexOf(el);

    // Create throttled drag listener
    var initialY = e.pageY;
    var dragListener = createDragListener(elements, initialTops, elIndex, initialY);
    var throttledDragListener = throttle(50, dragListener);

    // Listen to drags
    var eventTarget = e.target;
    eventTarget.addEventListener('drag', throttledDragListener);
    eventTarget.addEventListener('dragend', function dragEndListener() {
      dragListener.stop();
      insertTargetInRightPlace(elements, initialTops, elIndex);
      eventTarget.removeEventListener('drag', throttledDragListener);
      eventTarget.removeEventListener('dragend', dragEndListener);
    });
  }

  init(paramE, paramEl, paramElements);
}

var utils = {
  blinkRed: blinkRed,
  trackReorderDrag: trackReorderDrag,
  throttle: throttle
};

function FormBody() {
  'use strict';

  var _this = this;

  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  var form = void 0;
  var submitBtn = void 0;
  var components = [];

  function getAllComponents() {
    var comps = form.querySelectorAll('.fl-component');
    return [].slice.call(comps);
  }

  function addReorderButton(comp) {
    var controls = comp.element.querySelector('.fl-component-side-control');
    if (!controls) {
      throw new Error('FormBody.addReorderButton(): No side control bar defined');
    }

    var dragBtn = document.createElement('i');
    dragBtn.classList.add('glyphicon', 'glyphicon-menu-hamburger');
    dragBtn.setAttribute('draggable', true);
    dragBtn.title = 'Drag to reorder';

    dragBtn.addEventListener('dragstart', function (e) {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      comp.element.classList.add('fl-dragging');

      // Take care of moving and reordering
      var elements = getAllComponents();
      utils.trackReorderDrag(e, comp.element, elements);
    });

    var throttleDelay = 50;
    dragBtn.addEventListener('dragend', function () {
      setTimeout(function () {
        comp.element.classList.remove('fl-dragging');
      }, throttleDelay + 200);
    });

    // prepend to side control bar
    if (controls.children.length > 0) {
      controls.insertBefore(dragBtn, controls.children[0]);
    } else {
      controls.appendChild(dragBtn);
    }
  }

  this.addComponent = function addComponent(comp) {
    if (!form) {
      console.error('FormBody: Form not initialised.');
      return;
    } else if (!comp) {
      console.error('FormBody: No element to be added included.');
      return;
    }
    addReorderButton(comp);
    components.push(comp);
    form.insertBefore(comp.element, submitBtn);
    comp.configToggle(true);
  };

  this.removeComponent = function removeComponent(comp) {
    var compIndex = components.indexOf(comp);
    if (compIndex < 0) {
      throw new Error('FormBody.removeComponent(): ' + 'Component being destroyed is not registered in FormBody.');
    }

    components.splice(compIndex, 1);
    comp.destroy();
  };

  this.init = function () {
    form = document.createElement('form');
    form.classList.add('form-horizontal', 'fl-form-body');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Submit button clicked.');

      // Reorder components array according to their vertical position
      components.sort(function (com1, com2) {
        return com1.element.getBoundingClientRect().top > com2.element.getBoundingClientRect().top;
      });

      //  NOTE: Components are prepared to expose the appropriate values
      //  when stringified. To export them they need to be stringified.
      var readyToExport = JSON.stringify(components);
      console.dir(JSON.parse(readyToExport));

      // For now let's emmit an event with the result.
      var ev = new CustomEvent('formSubmitted', { detail: { json: readyToExport },
        bubbles: true,
        cancelable: true
      });

      form.dispatchEvent(ev);
    });

    // Listen to new components being created
    form.addEventListener('addComponent', function (e) {
      if (!e.detail) {
        throw new Error('No data in "newElement" event.');
      }

      _this.addComponent(e.detail.comp);
    });

    // Listen to delete buttons being pressed
    form.addEventListener('removeComponent', function (e) {
      if (!e.detail) {
        throw new Error('No data in "removeElement" event.');
      }

      _this.removeComponent(e.detail.comp);
    });

    submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('btn', 'col-sm-12');
    form.appendChild(submitBtn);
    _this.element = form;
  };

  this.init();
}

/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }
}

FormComponent.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  // Create wrapper element
  this.element = document.createElement('div');
  this.element.classList.add('fl-component', 'col-md-12', 'form-group');

  // Create div where content will go
  this.content = document.createElement('div');
  this.content.classList.add('fl-form-content');
  this.element.appendChild(this.content);

  // Create a title
  var title = document.createElement('h3');
  title.innerText = 'Add a title';
  title.classList.add('fl-editable');
  this.title = title;
  this.content.appendChild(title);

  this.name = name;
  this.isRequired = false;
  this.createControls();
};

/**
 * Creates the config box
 * @method createControls
 * @return {void}
 */
FormComponent.prototype.createControls = function createControls() {
  var _this2 = this;

  // Create side control bar -----------------------------
  var controls = document.createElement('div');
  controls.classList.add('fl-component-side-control');

  var moreConfigBtn = document.createElement('button');
  moreConfigBtn.setAttribute('type', 'button');
  moreConfigBtn.classList.add('glyphicon', 'glyphicon-cog');
  moreConfigBtn.title = 'Configure form group';
  controls.appendChild(moreConfigBtn);

  moreConfigBtn.addEventListener('click', function () {
    _this2.configToggle();
  });

  // Create configuration box -----------------------------
  var configBox = document.createElement('div');
  configBox.classList.add('fl-component-config');
  this.configBox = configBox;

  // Component-specific content wrapper
  var configContent = document.createElement('div');
  configContent.classList.add('full-width');
  this.configContent = configContent;
  configBox.appendChild(configContent);

  // Bottom buttons container
  var buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('col-sm-12');

  var deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute('name', 'delete');
  deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'fl-bottom-btn', 'glyphicon', 'glyphicon-trash');
  deleteBtn.addEventListener('click', function () {
    var ev = new CustomEvent('removeComponent', {
      detail: { comp: _this2 },
      bubbles: true,
      cancelable: true
    });

    _this2.element.dispatchEvent(ev);
  });

  buttonsContainer.appendChild(deleteBtn);

  var okBtn = document.createElement('button');
  okBtn.setAttribute('type', 'button');
  okBtn.setAttribute('name', 'ok');
  okBtn.classList.add('btn', 'btn-default', 'btn-sm', 'fl-bottom-btn', 'glyphicon', 'glyphicon-ok');
  okBtn.addEventListener('click', function () {
    _this2.saveConfig();
    _this2.configToggle();
  });

  buttonsContainer.appendChild(okBtn);
  var requiredLabel = document.createElement('label');
  requiredLabel.innerText = 'Required';

  // Switch for whether the field is required or not.
  var requiredSwitch = document.createElement('div');
  requiredSwitch.classList.add('switch');

  var switchInput = document.createElement('input');
  switchInput.classList.add('cmn-toggle', 'cmn-toggle-round');
  switchInput.setAttribute('type', 'checkbox');
  switchInput.id = 'cmn-toggle-' + Date.now();
  switchInput.addEventListener('change', function (e) {
    var checked = e.target.checked;
    _this2.required(checked);
  });

  this.requiredSwitch = switchInput;
  requiredSwitch.appendChild(switchInput);

  var switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', switchInput.id);
  requiredSwitch.appendChild(switchLabel);

  requiredLabel.appendChild(requiredSwitch);
  buttonsContainer.appendChild(requiredLabel);

  configBox.appendChild(buttonsContainer);

  this.element.appendChild(configBox);
  this.element.appendChild(controls);

  // If it adds options, let's create the option adding field.
  if (typeof this.addOption === 'function') {
    this.createAddOptionField();
  }
};

/**
 * Toggle the configuration mode for the component
 * @method configToggle
 * @param  {boolean} showHide
 * @return {void}
 */
FormComponent.prototype.configToggle = function configToggle(showHide) {
  showHide = showHide || !this.configShowing; // eslint-disable-line no-param-reassign
  if (showHide) {
    this.showConfig();
  } else {
    this.hideConfig();
  }
};

/**
 * Hides the config box and make the content non-editable
 * @method hideConfig
 * @return {void}
 */
FormComponent.prototype.hideConfig = function hideConfig() {
  if (!this.configBox) {
    throw new Error('FormComponent.configToggle(): No configBox initialised');
  } else if (!this.configShowing) {
    return;
  }

  this.element.classList.remove('fl-form-config-visible');
  this.configShowing = false;

  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';

  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', false);

    // Show message to input placeholder text if there is no placeholder already
    // in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT' && el.type === 'text') {
      var placeholderText = el.getAttribute('placeholder');
      var value = el.value;

      if (value) {
        el.setAttribute('placeholder', value);
      } else if (placeholderText === placeholderMessage) {
        el.removeAttribute('placeholder');
      }

      el.value = ''; // eslint-disable-line no-param-reassign
    }
  });
};

/**
 * Displays the configuration box and makes appropriate fields editable.
 * @method showConfig
 * @return {void}
 */
FormComponent.prototype.showConfig = function showConfing() {
  if (!this.configBox) {
    throw new Error('FormComponent.showConfing(): No configBox initialised');
  } else if (this.configShowing) {
    return;
  }

  // Show config box and change configShowing value
  this.element.classList.add('fl-form-config-visible');
  this.configShowing = true;

  // Make appropriate elements editable.
  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';
  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', true);

    // Show message to input placeholder text if there is no placeholder already
    // in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT' && el.type === 'text') {
      var placeholderText = el.getAttribute('placeholder');
      var newContent = placeholderText || placeholderMessage;
      el.setAttribute('placeholder', newContent);
      el.value = ''; // eslint-disable-line no-param-reassign
    }
  });

  // Focus on the appropriate element
  var focusElement = this.focusElement || this.configBox.querySelector('switch');
  if (focusElement) {
    // NOTE: There is a bug that for some reason it doesn't focus if you just
    // call focus() straight away. setTimeout solves it.
    // see http:// goo.gl/UjKOk5
    setTimeout(function () {
      focusElement.focus();
    }, 15);
  }

  // Set a listener to hide the configuration when the user clicks somewhere else.
  var listenerTarget = document.body;
  var useCapture = true;
  var _this = this;
  listenerTarget.addEventListener('mousedown', function clickOutOfComponent(e) {
    var func = clickOutOfComponent;
    var clickX = e.clientX;
    var clickY = e.clientY;

    // If clicked outside of the component.
    if (!_this.isAtPoint(clickX, clickY)) {
      listenerTarget.removeEventListener('mousedown', func, useCapture);
      _this.hideConfig();
    }
  }, useCapture);
};

/**
 * Checks whether a point is inside a component or outside of it.
 * @method isAtPoint
 * @param  {integer}  x
 * @param  {integer}  y
 * @return {Boolean}   Whether point is inside component or not
 */
FormComponent.prototype.isAtPoint = function isAtPoint(x, y) {
  var configPosition = this.configBox.getBoundingClientRect();
  var componentPosition = this.element.getBoundingClientRect();

  var top = componentPosition.top;
  var bottom = configPosition.bottom;
  var right = Math.max(configPosition.right, componentPosition.right);
  var left = Math.min(configPosition.left, componentPosition.left);

  // If point is outside of the component
  if (x < left || right < x || y < top || bottom < y) {
    return false;
  }
  return true;
};

/**
 * Creates an input field in the configContent which will call this.add with
 * its content value
 * @method createAddOptionField
 * @param {String} placeHolderText    text to show in the input field
 * @param {Function} removeFunction    function to be called when removing an option
 * @return {HTMLElement} The cretated element
 */
FormComponent.prototype.createAddOptionField = function createAddOptionField() {
  var _this3 = this;

  if (typeof this.removeOption === 'function') {
    var removeBtn = document.createElement('i');
    removeBtn.setAttribute('name', 'remove');
    removeBtn.classList.add('glyphicon', 'glyphicon-minus-sign', 'fl-grey-btn');
    removeBtn.title = 'Remove last option';
    removeBtn.addEventListener('click', function () {
      _this3.removeOption();
    });

    this.configContent.appendChild(removeBtn);
  }

  var addBtn = document.createElement('i');
  addBtn.setAttribute('name', 'add');
  addBtn.classList.add('glyphicon', 'glyphicon-plus-sign', 'fl-grey-btn');
  addBtn.title = 'Add this option';
  this.configContent.appendChild(addBtn);

  var legend = document.createElement('input');
  legend.setAttribute('placeholder', 'Type a new option');
  legend.setAttribute('type', 'text');
  this.focusElement = legend;
  this.configContent.appendChild(legend);

  addBtn.addEventListener('click', function () {
    // Blink red and return if no value was provided
    if (!legend.value.trim()) {
      utils.blinkRed(legend);

      return;
    }

    _this3.addOption(legend.value);
    legend.value = '';
  });

  legend.addEventListener('keypress', function (e) {
    if (e.which === 13) {
      var click = new Event('click');
      addBtn.dispatchEvent(click);
      e.preventDefault();
      return false; //  returning false will prevent the event from bubbling up.
    }
    return true;
  });
};

// To be implemented by child clases
FormComponent.prototype.saveConfig = function saveConfig() {};

FormComponent.prototype.destroy = function destroy() {
  this.element.remove();
};

/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
FormComponent.prototype.required = function required(isRequired) {
  if (this.isRequired === isRequired) {
    return true;
  }

  var inputs = this.content.querySelectorAll('input');
  var textAreas = this.content.querySelectorAll('textarea');
  var selects = this.content.querySelectorAll('select');
  inputs = [].slice.call(inputs);
  textAreas = [].slice.call(textAreas);
  selects = [].slice.call(selects);

  var els = [].concat.call(inputs, textAreas, selects);

  if (isRequired) {
    els.forEach(function (el) {
      el.setAttribute('required', true);
    });
  } else {
    els.forEach(function (el) {
      el.removeAttribute('required');
    });
  }

  this.isRequired = isRequired;
  return true;
};

FormComponent.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Insert an option');
  this.placeHolder.setAttribute('disabled', true);
};

FormComponent.prototype.removePlaceHolder = function removePlaceHolder() {
  this.placeHolder.remove();
  this.placeHolder = null;
};

FormComponent.prototype.getElements = function getElements() {
  var allContent = this.content.children;
  var elements = [];
  [].forEach.call(allContent, function (el) {
    if (el.nodeName !== 'H3') {
      elements.push(el);
    }
  });

  return elements;
};

// Method to be called by JSON.stringify
// This method is augmented in the relevant classes.
FormComponent.prototype.toJSON = function toJSON() {
  var json = {};

  if (this.title && this.title.innerText) {
    json.title = this.title.innerText;
  }

  json.componentType = this.componentType;
  json.required = this.isRequired || false;

  json.content = [];
  var contentEls = this.getElements();
  contentEls = [].slice.call(contentEls);
  contentEls.forEach(function (el) {
    var elJson = {};
    elJson.nodeName = el.nodeName.toLowerCase();
    elJson.type = el.getAttribute('type') || undefined;
    elJson.name = el.getAttribute('name') || undefined;
    elJson.placeholder = el.getAttribute('placeholder') || undefined;
    elJson.label = el.innerText || el.innerHTML;
    json.content.push(elJson);
  });

  return json;
};

/**
 * @class RadioBtns
 * @extends FormComponent
 */
function RadioBtns(name) {
  if (!(this instanceof RadioBtns)) {
    return new RadioBtns();
  }

  this.init(name);
}

RadioBtns.prototype = new FormComponent(); //Inheritance part
RadioBtns.prototype.componentType = 'RadioBtns';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
RadioBtns.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  this.addPlaceHolder();
};

/**
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return HTMLElement the element added
 */
RadioBtns.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('RadioBtns.add(): ' + value + ' is not a valid "value" parameter');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newRadio = document.createElement('input');
  newRadio.setAttribute('type', 'radio');
  newRadio.setAttribute('name', this.name);
  newRadio.setAttribute('value', value);
  newRadio.classList.add('fl-radio-btn');

  //FIXME: Radio button labels allow you to delete the radio btn. Fix that.
  var newLabel = document.createElement('label');

  var legendNode = document.createElement('span');
  legendNode.innerText = legend || value;
  legendNode.classList.add('fl-editable');
  legendNode.setAttribute('contenteditable', true);

  newLabel.appendChild(newRadio);
  newLabel.appendChild(legendNode);

  this.content.appendChild(newLabel);
  return newLabel;
};

/**
 * @method removeOption
 * @return {void}
 */
RadioBtns.prototype.removeOption = function removeOption() {
  var radioBtns = this.getElements();
  var atLeastOneBtn = radioBtns.length > 0;
  if (!atLeastOneBtn || this.placeHolder) {
    utils.blinkRed(this.content);
    return;
  }

  var lastEl = radioBtns.pop();
  lastEl.remove();
};

/**
 * @class Checkboxes
 * @extends FormComponent
 */
function Checkboxes(name) {
  if (!(this instanceof Checkboxes)) {
    return new Checkboxes();
  }

  this.init(name);
}

Checkboxes.prototype = new FormComponent(); //Inheritance part
Checkboxes.prototype.componentType = 'Checkboxes';
/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Checkboxes.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  this.name = name + '[]';
  this.addPlaceHolder();
};

/**
 * Adds one checkbox to a group of checkboxes.
 * @method add
 * @param {String} value  value that will be sent on form submit
 * @param {String} legend [optional]
 */
Checkboxes.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('Checkboxes.addOption(): No value parameter provided.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  if (this.isRequired && this.getElements().length > 0) {
    this.required(false);
  }

  var newBox = document.createElement('input');
  newBox.setAttribute('type', 'checkbox');
  newBox.setAttribute('name', this.name);
  newBox.setAttribute('value', value);
  newBox.classList.add('fl-check-box');

  if (this.isRequired) {
    newBox.setAttribute('required', true);
  }

  var legendNode = document.createElement('span');
  legendNode.innerText = legend || value;
  legendNode.classList.add('fl-editable');

  //Let's already make it contenteditable as the config box is currently open.
  legendNode.setAttribute('contenteditable', true);

  var label = document.createElement('label');
  label.appendChild(newBox);
  label.appendChild(legendNode);
  this.content.appendChild(label);
  return label;
};

/**
 * @method removeOption
 * @return {void}
 */
Checkboxes.prototype.removeOption = function removeOption() {
  var boxes = this.getElements();
  var atLeastOneBox = boxes.length > 0;
  if (!atLeastOneBox || this.placeHolder) {
    utils.blinkRed(this.content);
    return;
  }

  var lastEl = boxes.pop();
  lastEl.remove();
};
/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @override @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
Checkboxes.prototype.required = function required(isRequired) {
  if (this.isRequired === isRequired) {
    return true;
  } else if (!this.requiredSwitch) {
    throw new Error('Checkboxes.required(): No required button in place.');
  } else if (this.getElements().length > 1 && isRequired) {
    console.error('Checkboxes: To be "required" there can only ' + 'be one checkbox in the group.');
    this.requiredSwitch.checked = false;
    return false;
  }

  this.isRequired = isRequired;
  var boxes = this.content.querySelectorAll('input');
  if (isRequired) {
    [].forEach.call(boxes, function (box) {
      box.setAttribute('required', true);
    });
  } else {
    [].forEach.call(boxes, function (box) {
      box.removeAttribute('required');
    });
  }

  this.requiredSwitch.checked = isRequired;
  return true;
};

/**
 * @override addPlaceHolder
 */
Checkboxes.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Check a box');
};

/**
 * @class TextBox
 * @extends FormComponent
 */
function TextBox(name) {
  if (!(this instanceof TextBox)) {
    return new TextBox();
  }

  this.init(name);
}

TextBox.prototype = new FormComponent(); //Inheritance part
TextBox.prototype.componentType = 'TextBox';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextBox.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  //Create the text box
  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');

  var box = document.createElement('input');
  box.setAttribute('type', 'text');
  box.setAttribute('name', name);
  box.classList.add('fl-editable', 'fl-text-box', 'form-control');
  labelEl.appendChild(box);

  this.content.appendChild(labelEl);
  this.focusElement = box;
};

TextBox.prototype.setLabel = function setLabel(desc) {
  if (!desc || !this.title) {
    return;
  }

  this.title.innerText = desc;
};

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea(name) {
  if (!(this instanceof TextArea)) {
    return new TextArea();
  }

  this.init(name);
}

TextArea.prototype = new FormComponent(); //Inheritance part
TextArea.prototype.componentType = 'TextArea';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextArea.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');

  var area = document.createElement('textarea');
  area.setAttribute('name', name);
  area.setAttribute('rows', 5);
  area.classList.add('fl-editable', 'fl-text-area', 'form-control');
  labelEl.appendChild(area);

  this.content.appendChild(labelEl);
  this.focusElement = area;
};

TextArea.prototype.setTitle = function setTitle(desc) {
  if (!desc || !this.title) {
    return;
  }

  this.title.innerText = desc;
};

/**
 * @class Dropdown
 * @extends FormComponent
 */
function Dropdown(name) {
  if (!(this instanceof Dropdown)) {
    return new Dropdown();
  }

  this.init(name);
}

Dropdown.prototype = new FormComponent(); //Inheritance part
Dropdown.prototype.componentType = 'Dropdown';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Dropdown.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');
  this.selector = document.createElement('select');
  this.selector.setAttribute('name', name);
  this.selector.classList.add('fl-dropdown', 'form-control');
  labelEl.appendChild(this.selector);

  this.content.appendChild(labelEl);
  this.addPlaceHolder();
};

/**
 * Adds a new option to the dropdown
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return {HTMLElement} the option created
 */
Dropdown.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('Dropdown.addOption(): ' + value + ' is not a valid "value" value.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newOp = document.createElement('option');
  newOp.innerText = legend || value;
  this.selector.appendChild(newOp);
  return newOp;
};

/**
 * @method removeOption
 * @return {void}
 */
Dropdown.prototype.removeOption = function removeOption() {
  var options = this.getElements();
  var hasAtLeastOneOption = options.length > 0;
  if (!hasAtLeastOneOption || this.placeHolder) {
    utils.blinkRed(this.selector);
    return;
  }

  var selectedIndex = this.selector.selectedIndex;
  var index = selectedIndex >= 0 ? selectedIndex : 0;
  var optionToBeRemoved = this.selector.children[index];
  optionToBeRemoved.remove();
};

/**
 * Adds a placeholder and saves it in this.placeHolder
 * @method @override addPlaceHolder
 */
Dropdown.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Select an option');
  this.placeHolder.setAttribute('disabled', true);
  this.placeHolder.setAttribute('selected', true);
};

/**
 * Hides the config panel and makes the selectable a dropdown again
 * @method @override hideConfig
 * @return {void}
 */
Dropdown.prototype.hideConfig = function hideConfig() {
  this.constructor.prototype.hideConfig.call(this);

  if (!this.selector) {
    console.error('Dropdown.hideConfig(): Selector not specified');
    return;
  }

  //Make selector not multiple
  this.selector.removeAttribute('multiple');
};

/**
 * Shows the config panes and allows the selection of multiple elements
 * @method @override showConfig
 * @return {void}
 */
Dropdown.prototype.showConfig = function showConfig() {
  this.constructor.prototype.showConfig.call(this);

  if (!this.selector) {
    console.error('Dropdown.showConfig(): Selector not specified');
    return;
  }

  //Make selector multiple;
  this.selector.setAttribute('multiple', true);
};

/**
 * @method @override getElements
 * @return {HTMLElement}
 */
Dropdown.prototype.getElements = function getElements() {
  var allOptions = this.content.querySelectorAll('option');
  return [].slice.call(allOptions);
};

/**
 * Singleton to create form components
 * @class FormFabric
 * @param {HTMLElement} el Where the fabric will be put.
 */
function FormFabric(formBody) {
  'use strict';

  if (!(this instanceof FormFabric)) {
    return new FormFabric();
  }

  var formComponents = [{ desc: 'Radio buttons', constr: RadioBtns, class: 'glyphicon glyphicon-ok-circle' }, { desc: 'Checkboxes', constr: Checkboxes, class: 'glyphicon glyphicon-check' }, { desc: 'Dropdown', constr: Dropdown, class: 'glyphicon glyphicon-collapse-down' }, { desc: 'Text box', constr: TextBox, class: 'glyphicon glyphicon-text-width' }, { desc: 'Text area', constr: TextArea, class: 'glyphicon glyphicon-text-height' }];

  function createElement(Constr, fBody) {
    var name = 'Temp name ' + Math.floor(Math.random() * 1000);
    var comp = new Constr(name);
    var ev = new CustomEvent('addComponent', {
      detail: { comp: comp },
      bubbles: true,
      cancelable: true
    });

    fBody.dispatchEvent(ev);
  }

  /**
   * @function createOptionsDropdown
   * @return {HTMLElement} The dropdown menu
   */
  function createOptions() {
    var frag = document.createDocumentFragment();
    formComponents.forEach(function (component, idx) {
      var op = document.createElement('button');
      op.setAttribute('value', idx);
      op.className = component.class;
      op.name = component.desc;
      op.title = component.desc;
      op.classList.add('btn', 'btn-default');
      op.addEventListener('click', function () {
        var index = op.value;
        createElement(formComponents[index].constr, formBody);
      });

      frag.appendChild(op);
    });

    return frag;
  }

  this.init = function init() {
    this.element = document.createElement('div');
    this.element.classList.add('fl-form-fabric');
    var options = createOptions();
    this.element.appendChild(options);
  };

  this.init(formBody);
}

function flFormBuilder(xDivEl) {
  'use strict';

  var formBody = new FormBody();
  var fabric = new FormFabric(formBody.element);

  xDivEl.classList.add('fl-form-builder');
  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
}

xController(flFormBuilder);
//# sourceMappingURL=fl-form-builder.js.map
