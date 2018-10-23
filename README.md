# Webpack Clear Require Cache Plugin

A plugin to delete modules from the `require.cache`. This is especially useful when working on shared modules inside another webpack project.

- [Why use this?](#why-use-this)
- [Usage](#usage)
- [Next.js Example](#nextjs-example)


## Why use this?

In larger projects it makes sense to develop parts of your application inside a separate module that has it's own build and release cycle. Npm provides the functionality to link your local module into the `node_modules` folder via `npm link`. Having all the fancy webpack hot-reloading stuff set-up, you might notice that changing your linked module triggers a reload on the webpack build but the module doesn't respect the changes. This happens because your module inside the `node_modules` folder will be loaded from the `require.cache`.

## Usage

```
npm install --save-dev webpack-clear-require-cache-plugin
```


```
const clearRequireCachePlugin = require('./clearRequireCachePlugin');

module.exports = {
  plugins: [
    clearRequireCachePlugin([
      /my-module/,
    ]),
  ],
}
```

The plugin accepts an array of regex's that will be tested on each `compiler.hooks.afterEmit`. It will test for each module inside `require.cache` and delete the module if the test returns `true`.


## Next.js Example

The plugin is also compatible with `next-js`. When you have a linked module inside `node_modules` within a `next-js` project webpack will recognize the changes and trigger a reload but from now on client and server are out of sync, because the `client` will reload the changed module and the server will require from `require.cache`.

In order to achieve that the server reloades the updated module the `next.config.js` has to look somethign like this:

```
const clearRequireCachePlugin = require('./clearRequireCachePlugin');

exports.webpack = config =>
  Object.assign(config, {
    plugins: [
      ...config.plugins,
      clearRequireCachePlugin([
        /\.next\/server\/static\/development\/pages/,
        /\.next\/server\/ssr-module-cache.js/,
        /my-module/, // replace this with your own module name
      ]),
    ],
  });
```

##### NOTE: this is still a work in progress solution for an open issue https://github.com/zeit/next.js/issues/5463
