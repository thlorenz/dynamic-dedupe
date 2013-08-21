# dynamic-dedupe

Dedupes node modules on the fly which works even when dependencies are linked via ln -s or npm link.

### Not deduped 

Loads `foo.js` module only twice.

```js
var foo1 = require('./pack1/dep-uno/foo');
var foo2 = require('./pack2/dep-uno/foo');

console.log(foo1.foo);
console.log(foo2.foo);

// =>
// loading foo from /Users/thlorenz/dev/projects/dynamic-dedupe/example/pack1/dep-uno
// loading foo from /Users/thlorenz/dev/projects/dynamic-dedupe/example/pack2/dep-uno
// foobiloo
// foobiloo
```

### Deduped

Loads `foo.js` module only once.

```js
var dedupe = require('../');
dedupe.activate();

var foo1 = require('./pack1/dep-uno/foo');
var foo2 = require('./pack2/dep-uno/foo');

console.log(foo1.foo);
console.log(foo2.foo);

// =>
// loading foo from /Users/thlorenz/dev/projects/dynamic-dedupe/example/pack1/dep-uno
// foobiloo
// foobiloo
```


## Installation

    npm install dynamic-dedupe

## API

###*dedupe.activate([ext])*

```
/**
 * Activates deduping for files with the given extension.
 * 
 * @name activate
 * @function
 * @param ext {String} (optional) extension for which to activate deduping (default: '.js')
 */
```

###*dedupe.deactivate([ext])*

```
/**
 * Deactivates deduping files with the given extension.
 * 
 * @name deactivate
 * @function
 * @param ext {String} (optional) extension for which to activate deduping (default: '.js')
 */
```

###*dedupe.reset()*

```
/**
 * Clears the registry that contains previously loaded modules.
 * 
 * @name reset
 * @function
 */
```

## License

MIT
