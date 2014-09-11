var assert = require('assert');
var util = require('util');
var eol = require('os').EOL;

function ltrim(str) {
  if(!str || typeof str !== 'string') return str;
  return str.replace(/^\s+/, '');
}

function rtrim(str) {
  if(!str || typeof str !== 'string') return str;
  return str.replace(/\s+$/, '');
}

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

/**
 *  Word wrap a long string.
 *
 *  @param str The string to wrap.
 *  @param col The column to indent lines (first line is not indented).
 *  @param amount The amount to wrap at.
 *  @param first Also pad first line if column is greater than zero.
 */
function wrap(str, col, amount, first) {
  if(!str || typeof str !== 'string') return str;
  if(isNaN(col) || isNaN(amount)) {
    throw new TypeError('Wrap cannot operate on NaN ' +
      (isNaN(col) ? 'column' : 'amount'));
  }
  amount = Math.abs(parseInt(amount)) || 80;
  amount = Math.max(amount, 2);
  col = parseInt(col) || 0;
  col = Math.max(col, 0);
  // guard against infinite loop if amount is less then column
  amount = Math.max(amount, col + 2);
  var padding = repeat(col);
  var target = amount - col;
  function block(str) {
    var over = str.length + col > amount;
    var parts = [];
    var words = str.split(' '), line = '', word;
    function append(line) {
      parts.push(
        parts.length ? (col > 0 ? padding : '') + ltrim(line) : line);
    }
    if(over) {
      var i, l = words.length;
      for(i = 0;i < l;i++) {
        word = words[i];
        // hyphenate long words that exceed
        // the target length limit
        if(word.length >= target) {
          if(word.length === target) {
            append(word);
          }else{
            line = word.substr(0, target - 1) + '-';
            words.splice(i + 1, 0, word.substr(target - 1));
            append(line);
            line = '';
            l++;
          }
          continue;
        }
        if((line + ' ' + word).length <= target) {
          line += line === '' ? word : ' ' + word;
        }else{
          append(line);
          line = '';
          i--;
        }
      }
      if(line !== '') append(line);
      return parts.join(eol).trim();
    }
    return !first ? str : padding + str;
  }
  var re = /\n+/, parts, past;
  if(!re.test(str)) {
    str = block(str);
  }else{
    // respect hard line breaks
    parts = str.split(eol);
    parts = parts.map(function(segment) {
      // empty string is multiple consecutive newlines
      if(!segment) return segment;
      segment = block(segment);
      if(past && col > 0) segment = padding + segment;
      past = true;
      return segment;
    })
    str = parts.join(eol);
  }
  return str;
}

/**
 *  Repeat a string.
 *
 *  @param len The number of times to repeat.
 *  @param str The string to repeat, default is a space.
 */
function repeat(len, str) {
  len = typeof len !== 'number' ? 2 : len;
  len = Math.abs(len);
  return new Array(len + 1).join(str || ' ');
}

/**
 *  Convert the first character of a string to uppercase.
 *
 *  @param val The string value.
 */
