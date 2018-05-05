import babel from 'rollup-plugin-babel'

const pack = require('./package.json')
const YEAR = new Date().getFullYear()

export default {
  entry: 'src/index.js',
  targets: [
    { dest: 'dist/sav-schema.cjs.js', format: 'cjs' }
  ],
  plugins: [
    babel({
      babelrc: false,
      externalHelpers: false,
      exclude: 'node_modules/**',
      'plugins': [
        ['transform-object-rest-spread', { 'useBuiltIns': true }]
      ]
    })
  ],
  banner   () {
    return `/*!
 * ${pack.name} v${pack.version}
 * (c) ${YEAR} ${pack.author.name} ${pack.author.email}
 * Release under the ${pack.license} License.
 */`
  },
  // Cleaner console
  onwarn (msg) {
    if (msg && msg.startsWith('Treating')) {
      return
    }
  }
}
