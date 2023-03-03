import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Epub from 'epubjs/lib/index'
import { EpubViewStyle as defaultStyles } from './style'

// MTL removed - line does not seem like a requirement any more (and was causing an error)
// global.ePub = Epub; // Fix for v3 branch of epub.js -> needs ePub to by a global var

class EpubView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      toc: []
    }
    this.viewerRef = React.createRef()
    this.location = props.location
    this.book = this.rendition = this.prevPage = this.nextPage = null
  }

  componentDidMount() {
    this.initBook(true)
    document.addEventListener('keyup', this.handleKeyPress, false)
  }

  initBook() {
    const { url, tocChanged, epubInitOptions } = this.props
    if (this.book) {
      this.book.destroy()
    }
    this.book = new Epub(url, epubInitOptions)
    this.book.loaded.navigation.then(({ toc }) => {
      this.setState(
        {
          isLoaded: true,
          toc: toc
        },
        () => {
          tocChanged && tocChanged(toc)
          this.initReader()
        }
      )
    })
  }

  componentWillUnmount() {
    if (this.book) {
      this.book.destroy()
    }
    this.book = this.rendition = this.prevPage = this.nextPage = null
    document.removeEventListener('keyup', this.handleKeyPress, false)
  }

  shouldComponentUpdate(nextProps) {
    return (
      !this.state.isLoaded ||
      nextProps.location !== this.props.location ||
      nextProps.location !== this.props.location
    )
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.location !== this.props.location &&
      this.location !== this.props.location
    ) {
      this.rendition.display(this.props.location)
    }
    if (prevProps.url !== this.props.url) {
      this.initBook()
    }
  }

  initReader() {
    const { toc } = this.state
    const { location, epubOptions, getRendition } = this.props
    const node = this.viewerRef.current
    this.rendition = this.book.renderTo(node, {
      contained: true,
      width: '100%',
      height: '100%',
      ...epubOptions
    })

    this.prevPage = () => {
      this.rendition.prev()
    }
    this.nextPage = () => {
      this.rendition.next()
    }
    this.registerEvents()
    getRendition && getRendition(this.rendition)

    if (typeof location === 'string' || typeof location === 'number') {
      this.rendition.display(location)
    } else if (toc.length > 0 && toc[0].href) {
      this.rendition.display(toc[0].href)
    } else {
      this.rendition.display()
    }
  }

  registerEvents() {
    const { handleKeyPress, handleTextSelected } = this.props
    this.rendition.on('locationChanged', this.onLocationChange)
    this.rendition.on('keyup', handleKeyPress || this.handleKeyPress)
    if (handleTextSelected) {
      this.rendition.on('selected', handleTextSelected)
    }
  }

  onLocationChange = loc => {
    const { location, locationChanged } = this.props
    const newLocation = loc && loc.start
    if (location !== newLocation) {
      this.location = newLocation
      locationChanged && locationChanged(newLocation)
    }
  }

  renderBook() {
    const { epubViewStyles } = this.props
    return <div ref={this.viewerRef} style={epubViewStyles.view} />
  }

  handleKeyPress = ({ key }) => {
    key && key === 'ArrowRight' && this.nextPage()
    key && key === 'ArrowLeft' && this.prevPage()
  }

  render() {
    const { isLoaded } = this.state
    const { loadingView, epubViewStyles } = this.props
    return (
      <div style={epubViewStyles.viewHolder}>
        {(isLoaded && this.renderBook()) || loadingView}
      </div>
    )
  }
}

EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null,
  epubViewStyles: defaultStyles,
  epubOptions: {},
  epubInitOptions: {}
}

EpubView.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(ArrayBuffer)
  ]),
  loadingView: PropTypes.element,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  epubViewStyles: PropTypes.object,
  epubInitOptions: PropTypes.object,
  epubOptions: PropTypes.object,
  getRendition: PropTypes.func,
  handleKeyPress: PropTypes.func,
  handleTextSelected: PropTypes.func
}

export default EpubView
