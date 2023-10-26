import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

type ITextSelection = {
  text: string
  cfiRange: string
}

export const Selection = () => {
  const [selections, setSelections] = useState<ITextSelection[]>([])
  const [rendition, setRendition] = useState<Rendition | undefined>(undefined)
  const [location, setLocation] = useState<string | number>(0)
  useEffect(() => {
    if (rendition) {
      function setRenderSelection(cfiRange: string, contents: Contents) {
        if (rendition) {
          setSelections((list) =>
            list.concat({
              text: rendition.getRange(cfiRange).toString(),
              cfiRange,
            })
          )
          rendition.annotations.add(
            'highlight',
            cfiRange,
            {},
            undefined,
            'hl',
            { fill: 'red', 'fill-opacity': '0.5', 'mix-blend-mode': 'multiply' }
          )
          const selection = contents.window.getSelection()
          selection?.removeAllRanges()
        }
      }
      rendition.on('selected', setRenderSelection)
      return () => {
        rendition?.off('selected', setRenderSelection)
      }
    }
  }, [setSelections, rendition])
  return (
    <Example
      title="Selection example"
      above={
        <div className="border border-stone-400 bg-white min-h-[100px] p-2 rounded">
          <h2 className="font-bold mb-1">Selections</h2>
          <ul className="grid grid-cols-1 divide-y divide-stone-400 border-t border-stone-400 -mx-2">
            {selections.map(({ text, cfiRange }, i) => (
              <li key={i} className="p-2">
                <span>{text}</span>
                <button
                  className="underline hover:no-underline text-sm mx-1"
                  onClick={() => {
                    rendition?.display(cfiRange)
                  }}
                >
                  Show
                </button>

                <button
                  className="underline hover:no-underline text-sm mx-1"
                  onClick={() => {
                    rendition?.annotations.remove(cfiRange, 'highlight')
                    setSelections(selections.filter((item, j) => j !== i))
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        getRendition={(_rendition: Rendition) => {
          setRendition(_rendition)
        }}
      />
    </Example>
  )
}
