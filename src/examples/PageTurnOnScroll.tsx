import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const PageTurnOnScroll = () => {
  const [largeText, setLargeText] = useState(false)
  const rendition = useRef<Rendition | undefined>(undefined)
  const [location, setLocation] = useState<string | number>(0)
  useEffect(() => {
    rendition.current?.themes.fontSize(largeText ? '140%' : '100%')
  }, [largeText])
  return (
    <Example
      title="Page Turn On Scroll example"
      actions={
        <>
          <button onClick={() => setLargeText(!largeText)} className="btn">
            Toggle font-size
          </button>
        </>
      }
    >
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        pageTurnOnScroll={true} //Setting true for enabling page change on scroll ( Works neatly for paginated document, not for scrolled documents )
        locationChanged={(loc: string) => setLocation(loc)}
        epubOptions={{
          flow: 'paginated',
        }}
      />
    </Example>
  )
}
