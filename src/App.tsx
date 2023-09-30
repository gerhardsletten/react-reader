import React, { useState, useRef, useEffect } from 'react'
import { ReactReader } from './lib/index'

const DEMO_URL = '/files/alice.epub'
const DEMO_NAME = 'Alice in wonderland'

const App = () => {
  const [largeText, setLargeText] = useState(false)
  const rendition = useRef<any>(null)
  const [location, setLocation] = useState<string | number>(2)
  useEffect(() => {
    rendition.current?.themes.fontSize(largeText ? '140%' : '100%')
  }, [largeText])
  return (
    <div className="relative h-full w-full min-h-screen bg-stone-100 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-4">
        <header className="flex items-center justify-between">
          <a
            href="https://github.com/gerhardsletten/react-reader"
            className="w-[250px]"
          >
            <img
              src="https://react-reader.metabits.no/files/react-reader.svg"
              alt="React-reader - powered by epubjs"
              width="330"
              height="104"
              className="w- w-60 h-auto"
            />
          </a>
          <div>
            <button onClick={() => setLargeText(!largeText)}>
              Toggle font-size
            </button>
          </div>
        </header>
        <main className="">
          <div className="md:aspect-video aspect-[3/4] w-full border border-stone-300 rounded overflow-hidden">
            <ReactReader
              url={DEMO_URL}
              title={DEMO_NAME}
              location={location}
              locationChanged={(loc) => setLocation(loc)}
              getRendition={(_rendition) => {
                rendition.current = _rendition
                rendition.current.themes.fontSize(largeText ? '140%' : '100%')
              }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
