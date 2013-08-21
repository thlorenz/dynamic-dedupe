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

exports.activate = function (ext) { 
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

exports.deactivate = function (ext) {
  require.extensions[ext] = extensions[ext];
};

exports.reset = function () {
  loadeds = {};
};

// Test
if (!module.parent) {
  
  exports.activate('.js');
  var count = require('./test/fixtures/count');
  var foo1 = require('./test/fixtures/pack1/dep-uno/foo');
  var foo2 = require('./test/fixtures/pack2/dep-uno/foo');
  
  console.log(count.count);
  console.log(foo1);
  console.log(foo2);
}
