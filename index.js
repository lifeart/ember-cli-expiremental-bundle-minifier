'use strict';

const babelPlugin = require('./lib/babel-plugin');
const babelLazyPlugin = require('./lib/babel-lazy-define-plugin');
const { hasPlugin, addPlugin } = require('ember-cli-babel-plugin-helpers');
const { cacheKeyForStableTree } = require('calculate-cache-key-for-tree');
module.exports = {
  name: require('./package').name,
  cacheKeyForTree: cacheKeyForStableTree,
  included(parent) {
    this._super.included.apply(this, arguments);
    this.babel = this.project.findAddonByName('ember-cli-babel');
    // console.log(Object.keys(parent.project));
    if (parent.env !== 'sproduction') {
      let plugin  = this.plugin = Object.assign(babelPlugin, { baseDir() { return __dirname; } });
      let lazyPlugin = this.lazyPlugin = Object.assign(babelLazyPlugin, { baseDir() { return __dirname; } });
      if (!hasPlugin(parent, 'experimental-bundle-minifier')) {
        addPlugin(parent, plugin);
      }
      if (!hasPlugin(parent, 'lazy-define')) {
        addPlugin(parent, lazyPlugin);
      }
      // if (!hasPlugin(parent.project, 'experimental-bundle-minifier')) {
      //   addPlugin(parent.project, plugin);
      // }
      // if (!hasPlugin(parent, 'preval')) {
      //   console.log('add plugin');
      //   addPlugin(parent, require('babel-plugin-preval'));
      // } else {
      //   console.log('!preval');
      // }
      // //
      // if (!hasPlugin(parent.project, 'preval')) {
      //   // console.log('add plugin');
      //   addPlugin(parent.project, require('babel-plugin-preval'));
      // } else {
      //   console.log('!preval');
      // }

      // if (!hasPlugin(parent.project, 'minify-mangle-names')) {
      //   console.log('add plugin');
      //   addPlugin(parent.project, require('babel-plugin-minify-mangle-names'));
      // } else {
      //   console.log('!minify-mangle-names');
      // }
      //
      // if (!hasPlugin(parent, 'minify-mangle-names')) {
      //   console.log('add plugin');
      //   addPlugin(parent, require('babel-plugin-minify-mangle-names'));
      // } else {
      //   console.log('!minify-mangle-names');
      // }
      // if (!hasPlugin(parent, 'minify-simplify')) {
      //   console.log('add plugin');
      //   addPlugin(parent, require('babel-plugin-minify-simplify'));
      // } else {
      //   console.log('!minify-mangle-names');
      // }
    }
  },
  postprocessTree(type, tree) {
    // console.log('postprocessTree?', type);
    if (type !== 'all') {
      return tree;
    }
    // console.log('postprocessTree', type);
    return this.transpile(tree);
  },

  transpile(tree) {
    const babelAddon = this.project.findAddonByName('ember-cli-babel');
    const config = {
      babel: {
        modules: false,
        plugins: [
          // require('babel-plugin-minify-mangle-names'),
          // 'minify-mangle-names',
          // 'preval',
          this.plugin,
          this.lazyPlugin
        ],
        //"presets": ["minify"]
      },
      'ember-cli-babel': {
        compileModules: false,
        disableDebugTooling: true,
        disableEmberModulesAPIPolyfill: true,
        // eslint-disable-next-line unicorn/prevent-abbreviations
        disablePresetEnv: true
      }
    };

    // console.log('tree', tree);
    return babelAddon.transpileTree(tree, config);
  }
};
