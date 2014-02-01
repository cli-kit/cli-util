/**
 *  Repeat a string.
 *
 *  @param len The number of times to repeat.
 *  @param str The string to repeat, default is a space.
 */
function repeat(len, str) {
  len = len || 2;
  return new Array(len + 1).join(str || ' ');
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
 *  Attempt to resolve the user's home directory
 *  in a platform independent manner.
 *
 *  @return The user's home directory or the empty string
 *  if none of the environment variables are defined.
 */
function home() {
  return process.env.HOME || process.env.HOMEPATH
    || process.env.USERPROFILE || '';
}

module.exports.repeat = repeat;
module.exports.pad = pad;
module.exports.camelcase = camelcase;
module.exports.home = home;
