// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as CSS from "csstype";
import Epub from "epubjs/lib/index";
import { BookOptions } from "epubjs/types/book";
import { RenditionOptions } from "epubjs/types/rendition";
import { Contents, Rendition, Book, NavItem, Location } from "epubjs";
import defaultStyles from "./style";

global.ePub = Epub; // Fix for v3 branch of epub.js -> needs ePub to by a global var

interface EpubViewStyles {
  viewHolder: CSS.Properties;
  view: CSS.Properties;
}

interface EpubViewProps {
  url: string | ArrayBuffer;
  epubInitOptions?: BookOptions;
  epubOptions?: RenditionOptions;
  styles?: EpubViewStyles;
  loadingView?: React.ReactNode;
  location?: string | number | Location;
  showToc?: boolean;
  flow: string;
  theme: string;
  onLocationChanged?(value: string | number): void;
  onTocChanged?(value: NavItem[]): void;
  getRendition?(rendition: Rendition): void;
  onKeyPress?(keyObject: any): void;
  handleTextSelected?(cfiRange: string, contents: Contents): void;
}

const EpubView = (props: EpubViewProps) => {
  const {
    url,
    onTocChanged,
    epubInitOptions,
    location,
    epubOptions,
    getRendition,
    flow,
    theme,
    styles = defaultStyles,
  } = props;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [tableOfContents, setTableOfContents] = useState<NavItem[]>([]);
  const viewerRef = useRef();
  const book = useRef<Book>();
  const rendition = useRef<Rendition>();

  useEffect(() => {
    initBook();
  }, []);

  useEffect(() => {
    initBook();
  }, [flow, url, theme]);

  useEffect(() => {
    rendition.current?.display(location);
  }, [location]);

  const initBook = () => {
    let currentBook = book.current;
    if (currentBook) {
      currentBook.destroy();
    }
    book.current = new Epub(url, epubInitOptions);
    book.current.loaded.navigation.then(({ toc }) => {
      setIsLoaded(true);
      setTableOfContents(toc);
      onTocChanged(toc);
      initReader();
    });
  };

  const initReader = () => {
    const node = viewerRef.current;
    const newRendition =
      flow === "scroll"
        ? book.current.renderTo(node, {
            manager: "continuous",
            flow: "scrolled",
            width: "100%",
            height: "100%",
            ...epubOptions,
          })
        : book.current.renderTo(node, {
            width: "100%",
            height: "100%",
            ...epubOptions,
          });

    newRendition.themes.select(theme);
    getRendition(newRendition);

    rendition.current = newRendition;

    if (typeof location === "string" || typeof location === "number") {
      rendition.current.display(location);
    } else if (tableOfContents.length > 0 && tableOfContents[0].href) {
      rendition.current.display(tableOfContents[0].href);
    } else {
      rendition.current.display();
    }
  };

  const renderBook = () => {
    return <div ref={viewerRef} style={styles.view} />;
  };

  return (
    <div style={styles.viewHolder}>
      {(isLoaded && renderBook()) || (
        <div style={defaultStyles.loadingView}>Loading…</div>
      )}
    </div>
  );
};

export default EpubView;
