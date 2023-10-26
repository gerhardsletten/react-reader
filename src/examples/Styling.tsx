import { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import {
  ReactReader,
  ReactReaderStyle,
  type IReactReaderStyle,
} from '../lib/index'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'
import { type Rendition } from 'epubjs'

type ITheme = 'light' | 'dark'

function updateTheme(rendition: Rendition, theme: ITheme) {
  const themes = rendition.themes
  switch (theme) {
    case 'dark': {
      themes.override('color', '#fff')
      themes.override('background', '#000')
      break
    }
    case 'light': {
      themes.override('color', '#000')
      themes.override('background', '#fff')
      break
    }
  }
}

export const Styling = () => {
  const [location, setLocation] = useState<string | number>(0)
  const rendition = useRef<Rendition | undefined>(undefined)
  const [theme, setTheme] = useState<ITheme>('dark')
  useEffect(() => {
    if (rendition.current) {
      updateTheme(rendition.current, theme)
    }
  }, [theme])

  return (
    <Example
      title="Styling example"
      actions={
        <div className="contents">
          <button
            onClick={() => setTheme('light')}
            className={cx('btn', { underline: theme === 'light' })}
          >
            Light theme
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cx('btn', { underline: theme === 'dark' })}
          >
            Dark theme
          </button>
        </div>
      }
    >
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        readerStyles={theme === 'dark' ? darkReaderTheme : lightReaderTheme}
        getRendition={(_rendition) => {
          updateTheme(_rendition, theme)
          rendition.current = _rendition
        }}
      />
    </Example>
  )
}

const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
}

const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'white',
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: '#ccc',
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: '#000',
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: '#ccc',
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: '#111',
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: '#222',
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: '#fff',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: 'white',
  },
}
