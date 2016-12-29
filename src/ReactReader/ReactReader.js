import React, {Component, PropTypes} from 'react'
import {EpubView} from '..'
import defaultStyles from './style'

class TocItem extends Component {
  setLocation = () => {
    this.props.setLocation(this.props.href)
  }
  render () {
    const {label, styles} = this.props
    return (
      <button onClick={this.setLocation} style={styles}>{label}</button>
    )
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object
}

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

  toggleToc = () => {
    this.setState({
      expanedToc: !this.state.expanedToc
    })
  }

  next = () => {
    this.refs.reader.nextPage()
  }

  prev = () => {
    this.refs.reader.prevPage()
  }

  onTocChange = (toc) => {
    const {tocChanged} = this.props
    this.setState({
      toc: toc
    }, () => tocChanged && tocChanged(toc))
  }

  onLocationChange = (loc) => {
    const {locationChanged} = this.props
    return locationChanged && locationChanged(loc)
  }

  renderToc () {
    const {toc} = this.state
    const {styles} = this.props
    return (
      <div style={styles.tocArea}>
        <div style={styles.toc}>
          {toc.map((item, i) =>
            <TocItem key={item.href} {...item} setLocation={this.setLocation} styles={styles.tocAreaButton} />
          )}
        </div>
      </div>
    )
  }

  setLocation = (loc) => {
    this.setState({
      location: loc,
      expanedToc: false
    })
  }

  renderTocToggle () {
    const {expanedToc} = this.state
    const {styles} = this.props
    return (
      <button style={Object.assign({}, styles.tocButton, expanedToc ? styles.tocButtonExpaned : {})} onClick={this.toggleToc}>
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
              tocChanged={this.onTocChange}
              locationChanged={this.onLocationChange}
            />
          </div>
          <button style={Object.assign({}, styles.arrow, styles.prev)} onClick={this.prev}>‹</button>
          <button style={Object.assign({}, styles.arrow, styles.next)} onClick={this.next}>›</button>
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
