'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectStylePrefixed = exports.injectStyle = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _static = require('inline-style-prefixer/static');

var _static2 = _interopRequireDefault(_static);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache = {};
function hyphenateStyleName(prop) {
  return prop in cache ? cache[prop] : cache[prop] = prop.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-');
}

function injectStyle(styletron, styles, media, pseudo) {
  var classString = '';

  for (var key in styles) {
    var val = styles[key];
    var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);

    if (valType === 'string' || valType === 'number') {
      classString += ' ' + styletron.injectRawDeclaration({
        block: hyphenateStyleName(key) + ':' + val,
        media: media,
        pseudo: pseudo
      });
      continue;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) {
        continue;
      }

      var hyphenated = hyphenateStyleName(key);
      var block = hyphenated + ':' + val[0];

      for (var i = 1; i < val.length; i++) {
        block += ';' + hyphenated + ':' + val[i];
      }

      classString += ' ' + styletron.injectRawDeclaration({
        block: block,
        media: media,
        pseudo: pseudo
      });
      continue;
    }

    if (valType === 'object') {
      if (key[0] === ':') {
        classString += ' ' + injectStyle(styletron, val, media, key);
        continue;
      }

      if (key.substring(0, 6) === '@media') {
        classString += ' ' + injectStyle(styletron, val, key.substr(7), pseudo);
        continue;
      }
    }
  } // remove leading space on way out


  return classString.slice(1);
}

var prefixedBlockCache = {};
function injectStylePrefixed(styletron, styles, media, pseudo) {
  var cache = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : prefixedBlockCache;

  var classString = '';

  for (var originalKey in styles) {
    var originalVal = styles[originalKey];
    var originalValType = typeof originalVal === 'undefined' ? 'undefined' : _typeof(originalVal);
    var isPrimitiveVal = originalValType === 'string' || originalValType === 'number';

    if (isPrimitiveVal || Array.isArray(originalVal)) {
      var block = '';

      if (isPrimitiveVal && cache.hasOwnProperty(originalKey) && cache[originalKey].hasOwnProperty(originalVal)) {
        block = cache[originalKey][originalVal];
      } else {
        var prefixed = (0, _static2.default)(_defineProperty({}, originalKey, originalVal));

        for (var prefixedKey in prefixed) {
          var prefixedVal = prefixed[prefixedKey];
          var prefixedValType = typeof prefixedVal === 'undefined' ? 'undefined' : _typeof(prefixedVal);

          if (prefixedValType === 'string' || prefixedValType === 'number') {
            block += hyphenateStyleName(prefixedKey) + ':' + prefixedVal + ';';
            continue;
          }

          if (Array.isArray(prefixedVal)) {
            var hyphenated = hyphenateStyleName(prefixedKey);

            for (var i = 0; i < prefixedVal.length; i++) {
              block += hyphenated + ':' + prefixedVal[i] + ';';
            }

            continue;
          }
        }

        block = block.slice(0, -1); // Remove trailing semicolon

        if (isPrimitiveVal) {
          if (!cache.hasOwnProperty(originalKey)) {
            cache[originalKey] = {};
          }

          cache[originalKey][originalVal] = block;
        }
      }

      classString += ' ' + styletron.injectRawDeclaration({
        block: block,
        media: media,
        pseudo: pseudo
      });
    }

    if (originalValType === 'object') {
      if (originalKey[0] === ':') {
        classString += ' ' + injectStylePrefixed(styletron, originalVal, media, originalKey, cache);
        continue;
      }

      if (originalKey.substring(0, 6) === '@media') {
        classString += ' ' + injectStylePrefixed(styletron, originalVal, originalKey.substr(7), pseudo, cache);
        continue;
      }
    }
  } // remove leading space on way out


  return classString.slice(1);
}

exports.injectStyle = injectStyle;
exports.injectStylePrefixed = injectStylePrefixed;
//# sourceMappingURL=index.es.js.map