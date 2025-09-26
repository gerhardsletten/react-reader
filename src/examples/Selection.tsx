import { useState, useRef, useEffect, useCallback } from 'react'
import { ReactReader } from '../../lib/index'
import type { Contents, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

type ITextSelection = {
  text: string
  cfiRange: string
}

/* 
 This example are trying out dynamic change color of epubjs hightlight, but its not working..
*/

export const Selection = () => {
  const [selections, setSelections] = useState<ITextSelection[]>([])
  const [rendition, setRendition] = useState<Rendition | undefined>(undefined)
  const [location, setLocation] = useState<string | number>(0)
  const [color, setColor] = useState('red')
  useEffect(() => {
    console.log('effect', color)
    if (rendition) {
      /*
      rendition.annotations.each().forEach((annotation) => {
        annotation.style = { fill: color }
      })*/
      console.log('set color', rendition)
    }
  }, [rendition, color])
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
            (e: MouseEvent) => console.log('click on selection', cfiRange, e),
            'my-class',
            { fill: color }
          )
          console.log('rendition', { rendition, contents })
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
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {['red', 'pink'].map((item) => (
              <button
                key={item}
                onClick={() => setColor(item)}
                className="flex items-center size-10 rounded-full bg-(--color) border-2 border-transparent aria-[current]:border-black"
                aria-current={item === color ? 'true' : undefined}
                aria-label={`Change color to ${item}`}
                style={{ '--color': item } as React.CSSProperties}
              ></button>
            ))}
          </div>
        </div>
      }
    >
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        epubOptions={{
          allowPopups: true, // Adds `allow-popups` to sandbox-attribute
          allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
        }}
        getRendition={(_rendition: Rendition) => {
          setRendition(_rendition)
          _rendition.hooks.content.register((contents: Contents) => {
            const document = contents.window.document
            console.log('document', document)
            if (document) {
              const css = `
                        .epubjs-hl {
                          border: 1px solid black;
                        }
                        `
              const style = document.createElement('style')
              style.appendChild(document.createTextNode(css))
              document.head.appendChild(style)
            }
          })
        }}
      />
    </Example>
  )
}
