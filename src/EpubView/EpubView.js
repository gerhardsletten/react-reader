import React, {Component, PropTypes} from 'react'
import Epub from 'epubjs'
import defaultStyles from './style'

global.ePub = Epub // Fix for v3 branch of epub.js -> needs ePub to by a global var

class EpubView extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      toc: []
    }
    this.book = this.rendition = this.prevPage = this.nextPage = null
  }

  componentDidMount () {
    const {url, tocChanged} = this.props
    this.book = new Epub(url)
    this.book.loaded.navigation.then((toc) => {
      this.setState({
        isLoaded: true,
        toc: toc
      }, () => {
        tocChanged && tocChanged(toc)
        this.initReader()
      })
    })
  }

  componentWillUnmount () {
    this.book = this.rendition = this.prevPage = this.nextPage = null
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !this.state.isLoaded || nextProps.location !== this.state.location
  }

  initReader () {
    const {viewer} = this.refs
    const {toc} = this.state
    const {location, locationChanged} = this.props
    this.rendition = this.book.renderTo(viewer, {
      contained: true,
      width: '100%',
      height: '100%'
    })
    this.rendition.display(location || toc[0].href)

    this.prevPage = () => {
      this.rendition.prev()
    }
    this.nextPage = () => {
      this.rendition.next()
    }
    this.rendition.on('locationChanged', (loc) => {
      loc && loc.end && locationChanged && locationChanged(loc.end)
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      this.rendition.display(this.props.location)
    }
  }

  renderBook () {
    const {styles} = this.props
    return (
      <div ref='viewer' style={styles.view} />
    )
  }

  render () {
    const {isLoaded} = this.state
    const {loadingView, styles} = this.props
    return (
      <div style={styles.viewHolder}>
        {isLoaded && this.renderBook() || loadingView}
      </div>
    )
  }
}

EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null,
  styles: defaultStyles
}

EpubView.propTypes = {
  url: PropTypes.string,
  loadingView: PropTypes.element,
  location: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object
}

export default EpubView
