import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const Basic = () => {
  const [largeText, setLargeText] = useState(false)
  const rendition = useRef<Rendition | undefined>(undefined)
  const [location, setLocation] = useState<string | number>(0)
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
          _rendition.hooks.content.register((contents: Contents) => {
            const body = contents.window.document.querySelector('body')
            if (body) {
              body.oncontextmenu = () => {
                return false
              }
            }
          })
          rendition.current.themes.fontSize(largeText ? '140%' : '100%')
        }}
      />
    </Example>
  )
}
