import type { CSSProperties } from 'react'

export interface IEpubViewStyle {
  viewHolder: CSSProperties
  view: CSSProperties
}

export const EpubViewStyle: IEpubViewStyle = {
  viewHolder: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  view: {
    height: '100%',
  },
}
