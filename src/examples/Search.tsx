import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../../lib/index'
import type { Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

type SearchResult = { cfi: string; excerpt: string } //type for search result

export const Search = () => {
  const [largeText, setLargeText] = useState(false)
  const [location, setLocation] = useState<string | number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]) //Array that stores the search results from ReactReader
  const [currentResultIndex, setCurrentResultIndex] = useState(0) //Storing the current index for switching to next result
  const rendition = useRef<Rendition | undefined>(undefined)

  useEffect(() => {
    rendition.current?.themes.fontSize(largeText ? '140%' : '100%')
  }, [largeText])

  //switching to the next occurence of the search term on click
  const goToNextResult = () => {
    if (!searchResults.length) return
    const nextIndex = (currentResultIndex + 1) % searchResults.length
    setCurrentResultIndex(nextIndex)
    setLocation(searchResults[nextIndex].cfi)
  }

  useEffect(() => {
    if (searchResults.length) setLocation(searchResults[0].cfi) //once search result is returned with data, go to the corresponding page with occurence of search term
    setCurrentResultIndex(0)
    // console.log(searchResults);
  }, [searchResults])

  return (
    <Example
      title="Search example"
      actions={
        <div className="search">
          <input
            type="text"
            placeholder="Search word..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} //initiating the search whenever the search term changes, can be moved to work on click.
            className="searchInput"
          />

          <button
            onClick={goToNextResult}
            disabled={!searchResults.length}
            className="nextResultBtn"
          >
            Next Result ({searchResults.length > 0 ? currentResultIndex + 1 : 0}
            /{searchResults.length})
          </button>
        </div>
      }
    >
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition
          rendition.current.themes.fontSize(largeText ? '140%' : '100%')
        }}
        searchQuery={searchQuery} //Passing the search term
        onSearchResults={setSearchResults} //Reciever for the search result array
        contextLength={2} //Passing the number of characters for context, By default 30 characters
      />
    </Example>
  )
}
