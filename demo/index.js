import React from 'react'
import {render} from 'react-dom'
import App from './App'
import { AppContainer } from 'react-hot-loader'

render((<AppContainer><App /></AppContainer>), document.getElementById('main'))

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextRoot = require('./App').default
    render((<AppContainer><NextRoot /></AppContainer>), document.getElementById('main'))
  })
}
