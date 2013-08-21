'use strict';

var fs     =  require('fs');
var path   =  require('path');
var xtend  =  require('xtend');
var crypto =  require('crypto');

var loadeds = {};
var extensions = xtend(require.extensions);
 
function getHash(data) {
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex');
}

/**
 * Activates deduping for files with the given extension.
 * 
 * @name activate
 * @function
 * @param ext {String} (optional) extension for which to activate deduping (default: '.js')
 */
exports.activate = function (ext) { 
  ext = ext || '.js';
  var ext_super = require.extensions[ext];

  require.extensions[ext] = function dedupingExtension(module, file) {

    var src = fs.readFileSync(file, 'utf8');

    // hash includes filename and immediate dirname to make override more strict
    var fulldir  =  path.dirname(file);
    var dir      =  fulldir.split(path.sep).pop();
    var filename =  path.basename(file);
    var hash     =  getHash(src + dir + filename);

    var loaded = loadeds[hash];
    if (loaded) {
      module.exports = loaded.module.exports;
      return;
    }

    ext_super(module, file);
    loadeds[hash] = { module: module };
  };
};

/**
 * Deactivates deduping files with the given extension.
 * 
 * @name deactivate
 * @function
 * @param ext {String} (optional) extension for which to activate deduping (default: '.js')
 */
exports.deactivate = function (ext) {
  ext = ext || '.js';
  require.extensions[ext] = extensions[ext];
};

/**
 * Clears the registry that contains previously loaded modules.
 * 
 * @name reset
 * @function
 */
exports.reset = function () {
  loadeds = {};
};
