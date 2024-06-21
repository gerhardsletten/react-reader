import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

type Theme = 'default' | 'custom'

function updateTheme(rendition: Rendition, theme: Theme) {
  const themes = rendition.themes

  switch (theme) {
    case 'default': {
      themes.override('font-family', 'Arial')
      break
    }
    case 'custom': {
      themes.override('font-family', 'OpenDyslexic')
      break
    }
  }
}

export const CustomFont = () => {
  const [theme, setTheme] = useState<Theme>('custom')
  const rendition = useRef<Rendition | undefined>(undefined)
  const [location, setLocation] = useState<string | number>(0)
  useEffect(() => {
    if (rendition.current) {
      updateTheme(rendition.current, theme)
    }
  }, [theme])
  return (
    <Example
      title="CustomFont"
      actions={
        <>
          <button
            onClick={() => setTheme(theme === 'custom' ? 'default' : 'custom')}
            className="btn"
          >
            Toggle theme ({theme})
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
          console.log(rendition.current.themes)
          _rendition.hooks.content.register((contents: Contents) => {
            const document = contents.window.document
            console.log('document', document)
            if (document) {
              const css = `
              @font-face {
                font-family: "OpenDyslexic";
                font-weight: 400;
                font-style: normal;
                src: url("/files/open-dyslexic.woff") format("woff");
              }
              `
              const style = document.createElement('style')
              style.appendChild(document.createTextNode(css))
              document.head.appendChild(style)
              updateTheme(_rendition, theme)
            }
          })
        }}
      />
    </Example>
  )
}
