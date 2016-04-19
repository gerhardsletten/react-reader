import React, {Component} from 'react'
import {ReactReader} from '../src'
import styles from './style'
import logo from 'file!./react-reader.svg'

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
      setTimeout(() => {
        const evt = document.createEvent('UIEvents')
        evt.initUIEvent('resize', true, false, global, 0)
        global.dispatchEvent(evt)
      }, 1000)
    })
  }

  render () {
    const {fullscreen} = this.state
    return (
      <div style={styles.container}>
        <div style={styles.bar}>
          <a href='https://github.com/gerhardsletten/react-reader'>
            <img src={logo} style={styles.logo} alt='React-reader - powered by epubjs' />
          </a>
          <button onClick={this.toggleFullscreen.bind(this)} style={styles.closeLink}>
            Use full browser window
            <span style={styles.closeIcon}>
              <span style={Object.assign({}, styles.closeIconBar)} />
              <span style={Object.assign({}, styles.closeIconBar, styles.closeIconBarLast)} />
            </span>
          </button>
        </div>
        <div style={Object.assign({}, styles.readerHolder, fullscreen ? styles.readerHolderFullscreen : {})}>
          <ReactReader
            url={'/alice/OPS/package.opf'}
            title={'Alice in wonderland'}
            location={'https://s3-eu-west-1.amazonaws.com/react-reader/alice.epub'}
          />
        </div>
      </div>
    )
  }
}

export default App
