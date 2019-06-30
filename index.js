'use strict';

const babelPlugin = require('./lib/babel-plugin');
const { hasPlugin, addPlugin } = require('ember-cli-babel-plugin-helpers');
const { cacheKeyForStableTree } = require('calculate-cache-key-for-tree');
module.exports = {
  name: require('./package').name,
  cacheKeyForTree: cacheKeyForStableTree,
  included(parent) {
    this._super.included.apply(this, arguments);
    if (parent.env === 'production') {
      let plugin = Object.assign(babelPlugin, { baseDir() { return __dirname; } })
      if (!hasPlugin(parent, 'experimental-bundle-minifier')) {
        addPlugin(parent, plugin);
      }
    }
  }
};
