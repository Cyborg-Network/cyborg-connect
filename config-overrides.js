const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = function override(config, env) {
  // Ensure config.plugins is an array
  if (!config.plugins) {
    config.plugins = [];
  }

  // Polyfills for Node.js core modules
  config.resolve.fallback = {
    stream: require.resolve('stream-browserify'),
    ...config.resolve.fallback, // Keep existing fallbacks if any
  };

  // Add NodePolyfillPlugin
  config.plugins.push(new NodePolyfillPlugin());

  // Allow imports from 'src' directory and support .ts/.tsx extensions
  config.resolve.modules = [path.resolve(__dirname, 'src'), 'node_modules'];
  config.resolve.extensions.push('.ts', '.tsx');

  // Remove the ModuleScopePlugin to allow importing from outside 'src'
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
  );

  return config;
};
