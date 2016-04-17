import React, {Component, PropTypes} from 'react'
import Epub from 'epubjs'
import throttle from 'lodash.throttle'
import styles from './style'

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
    const {epubUrl, tocChanged} = this.props
    this.book = new Epub(epubUrl)
    this.book.loaded.navigation.then((toc) => {
      this.setState({
        isLoaded: true,
        toc: toc
      }, () => {
        console.log(toc)
        tocChanged && tocChanged(toc)
        this.initReader()
      })
    })
    global.addEventListener('resize', throttle(() => this.handleResize(), 1000))
  }

  componentWillUnmount () {
    global.removeEventListener('resize', throttle(() => this.handleResize(), 1000))
    this.book = this.rendition = this.prevPage = this.nextPage = null
  }

  handleResize (e) {
    console.log(window.innerWidth, window.innerHeight, 'resize')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !this.state.isLoaded || nextProps.location !== this.state.location
  }

  initReader () {
    const {viewer} = this.refs
    const {toc} = this.state
    const {location, locationChanged} = this.props
    this.rendition = this.book.renderTo(viewer, {
      method: 'paginate',
      contained: true,
      width: '100%', // viewer.offsetWidth,
      height: '100%' // viewer.offsetHeight
    })
    this.rendition.display(location || toc[0].href)

    this.prevPage = () => {
      this.rendition.prev()
    }
    this.nextPage = () => {
      this.rendition.next()
    }
    this.rendition.on('locationChanged', (loc) => {
      locationChanged && locationChanged(loc.end)
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      this.rendition.display(this.props.location)
    }
  }

  renderBook () {
    return (
      <div ref='viewer' style={styles.view}></div>
    )
  }

  render () {
    const {isLoaded} = this.state
    const {loadingView} = this.props
    return (
      <div style={styles.viewHolder}>
        {isLoaded && this.renderBook() || loadingView && loadingView()}
      </div>
    )
  }
}

EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null
}

EpubView.propTypes = {
  epubUrl: PropTypes.string,
  location: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func
}

export default EpubView
