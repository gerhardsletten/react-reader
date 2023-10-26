import { useState, useRef, useEffect } from 'react'
import { ReactReader } from '../lib/index'
import type { NavItem, Rendition } from 'epubjs'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const Paging = () => {
  const [page, setPage] = useState('')
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const [location, setLocation] = useState<string | number>(0)
  return (
    <Example title="Paging example" actions={<div>{page}</div>}>
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        tocChanged={(_toc) => (toc.current = _toc)}
        locationChanged={(loc: string) => {
          setLocation(loc)
          if (rendition.current && toc.current) {
            const { displayed, href } = rendition.current.location.start
            const chapter = toc.current.find((item) => item.href === href)
            setPage(
              `Page ${displayed.page} of ${displayed.total} in chapter ${
                chapter ? chapter.label : 'n/a'
              }`
            )
          }
        }}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition
        }}
      />
    </Example>
  )
}
