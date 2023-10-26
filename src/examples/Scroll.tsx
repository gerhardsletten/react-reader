import { useState } from 'react'
import { ReactReader } from '../lib/index'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const Scroll = () => {
  const [location, setLocation] = useState<string | number>(0)
  return (
    <Example title="Scroll example">
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        epubOptions={{
          flow: 'scrolled',
          manager: 'continuous',
        }}
      />
    </Example>
  )
}
