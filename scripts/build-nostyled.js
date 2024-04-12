const rewire = require('rewire');
const webpack = require('webpack');
const defaults = rewire('react-scripts/scripts/build.js'); // If you ejected, use this instead: const defaults = rewire('./build.js')
let config = defaults.__get__('config');

config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
    styles: {
      name: 'styles',
      type: 'css/mini-extract',
      chunks: 'all',
      enforce: true
    }
  }
};

config.plugins.push(
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  })
);

config.optimization.runtimeChunk = false;

// Renames main.b100e6da.css to main.css
config.plugins[4].options.filename = 'css/inefficiencies.css';

// Renames main.00455bcf.js to main.js
config.output.filename = 'js/inefficiencies.js';
