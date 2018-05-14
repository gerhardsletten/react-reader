import React, { Component } from 'react'
import { ReactReader } from '../src'
import {
  Container,
  ReaderContainer,
  Bar,
  Logo,
  CloseButton,
  CloseIcon,
  FontSizeButton
} from './Components'

const storage = global.localStorage || null

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullscreen: process.env.NODE_ENV !== 'production',
      location:
        storage && storage.getItem('epub-location')
          ? storage.getItem('epub-location')
          : 2,
      largeText: false
    }
    this.rendition = null
  }

  toggleFullscreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        setTimeout(() => {
          const evt = document.createEvent('UIEvents')
          evt.initUIEvent('resize', true, false, global, 0)
        }, 1000)
      }
    )
  }

  onLocationChanged = location => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem('epub-location', location)
      }
    )
  }

  onToggleFontSize = () => {
    const nextState = !this.state.largeText
    this.setState(
      {
        largeText: nextState
      },
      () => {
        this.rendition.themes.fontSize(nextState ? '140%' : '100%')
      }
    )
  }

  getRendition = rendition => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state
    this.rendition = rendition
    rendition.themes.fontSize(largeText ? '140%' : '100%')
  }

  render() {
    const { fullscreen, location } = this.state
    return (
      <Container>
        <Bar>
          <a href="https://github.com/gerhardsletten/react-reader">
            <Logo
              src="https://s3-eu-west-1.amazonaws.com/react-reader/react-reader.svg"
              alt="React-reader - powered by epubjs"
            />
          </a>
          <CloseButton onClick={this.toggleFullscreen}>
            Use full browser window
            <CloseIcon />
          </CloseButton>
        </Bar>
        <ReaderContainer fullscreen={fullscreen}>
          <ReactReader
            url={'https://s3-eu-west-1.amazonaws.com/react-reader/alice.epub'}
            locationChanged={this.onLocationChanged}
            title={'Alice in wonderland'}
            location={location}
            getRendition={this.getRendition}
          />
          <FontSizeButton onClick={this.onToggleFontSize}>
            Toggle font-size
          </FontSizeButton>
        </ReaderContainer>
      </Container>
    )
  }
}

export default App
