import React, { type CSSProperties, PureComponent, type ReactNode } from 'react'
import {
  type SwipeableProps,
  type SwipeEventData,
  useSwipeable,
} from 'react-swipeable'
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
  return (
    <div style={{ height: '100%' }} {...handlers}>
      {children}
    </div>
  )
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
  isRTL?: boolean
  pageTurnOnScroll?: boolean
  searchQuery?: string
  contextLength?: number
  onSearchResults?: (results: SearchResult[]) => void
}

type SearchResult = { cfi: string; excerpt: string }

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

  // Changing Page based on direction of scroll
  handleWheel = (event: WheelEvent) => {
    event.preventDefault()

    const node = this.readerRef.current
    if (!node) return

    if (event.deltaY > 0) {
      node.nextPage?.()
    } else if (event.deltaY < 0) {
      node.prevPage?.()
    }
  }

  // Setting up event listener in the iframe of the viewer
  attachWheelListener = () => {
    if (!this.readerRef.current) return

    const rendition = this.readerRef.current.rendition

    if (rendition) {
      rendition.hooks.content.register(
        (contents: { window: { document: any } }) => {
          const iframeDoc = contents.window.document

          // Remove any existing listener before adding a new one
          iframeDoc.removeEventListener('wheel', this.handleWheel)
          iframeDoc.addEventListener('wheel', this.handleWheel, {
            passive: false,
          })
        }
      )
    }
  }

  //search function to find all occurence and set amount of charecters for context
  searchInBook = async (query?: string) => {
    if (!this.readerRef.current) return
    const rendition = this.readerRef.current?.rendition
    const book = rendition?.book
    if (!book) return

    if (!query) {
      this.props.onSearchResults?.([])
      return
    }

    await book.ready
    const results: SearchResult[] = []
    const promises: Promise<void>[] = []

    book.spine.each((item: any) => {
      if (query == '' || query == null) results
      const promise = (async () => {
        try {
          await item.load(book.load.bind(book))
          const doc = item.document
          const textNodes: Node[] = []

          const treeWalker = doc.createTreeWalker(
            doc,
            NodeFilter.SHOW_TEXT,
            null,
            false
          )
          let node
          while ((node = treeWalker.nextNode())) {
            textNodes.push(node)
          }

          const fullText = textNodes
            .map((n) => n.textContent)
            .join('')
            .toLowerCase()
          const searchQuery = query.toLowerCase()
          let pos = fullText.indexOf(searchQuery)

          while (pos !== -1) {
            let nodeIndex = 0
            let foundOffset = pos

            while (nodeIndex < textNodes.length) {
              const nodeText = textNodes[nodeIndex].textContent || ''
              if (foundOffset < nodeText.length) break
              foundOffset -= nodeText.length
              nodeIndex++
            }

            if (nodeIndex < textNodes.length) {
              let range = doc.createRange()
              try {
                range.setStart(textNodes[nodeIndex], foundOffset)
                range.setEnd(
                  textNodes[nodeIndex],
                  foundOffset + searchQuery.length
                )
                const cfi = item.cfiFromRange(range)
                const excerpt = `${fullText.substring(
                  Math.max(0, pos - (this.props.contextLength || 15)),
                  pos + searchQuery.length + (this.props.contextLength || 15)
                )}`

                results.push({ cfi, excerpt })
              } catch (e) {
                console.warn('Skipping invalid range:', e)
              }
            }

            pos = fullText.indexOf(searchQuery, pos + 1)
          }

          item.unload()
        } catch (error) {
          console.error('Error searching chapter:', error)
        }
      })()
      promises.push(promise)
    })

    await Promise.all(promises)
    //Fix for Search Result of previous query retaining when
    if (query == this.props.searchQuery) {
      this.props.onSearchResults?.(results) //passing result as an array of objects with cfi and excerpt
    }
  }

  //Actions to perform when the component updates
  componentDidUpdate(prevProps: IReactReaderProps) {
    //searching only when new search query is passed
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.searchInBook(this.props.searchQuery)
    }

    //attaching the wheel listner only when pageTurnOnScroll is set as true
    if (this.props.pageTurnOnScroll === true) {
      this.attachWheelListener()
    }
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
      isRTL = false,
      pageTurnOnScroll = false,
      searchQuery,
      contextLength,
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
              onSwiped: (eventData: SwipeEventData) => {
                const { dir } = eventData
                if (dir === 'Left') {
                  isRTL ? this.prev() : this.next()
                }
                if (dir === 'Right') {
                  isRTL ? this.next() : this.prev()
                }
              },
              onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
              touchEventOptions: { passive: false },
              preventScrollOnSwipe: true,
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
            onClick={isRTL ? this.next : this.prev}
          >
            ‹
          </button>
          <button
            style={Object.assign({}, readerStyles.arrow, readerStyles.next)}
            onClick={isRTL ? this.prev : this.next}
          >
            ›
          </button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    )
  }
}
