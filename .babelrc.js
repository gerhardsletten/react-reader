const loose = true

module.exports = {
  presets: [
    [
      'env',
      {
        loose
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
