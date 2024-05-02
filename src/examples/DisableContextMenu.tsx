import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const DisableContextMenu = () => {
  const [location, setLocation] = useState<string | number>(0)
  return (
    <Example
      title="Disable context menu example"
      actions={
        <p>
          This examle shows how the default browser context menu is disabled.
        </p>
      }
    >
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        getRendition={(_rendition: Rendition) => {
          _rendition.hooks.content.register((contents: Contents) => {
            const body = contents.window.document.querySelector('body')
            if (body) {
              body.oncontextmenu = () => {
                return false
              }
            }
          })
        }}
      />
    </Example>
  )
}
