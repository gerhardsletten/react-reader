import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../lib/index'
import { Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const Basic = () => {
  const [largeText, setLargeText] = useState(false)
  const rendition = useRef<any>(null)
  const [location, setLocation] = useState<string | number>(2)
  useEffect(() => {
    rendition.current?.themes.fontSize(largeText ? '140%' : '100%')
  }, [largeText])
  return (
    <Example
      title="Basic example"
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
        locationChanged={(loc: string) => setLocation(loc)}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition
          rendition.current.themes.fontSize(largeText ? '140%' : '100%')
        }}
      />
    </Example>
  )
}
