const pluginName = 'clearRequireCachePlugin';

const apply = (tests, compiler) => {
  compiler.hooks.afterEmit.tapAsync(pluginName, (compilation, callback) => {
    const moduleIds = Object.keys(require.cache);
    tests.forEach(regex => {
      moduleIds.forEach(moduleId => {
        if (regex.test(moduleId)) {
          delete require.cache[moduleId];
        }
      });
    });
    callback();
  });
}

module.exports = function(options) {
  return {
    apply: apply.bind(this, options),
  };
};
