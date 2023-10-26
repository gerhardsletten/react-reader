import { ReactReader } from '../lib/index'
import useLocalStorageState from 'use-local-storage-state'

import { DEMO_URL, DEMO_NAME } from '../components/config'
import { Example } from '../components/Example'

export const Persist = () => {
  const [location, setLocation] = useLocalStorageState<string | number>(
    'persist-location',
    {
      defaultValue: 0,
    }
  )
  return (
    <Example title="Persist example">
      <ReactReader
        url={DEMO_URL}
        title={DEMO_NAME}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
      />
    </Example>
  )
}
