const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');

const {dependencies, peerDependencies} = require('../../package.json');

const styles = require('./plugins/styles');
const image = require('./plugins/image');

const externalPackages = [
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies),
];

module.exports = function createRollupConfig({entry, cssPath}) {
  return {
    input: entry,
    external(id) {
      return externalPackages.some((aPackage) => id.startsWith(aPackage));
    },
    plugins: [
      json(),
      nodeResolve({
        mainFields: ['module', 'jsnext:main', 'main'],
        customResolveOptions: {
          moduleDirectory: ['../build-intermediate', 'node_modules'],
        },
      }),
      babel({
        // We need to specify an environment name as leaving it blank defaults
        // to "development", which ends up including a bunch of debug helpers.
        envName: 'production',
        include: '**/*.js',
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
      commonjs(),
      styles({
        output: cssPath,
      }),
      image({
        exclude: ['node_modules/**'],
      }),
    ],
  };
};