function ucfirst(val) {
  if(!val || !typeof val === 'string') return val;
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 *  Pad a string with leading or trailing whitespace.
 *
 *  Default is to add trailing whitespace.
 *
 *  @param str The string to pad.
 *  @param width The target character width.
 *  @param leading Pad before the string.
 */
function pad(str, width, leading) {
  var len = Math.max(0, width - str.length);
  return leading ? repeat(len) + str : str + repeat(len);
}

/**
 *  Convert a delimited string to camelcase.
 *
 *  @param name The string to convert.
 *  @param delimiter A delimiter, default is hyphen.
 */
function camelcase(name, delimiter) {
  delimiter = delimiter || '-';
  var re = new RegExp('^' + delimiter + '+');
  name = name.replace(re, '');
  return name.split(delimiter).reduce(function(str, word){
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 *  Convert a camelcase string to a delimited string.
 *
 *  @param name The string to convert.
 *  @param delimiter A delimiter, default is hyphen.
 *  @param lower Whether to lowercase the result.
 */
function delimited(name, delimiter, lower) {
  var re  = /([A-Z]{1,1})/g;
  delimiter = delimiter || '-';
  name = name.replace(re, delimiter + '$1');
  if(lower) name = name.toLowerCase();
  return name;
}

function complex(o) {
  return Array.isArray(o) || (o && (typeof(o) == 'object'));
}

function taint(source) { source.__visited = true; }
function untaint(source) { delete source.__visited; }

function recopy(input) {
  var ptn = input.source;
  var flags = "";
  if(input.global) {
    flags += "g";
  }
  if(input.ignoreCase) {
    flags += "i";
  }
  if(input.multiline) {
    flags += "m";
  }
  return new RegExp(ptn, flags);
}

/**
 *  Merge two complex objects recursively.
 *
 *  If either source or target are non-complex
 *  (not an array or map) then nothing is done.
 *
 *  Otherwise all properties are merged from source
 *  into target.
 *
 *  For arrays, iteration is done over the array
 *  values so additional properties set on the array
 *  are not copied over.
 *
 *  If a cyclical reference is detected this method
 *  will throw an error.
 *
 *  @param source The source object.
 *  @param target The target object.
 *  @param options Options or filter function.
 */
function merge(source, target, options) {
  var filter;
  if(typeof options === 'function') {
    filter = options;
    options = {};
  }
  options = options || {};
  filter = filter ||
    function(target, key, value, source) {
      if(!options.copy) {
        if(Array.isArray(target[key]) && Array.isArray(source)) {
          return target[key];
        }else if(complex(target[key]) && complex(source)) {
          return target[key];
        }
      }
      target[key] = value;
    };
  if(!complex(source) || !complex(target)) return;
  function create(target, key, source) {
    if(typeof(source.clone) == 'function') return source.clone();
    return Array.isArray(source) ? source.slice(0) :
     ((source instanceof RegExp) ? recopy(source) : {});
  }
  function recurse(source, target, key, value) {
    if(complex(source[key])) {
      if(source[key].__visited) {
        untaint(source[key]);
        throw new Error(util.format(
          'Cyclical reference detected on %s, cannot merge', key));
      }
      var val = create(target, key, source[key]);
      filter(target, key, options.copy ? val : target[key], source[key]);
      merge(source[key], options.copy ? val : target[key], options);
    }
  }
  function iterate(source, target, key, value) {
    taint(source);
    filter(target, key, value, source[key]);
    try {
      recurse(source, target, key, value);
    }catch(e) {
      untaint(source);
      throw e;
    }
    untaint(source);
  }
  if(Array.isArray(source)) {
    source.forEach(function(value, index, array) {
      iterate(source, target, index, value);
    });
  }else{
    for(var k in source) {
      iterate(source, target, k, source[k]);
    }
  }
  return target;
}

function pedantic(value, period) {
  period = period || '.';
  value = /[a-zA-Z0-9]$/.test(value) ? value + period : value
  // sane if it ends with some common punctuation.
  var sane = /[!?:;\.]([\*`]+)?$/.test(value);
  if(!sane) {
    // close on markdown inline formatters
    value = /[^\.][\)\]\*`]+$/.test(value) ? value + period : value;
  }
  return value;
}

function walk(root, visit, transform, visited) {
  assert(typeof root === 'object', 'root must be an object');
  assert(typeof visit === 'function', 'visit must be a function');
  assert(typeof transform === 'function', 'transform must be a function');
  visited = visited || [];
  var k, v, props;
  for(k in root) {
    v = root[k];
    props = {parent: root, name: k, value: v};
    if(complex(v) && v.__visited) {
      throw new Error('walk: cyclical reference detected');
    }
    if(visit(props)) {
      taint(v);
      try {
        transform(props);
      }catch(e) {
        untaint(v);
        throw e;
      }
    }
    if(complex(v)) {
      walk(v, visit, transform, visited);
      untaint(v);
    }
  }
}

module.exports.repeat = repeat;
module.exports.pad = pad;
module.exports.uniq = uniq;
module.exports.camelcase = camelcase;
module.exports.delimited = delimited;
module.exports.merge = merge;
module.exports.wrap = wrap;
module.exports.ucfirst= ucfirst;
module.exports.ltrim = ltrim;
module.exports.rtrim = rtrim;
module.exports.pedantic = pedantic;
module.exports.recopy = recopy;
module.exports.walk = walk;
