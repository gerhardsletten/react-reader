import React, {Component, PropTypes} from 'react'
import {EpubView} from '..'
import styles from './style'

class EpubReader extends Component {

  constructor (props) {
    super(props)
    this.state = {
      expanedToc: false,
      toc: false,
      location: null
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
    this.setState({
      toc: toc
    })
  }

  renderToc () {
    const {toc} = this.state
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

  render () {
    const {url, title} = this.props
    const {toc, location, expanedToc} = this.state
    return (
      <div>
        <div style={Object.assign({}, styles.readerArea, expanedToc ? styles.containerExpaned : {})}>
          <button style={Object.assign({}, styles.tocButton, expanedToc ? styles.tocButtonExpaned : {})} onClick={this.toggleToc.bind(this)}>
            <span style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)} />
            <span style={styles.tocButtonBar} />
            <span style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)} />
          </button>
          <div style={styles.titleArea}>{title}</div>
          <div style={styles.reader}>
            <EpubView ref='reader' epubUrl={url} location={location} tocChanged={this.onTocChange.bind(this)} />
          </div>
          <button style={Object.assign({}, styles.arrow, styles.prev)} onClick={this.prev.bind(this)}>‹</button>
          <button style={Object.assign({}, styles.arrow, styles.next)} onClick={this.next.bind(this)}>›</button>
        </div>
        {toc && this.renderToc()}
      </div>
    )
  }
}

EpubReader.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string
}

export default EpubReader
