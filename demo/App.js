import React, {Component} from 'react'
import {ReactReader} from '../src'
import styles from './App.css'
import logo from './react-reader.svg'

const storage = global.localStorage || null

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fullscreen: false,
      location: (storage && storage.getItem('epub-location')) ? storage.getItem('epub-location') : 2,
      largeText: false
    }
    this.rendition = null
  }

  toggleFullscreen = () => {
    this.setState({
      fullscreen: !this.state.fullscreen
    }, () => {
      setTimeout(() => {
        const evt = document.createEvent('UIEvents')
        evt.initUIEvent('resize', true, false, global, 0)
      }, 1000)
    })
  }

  onLocationChanged = (location) => {
    this.setState({
      location
    }, () => {
      storage && storage.setItem('epub-location', location)
    })
  }

  onRenditionSelection = (cfiRange, contents) => {
    console.log('Selection was created', cfiRange, contents)
    contents.mark(cfiRange, {}, (e) => {
      console.log('You clicked the selection')
    })
    contents.highlight(cfiRange)
    contents.window.getSelection().removeAllRanges()
  }

  onToggleFontSize = () => {
    const nextState = !this.state.largeText
    this.setState({
      largeText: nextState
    }, () => {
      this.rendition.themes.fontSize(nextState ? '140%' : '100%')
    })
  }

  getRendition = (rendition) => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const {largeText} = this.state
    this.rendition = rendition
    rendition.themes.fontSize(largeText ? '140%' : '100%')
    // Selection stuff for rendition
    rendition.on('selected', this.onRenditionSelection)
    rendition.themes.default({
      '::selection': {
        'background': 'rgba(255,255,0, 0.3)'
      },
      '.epubjs-hl': {
        'fill': 'yellow', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
      },
      'p': {
        'padding': '0 20px 0 0',
        'text-align': 'left',
        'position': 'relative'
      },
      '[ref="epubjs-mk"]::before': {
        'content': '""',
        'background': 'url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB2aWV3Qm94PScwIDAgNzUgNzUnPjxnIGZpbGw9JyNCREJEQkQnIGlkPSdidWJibGUnPjxwYXRoIGNsYXNzPSdzdDAnIGQ9J00zNy41LDkuNEMxOS42LDkuNCw1LDIwLjUsNSwzNC4zYzAsNS45LDIuNywxMS4zLDcuMSwxNS42TDkuNiw2NS42bDE5LTcuM2MyLjgsMC42LDUuOCwwLjksOC45LDAuOSBDNTUuNSw1OS4yLDcwLDQ4LjEsNzAsMzQuM0M3MCwyMC41LDU1LjQsOS40LDM3LjUsOS40eicvPjwvZz48L3N2Zz4=") no-repeat',
        'display': 'block',
        'right': '0',
        'position': 'absolute',
        'width': '20px',
        'height': '20px',
        'margin': '0',
        'cursor': 'pointer'
      }
    })
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
            getRendition={this.getRendition}
          />
          <button className={styles.toggleFontSize} onClick={this.onToggleFontSize}>Toggle font-size</button>
        </div>
      </div>
    )
  }
}

export default App
