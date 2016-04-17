import React, {Component} from 'react'
import {EpubReader} from '../src'
import styles from './style'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fullscreen: false
    }
  }

  toggleFullscreen () {
    this.setState({
      fullscreen: !this.state.fullscreen
    }, () => {
      const evt = document.createEvent('UIEvents')
      evt.initUIEvent('resize', true, false, global, 0)
      global.dispatchEvent(evt)
    })
  }

  render () {
    const {fullscreen} = this.state
    return (
      <div style={styles.container}>
        <div style={styles.bar}>
          <button onClick={this.toggleFullscreen.bind(this)}>Toggle</button>
        </div>
        <div style={Object.assign({}, styles.readerHolder, fullscreen ? styles.readerHolderFullscreen : {})}>
          <EpubReader url={'/alice/OPS/package.opf'} title={'Alice in Wonderland'} />
        </div>
      </div>
    )
  }
}

export default App
