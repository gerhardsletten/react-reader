import React, { useState, useRef } from "react";
import { createGlobalStyle } from "styled-components";
import Reader from "./modules/ReactReader/Reader";
import { ReaderContainer } from "./Components";
import { Rendition } from "epubjs";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
`;

const readerThemes = {
  light: {
    body: {
      "-webkit-user-select": "none",
      "user-select": "none",
      "background-color": "white",
      color: "grey",
    },
  },
  tinted: {
    body: {
      "-webkit-user-select": "none",
      "user-select": "none",
      "background-color": "yellow",
      color: "blue",
    },
  },
  dark: {
    body: {
      "-webkit-user-select": "none",
      "user-select": "none",
      "background-color": "black",
      color: "white",
    },
  },
};

const DEMO_URL = "/web-reader/files/alice.epub";
const DEMO_NAME = "Alice in wonderland";

const App = () => {
  const [location, setLocation] = useState<string | number>(2);
  const rendition = useRef<Rendition>();

  const handleOnLocationChanged = (location: string | number) => {
    setLocation(location);
  };

  const getRendition = (newRendition: Rendition) => {
    rendition.current = newRendition;
    rendition.current.themes.registerThemes(readerThemes);
  };

  const handleOnFontSizeChange = (fontSize: string) => {
    const updatedSize =
      fontSize === "small" ? "50%" : fontSize === "medium" ? "100%" : "150%";
    rendition.current?.themes.fontSize(updatedSize);
  };

  const handleOnNextPressed = () => {
    rendition.current?.next();
  };

  const handleOnPreviousPressed = () => {
    rendition.current?.prev();
  };

  return (
    <div>
      <GlobalStyle />
      <ReaderContainer>
        <Reader
          url={
            "https://s3.amazonaws.com/epubjs/books/moby-dick/OPS/package.opf"
          }
          title={DEMO_NAME}
          location={location}
          onLocationChanged={handleOnLocationChanged}
          getRendition={getRendition}
          onFontSizeOptionSelected={handleOnFontSizeChange}
          onNextPressed={handleOnNextPressed}
          onPreviousPressed={handleOnPreviousPressed}
        />
      </ReaderContainer>
    </div>
  );
};

export default App;
