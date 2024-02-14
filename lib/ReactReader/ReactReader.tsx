import React, { type CSSProperties, PureComponent, type ReactNode } from 'react'
import { type SwipeableProps, useSwipeable } from 'react-swipeable'
import { EpubView, type IEpubViewStyle, type IEpubViewProps } from '..'
import {
  ReactReaderStyle as defaultStyles,
  type IReactReaderStyle,
} from './style'
import { type NavItem } from 'epubjs'

type SwipeWrapperProps = {
  children: ReactNode
  swipeProps: Partial<SwipeableProps>
}

const SwipeWrapper = ({ children, swipeProps }: SwipeWrapperProps) => {
  const handlers = useSwipeable(swipeProps)
  return <div {...handlers}>{children}</div>
}

type TocItemProps = {
  data: NavItem
  setLocation: (value: string) => void
  styles?: CSSProperties
}

const TocItem = ({ data, setLocation, styles }: TocItemProps) => (
  <div>
    <button onClick={() => setLocation(data.href)} style={styles}>
      {data.label}
    </button>
    {data.subitems && data.subitems.length > 0 && (
      <div style={{ paddingLeft: 10 }}>
        {data.subitems.map((item, i) => (
          <TocItem
            key={i}
            data={item}
            styles={styles}
            setLocation={setLocation}
          />
        ))}
      </div>
    )}
  </div>
)

export type IReactReaderProps = IEpubViewProps & {
  title?: string
  showToc?: boolean
  readerStyles?: IReactReaderStyle
  epubViewStyles?: IEpubViewStyle
  swipeable?: boolean
}

type IReactReaderState = {
  isLoaded: boolean
  expandedToc: boolean
  toc: NavItem[]
}

export class ReactReader extends PureComponent<
  IReactReaderProps,
  IReactReaderState
> {
  state: Readonly<IReactReaderState> = {
    isLoaded: false,
    expandedToc: false,
    toc: [],
  }
  readerRef = React.createRef<EpubView>()
  constructor(props: IReactReaderProps) {
    super(props)
  }
  toggleToc = () => {
    this.setState({
      expandedToc: !this.state.expandedToc,
    })
  }

  next = () => {
    const node = this.readerRef.current
    if (node && node.nextPage) {
      node.nextPage()
    }
  }

  prev = () => {
    const node = this.readerRef.current
    if (node && node.prevPage) {
      node.prevPage()
    }
  }

  onTocChange = (toc: NavItem[]) => {
    const { tocChanged } = this.props
    this.setState(
      {
        toc: toc,
      },
      () => tocChanged && tocChanged(toc)
    )
  }

  renderToc() {
    const { toc, expandedToc } = this.state
    const { readerStyles = defaultStyles } = this.props
    return (
      <div>
        <div style={readerStyles.tocArea}>
          <div style={readerStyles.toc}>
            {toc.map((item, i) => (
              <TocItem
                data={item}
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

  setLocation = (loc: string) => {
    const { locationChanged } = this.props
    this.setState(
      {
        expandedToc: false,
      },
      () => locationChanged && locationChanged(loc)
    )
  }

  renderTocToggle() {
    const { expandedToc } = this.state
    const { readerStyles = defaultStyles } = this.props
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
      showToc = true,
      loadingView,
      readerStyles = defaultStyles,
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
          <SwipeWrapper
            swipeProps={{
              onSwipedRight: this.prev,
              onSwipedLeft: this.next,
              trackMouse: true,
            }}
          >
            <div style={readerStyles.reader}>
              <EpubView
                ref={this.readerRef}
                loadingView={
                  loadingView === undefined ? (
                    <div style={readerStyles.loadingView}>Loading…</div>
                  ) : (
                    loadingView
                  )
                }
                epubViewStyles={epubViewStyles}
                {...props}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
              />
              {swipeable && <div style={readerStyles.swipeWrapper} />}
            </div>
          </SwipeWrapper>
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
