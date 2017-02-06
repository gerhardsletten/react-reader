import React, {Component} from 'react'
import {ReactReader} from '../src'
import styles from './App.css'
import logo from 'file?name=[name].[ext]!./react-reader.svg'

const storage = global.localStorage || null

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fullscreen: false,
      location: (storage && storage.getItem('epub-location')) ? storage.getItem('epub-location') : 0
    }
  }

  toggleFullscreen = () => {
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

  onLocationChanged = (loc) => {
    storage && storage.setItem('epub-location', loc)
  }

  render () {
    const {fullscreen, location} = this.state
    return (
      <div className={styles.container}>
        <div className={styles.bar}>
          <a href='https://github.com/gerhardsletten/react-reader'>
            <img src={logo} className={styles.logo} alt='React-reader - powered by epubjs' />
          </a>
          <button onClick={this.toggleFullscreen} className={styles.closeLink}>
            Use full browser window
            <span className={styles.closeIcon} />
          </button>
        </div>
        <div className={fullscreen ? styles.readerHolderFullscreen : styles.readerHolder}>
          <ReactReader
            url={'https://s3-eu-west-1.amazonaws.com/react-reader/alice.epub'}
            locationChanged={this.onLocationChanged}
            title={'Alice in wonderland'}
            location={location}
          />
        </div>
      </div>
    )
  }
}

export default App
