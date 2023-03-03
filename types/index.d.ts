import * as React from 'react'
import * as CSS from 'csstype'
import { BookOptions } from 'epubjs/types/book'
import { RenditionOptions } from 'epubjs/types/rendition'
import { Contents, Rendition } from 'epubjs'

export interface RenditionOptionsFix extends RenditionOptions {
  allowPopups: boolean
}

export interface IEpubViewProps {
  url: string | ArrayBuffer
  epubInitOptions?: BookOptions
  epubOptions?: RenditionOptionsFix
  epubViewStyles?: IEpubViewStyle
  loadingView?: React.ReactNode
  location?: string | number
  showToc?: boolean
  locationChanged?(value: string | number): void
  tocChanged?(value: IToc): void
  getRendition?(rendition: Rendition): void
  handleKeyPress?(): void
  handleTextSelected?(cfiRange: string, contents: Contents): void
}

export declare class EpubView extends React.Component<IEpubViewProps> {}

export interface IEpubViewStyle {
  viewHolder: CSS.Properties
  view: CSS.Properties
}

export declare const EpubViewStyle: IEpubViewStyle

export interface IToc {
  label: string
  href: string
}

export interface IReactReaderProps extends IEpubViewProps {
  title?: string
  showToc?: boolean
  readerStyles?: IReactReaderStyle
  epubViewStyles?: IEpubViewStyle
  swipeable?: boolean
}

export declare class ReactReader extends React.Component<IReactReaderProps> {}

export interface IReactReaderStyle {
  container: CSS.Properties
  readerArea: CSS.Properties
  containerExpanded: CSS.Properties
  titleArea: CSS.Properties
  reader: CSS.Properties
  swipeWrapper: CSS.Properties
  prev: CSS.Properties
  next: CSS.Properties
  arrow: CSS.Properties
  arrowHover: CSS.Properties
  tocBackground: CSS.Properties
  tocArea: CSS.Properties
  tocAreaButton: CSS.Properties
  tocButton: CSS.Properties
  tocButtonExpanded: CSS.Properties
  tocButtonBar: CSS.Properties
  tocButtonBarTop: CSS.Properties
  tocButtonBarBottom: CSS.Properties
  loadingView: CSS.Properties
}

export declare const ReactReaderStyle: IReactReaderStyle
