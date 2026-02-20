const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-dev');

// Ensure resolve/alias exist, then extend
config.resolve = config.resolve || {};
config.resolve.alias = {
  ...(config.resolve.alias || {}),
  features: path.resolve(__dirname, 'src/features'),
  helpers: path.resolve(__dirname, 'src/helpers'),
  hooks: path.resolve(__dirname, 'src/hooks'),
  assets: path.resolve(__dirname, 'src/assets'),
};

// Allow access via local.openedx.io:1980
config.devServer = config.devServer || {};
config.devServer.allowedHosts = ['local.openedx.io'];
config.devServer.host = '0.0.0.0';
config.devServer.port = process.env.PORT || 1980;

module.exports = config;
