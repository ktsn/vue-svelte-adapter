const pkg = require('./package.json')
const typescript = require('rollup-plugin-typescript2')

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 *
 * @license
 * Copyright (c) 2018 ${pkg.author}
 * Released under the MIT license
 */`

function capitalize(name) {
  const camelized = name.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
  return camelized[0].toUpperCase() + camelized.slice(1)
}

module.exports = {
  input: 'src/index.ts',
  js: false,
  plugins: [
    typescript({
      tsconfig: './src/tsconfig.json',
      typescript: require('typescript')
    })
  ],
  externals: ['vue'],
  globals: {
    vue: 'Vue'
  },
  moduleName: capitalize(pkg.name),
  banner
}
