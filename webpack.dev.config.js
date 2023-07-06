const path = require('path');
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-dev', {
  resolve: {
    alias: {
      features: path.resolve(__dirname, 'src/features'),
    },
  },
});
