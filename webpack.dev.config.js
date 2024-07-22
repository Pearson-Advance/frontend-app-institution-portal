const path = require('path');
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-dev', {
  resolve: {
    alias: {
      features: path.resolve(__dirname, 'src/features'),
      assets: path.resolve(__dirname, 'src/assets'),
      helpers: path.resolve(__dirname, 'src/helpers'),
      hooks: path.resolve(__dirname, 'src/hooks'),
    },
  },
});
