const { NODE_ENV } = process.env
const modules = NODE_ENV === 'production' ? false : 'commonjs'
const loose = true

module.exports = {
  presets: [
    [
      'env',
      {
        loose,
        modules
      }
    ],
    'react'
  ],
  plugins: [
    'react-hot-loader/babel',
    'transform-object-rest-spread',
    ['transform-class-properties', { loose }]
  ]
}
