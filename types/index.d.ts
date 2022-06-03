import * as React from "react";
import * as CSS from "csstype";
import { BookOptions } from "epubjs/types/book";
import { RenditionOptions } from "epubjs/types/rendition";
import { Contents, Rendition } from "epubjs";

interface EpubViewProps {
  url: string | ArrayBuffer;
  epubInitOptions?: BookOptions;
  epubOptions?: RenditionOptions;
  styles?: EpubViewStyle;
  loadingView?: React.ReactNode;
  location?: string | number;
  showToc?: boolean;
  locationChanged?(value: string | number): void;
  tocChanged?(value: Toc): void;
  getRendition?(rendition: Rendition): void;
  handleKeyPress?(): void;
  handleTextSelected?(cfiRange: string, contents: Contents): void;
}

declare class EpubView extends React.Component<EpubViewProps> {}

interface EpubViewStyle {
  viewHolder: CSS.Properties;
  view: CSS.Properties;
}

interface Toc {
  label: string;
  href: string;
}

interface ReactReaderProps extends Omit<EpubViewProps, "styles"> {
  title?: string;
  showToc?: boolean;
  styles?: ReactReaderStyle;
  swipeable?: boolean;
}

declare class ReactReader extends React.Component<ReactReaderProps> {}

interface ReactReaderStyle {
  container: CSS.Properties;
  readerArea: CSS.Properties;
  containerExpanded: CSS.Properties;
  titleArea: CSS.Properties;
  reader: CSS.Properties;
  swipeWrapper: CSS.Properties;
  prev: CSS.Properties;
  next: CSS.Properties;
  arrow: CSS.Properties;
  arrowHover: CSS.Properties;
  tocBackground: CSS.Properties;
  tocArea: CSS.Properties;
  tocAreaButton: CSS.Properties;
  tocButton: CSS.Properties;
  tocButtonExpanded: CSS.Properties;
  tocButtonBar: CSS.Properties;
  tocButtonBarTop: CSS.Properties;
  tocButtonBarBottom: CSS.Properties;
  loadingView: CSS.Properties;
}

export { ReactReader, ReactReaderStyle, EpubView, EpubViewStyle };
