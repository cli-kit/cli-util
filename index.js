var util = require('util');

function ltrim(str) {
  return str.replace(/^\s+/, '');
}

/**
 *  Word wrap a long string.
 *
 *  @param str The string to wrap.
 *  @param col The column to indent lines (first line is not indented).
 *  @param amount The amount to wrap at.
 */
function wrap(str, col, amount) {
  amount = amount || 80;
  amount = Math.max(amount, 2);
  var over = str.length + col > amount;
  var target = amount - col, parts = [];
  var padding = repeat(col);
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
    return parts.join('\n').trim();
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
 *  @param filter An optional filter function.
 */
function merge(source, target, filter) {
  filter = filter ||
    function(target, key, value, source) {
      if(Array.isArray(target[key]) && Array.isArray(source)) {
        return target[key];
      }else if(complex(target[key]) && complex(source)) {
        return target[key];
      }
      target[key] = value;
    };
  function complex(o) {
    return Array.isArray(o) || (o && (typeof(o) == 'object'));
  }
  if(!complex(source) || !complex(target)) return;
  function create(target, key, source) {
    if(typeof(source.clone) == 'function') return source.clone();
    return Array.isArray(source) ? source.slice(0) : {};
  }
  function recurse(source, target, key, value) {
    if(complex(source[key])) {
      if(source[key].__visited) {
        untaint(source[key]);
        throw new Error(util.format(
          'Cyclical reference detected on %s, cannot merge', key));
      }
      filter(target, key, create(target, key, source[key]), source[key]);
      merge(source[key], target[key], filter);
    }
  }
  function taint(source) { source.__visited = true; }
  function untaint(source) { delete source.__visited; }
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

module.exports.repeat = repeat;
module.exports.pad = pad;
module.exports.camelcase = camelcase;
module.exports.delimited = delimited;
module.exports.merge = merge;
module.exports.wrap = wrap;
module.exports.ucfirst= ucfirst;
