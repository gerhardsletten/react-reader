import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const SmoothScroll = () => {
  const [location, setLocation] = useState<string | number>(0)
  return (
    <Example
      title="Smooth Scroll"
      actions={
        <p>
          Sets css-property for epub-js manager to{' '}
          <kbd>scroll-behavior: smooth</kbd>
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
            // @ts-ignore - manager type is missing in epubjs Rendition
            _rendition.manager.container.style['scroll-behavior'] = 'smooth'
          })
        }}
      />
    </Example>
  )
}
