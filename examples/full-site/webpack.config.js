const c = require('../../index.js');
const path = require('path');

/**
 * Initalize the configuration
 */
c.initialize({entry_point: [path.resolve(__dirname, 'src', 'index.js')]});

/**
 * Define that we want to use the loaders for sytles
 */
c.styles();

/**
 * Define the main index template we want to use
 */
c.html(path.resolve(__dirname, 'public', 'index.html'));

/**
 * Build the config and name the chunks so that webpack dev server works
 */
const webpackConfig = c.build();
webpackConfig.optimization.splitChunks.name = 'a';

/**
 * Export the built config
 */
module.exports = webpackConfig;
