import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { useSwipeable } from 'react-swipeable'
import { EpubView } from '..'
import { ReactReaderStyle as defaultStyles } from './style'

const Swipeable = ({ children, ...props }) => {
  const handlers = useSwipeable(props)
  return <div {...handlers}>{children}</div>
}

class TocItem extends PureComponent {
  setLocation = () => {
    this.props.setLocation(this.props.href)
  }
  render() {
    const { label, styles, subitems } = this.props
    return (
      <div>
        <button onClick={this.setLocation} style={styles}>
          {label}
        </button>
        {subitems && subitems.length > 0 && (
          <div style={{ paddingLeft: 10 }}>
            {subitems.map((item, i) => (
              <TocItem key={i} {...this.props} {...item} />
            ))}
          </div>
        )}
      </div>
    )
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object
}

class ReactReader extends PureComponent {
  constructor(props) {
    super(props)
    this.readerRef = React.createRef()
    this.state = {
      expandedToc: false,
      toc: false
    }
  }
  toggleToc = () => {
    this.setState({
      expandedToc: !this.state.expandedToc
    })
  }

  next = () => {
    const node = this.readerRef.current
    node.nextPage()
  }

  prev = () => {
    const node = this.readerRef.current
    node.prevPage()
  }

  onTocChange = toc => {
    const { tocChanged } = this.props
    this.setState(
      {
        toc: toc
      },
      () => tocChanged && tocChanged(toc)
    )
  }

  renderToc() {
    const { toc, expandedToc } = this.state
    const { readerStyles } = this.props
    return (
      <div>
        <div style={readerStyles.tocArea}>
          <div style={readerStyles.toc}>
            {toc.map((item, i) => (
              <TocItem
                {...item}
                key={i}
                setLocation={this.setLocation}
                styles={readerStyles.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {expandedToc && (
          <div style={readerStyles.tocBackground} onClick={this.toggleToc} />
        )}
      </div>
    )
  }

  setLocation = loc => {
    const { locationChanged } = this.props
    this.setState(
      {
        expandedToc: false
      },
      () => locationChanged && locationChanged(loc)
    )
  }

  renderTocToggle() {
    const { expandedToc } = this.state
    const { readerStyles } = this.props
    return (
      <button
        style={Object.assign(
          {},
          readerStyles.tocButton,
          expandedToc ? readerStyles.tocButtonExpanded : {}
        )}
        onClick={this.toggleToc}
      >
        <span
          style={Object.assign(
            {},
            readerStyles.tocButtonBar,
            readerStyles.tocButtonBarTop
          )}
        />
        <span
          style={Object.assign(
            {},
            readerStyles.tocButtonBar,
            readerStyles.tocButtonBottom
          )}
        />
      </button>
    )
  }

  render() {
    const {
      title,
      showToc,
      loadingView,
      readerStyles,
      locationChanged,
      swipeable,
      epubViewStyles,
      ...props
    } = this.props
    const { toc, expandedToc } = this.state
    return (
      <div style={readerStyles.container}>
        <div
          style={Object.assign(
            {},
            readerStyles.readerArea,
            expandedToc ? readerStyles.containerExpanded : {}
          )}
        >
          {showToc && this.renderTocToggle()}
          <div style={readerStyles.titleArea}>{title}</div>
          <Swipeable
            onSwipedRight={this.prev}
            onSwipedLeft={this.next}
            trackMouse
          >
            <div style={readerStyles.reader}>
              <EpubView
                ref={this.readerRef}
                loadingView={loadingView}
                epubViewStyles={epubViewStyles}
                {...props}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
              />
              {swipeable && <div style={readerStyles.swipeWrapper} />}
            </div>
          </Swipeable>
          <button
            style={Object.assign({}, readerStyles.arrow, readerStyles.prev)}
            onClick={this.prev}
          >
            ‹
          </button>
          <button
            style={Object.assign({}, readerStyles.arrow, readerStyles.next)}
            onClick={this.next}
          >
            ›
          </button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    )
  }
}

ReactReader.defaultProps = {
  loadingView: <div style={defaultStyles.loadingView}>Loading…</div>,
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  readerStyles: defaultStyles
}

ReactReader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  showToc: PropTypes.bool,
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  readerStyles: PropTypes.object,
  epubViewStyles: PropTypes.object,
  swipeable: PropTypes.bool
}

export default ReactReader
