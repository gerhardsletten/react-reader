import React, {Component, PropTypes} from 'react'
import {EpubView} from '..'
import defaultStyles from './style'

class ReactReader extends Component {

  constructor (props) {
    super(props)
    const {location} = this.props
    this.state = {
      expanedToc: false,
      toc: false,
      location: location
    }
  }

  toggleToc () {
    this.setState({
      expanedToc: !this.state.expanedToc
    })
  }

  next () {
    this.refs.reader.nextPage()
  }

  prev () {
    this.refs.reader.prevPage()
  }

  onTocChange (toc) {
    const {tocChanged} = this.props
    this.setState({
      toc: toc
    }, () => tocChanged && tocChanged(toc))
  }

  onLocationChange (loc) {
    const {locationChanged} = this.props
    return locationChanged && locationChanged(loc)
    /* Should we update location?
    this.setState({
      location: loc
    }, () => locationChanged && locationChanged(loc))
    */
  }

  renderToc () {
    const {toc} = this.state
    const {styles} = this.props
    return (
      <div style={styles.tocArea}>
        <div style={styles.toc}>
          {toc.map((item, i) =>
            <button key={item.href} onClick={this.setLocation.bind(this, item.href)} style={styles.tocAreaButton}>{item.label}</button>
          )}
        </div>
      </div>
    )
  }

  setLocation (loc) {
    this.setState({
      location: loc,
      expanedToc: false
    })
  }

  renderTocToggle () {
    const {expanedToc} = this.state
    const {styles} = this.props
    return (
      <button style={Object.assign({}, styles.tocButton, expanedToc ? styles.tocButtonExpaned : {})} onClick={this.toggleToc.bind(this)}>
        <span style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)} />
        <span style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)} />
      </button>
    )
  }

  render () {
    const {url, title, showToc, loadingView} = this.props
    const {toc, location, expanedToc} = this.state
    const {styles} = this.props
    return (
      <div style={styles.container}>
        <div style={Object.assign({}, styles.readerArea, expanedToc ? styles.containerExpaned : {})}>
          {showToc && this.renderTocToggle()}
          <div style={styles.titleArea}>{title}</div>
          <div style={styles.reader}>
            <EpubView
              ref='reader'
              url={url}
              location={location}
              loadingView={loadingView}
              tocChanged={this.onTocChange.bind(this)}
              locationChanged={this.onLocationChange.bind(this)}
            />
          </div>
          <button style={Object.assign({}, styles.arrow, styles.prev)} onClick={this.prev.bind(this)}>‹</button>
          <button style={Object.assign({}, styles.arrow, styles.next)} onClick={this.next.bind(this)}>›</button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    )
  }
}

class LoadingView extends Component {
  render () {
    return <div style={defaultStyles.loadingView}>Loading…</div>
  }
}

ReactReader.defaultProps = {
  loadingView: <LoadingView />,
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: defaultStyles
}

ReactReader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  url: PropTypes.string,
  showToc: PropTypes.bool,
  location: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object
}

export default ReactReader
