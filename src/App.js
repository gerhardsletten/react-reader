import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
import { ReactReader } from "./modules";
import Reader from "./newModules/Reader";
import {
  Container,
  ReaderContainer,
  Bar,
  LogoWrapper,
  Logo,
  GenericButton,
  CloseIcon,
  FontSizeButton,
  ButtonWrapper,
} from "./Components";

const DEMO_URL = "/react-reader/files/alice.epub";
const DEMO_NAME = "Alice in wonderland";

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      location: 2,
      localFile: null,
      localName: null,
      largeText: false,
    };
    this.rendition = null;
  }

  toggleFullscreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen,
      },
      () => {
        setTimeout(() => {
          const evt = document.createEvent("UIEvents");
          evt.initUIEvent("resize", true, false, global, 0);
        }, 1000);
      }
    );
  };

  handleOnLocationChanged = (location) => {
    this.setState(
      {
        location,
      },
      () => {
        console.log("epub-location", location);
      }
    );
  };

  onDarkThemePressed = () => {
    this.rendition.themes.select("dark");
  };

  onTintedThemePressed = () => {
    this.rendition.themes.select("tinted");
  };

  onDefaulThemePressed = () => {
    this.rendition.themes.select("light");
  };

  onToggleFontSize = () => {
    const nextState = !this.state.largeText;
    this.setState(
      {
        largeText: nextState,
      },
      () => {
        this.rendition.themes.fontSize(nextState ? "140%" : "100%");
      }
    );
  };

  getSelections = () =>
    this.rendition
      .getContents()
      .map((contents) => contents.window.getSelection());

  onSelection = (cfiRange, contents) => {
    if (this.state.highlights.includes(cfiRange)) {
      this.rendition.annotations.remove(cfiRange, "highlight");
      const storedHighlights = this.state.highlights;
      const updatedHighlights = storedHighlights.filter(
        (highlight) => highlight !== cfiRange
      );
      this.setState({ highlights: updatedHighlights });
    } else {
      this.rendition.annotations.highlight(cfiRange, {}, (e) => {
        console.log("highlight clicked", e.target);
      });
      contents.window.getSelection().removeAllRanges();
      this.setState({ highlights: [...this.state.highlights, cfiRange] });
    }

    this.rendition.themes.default({
      "::selection": {
        background: "rgba(255,255,0, 0.3)",
      },
      ".epubjs-hl": {
        fill: "yellow",
        "fill-opacity": "0.3",
        "mix-blend-mode": "multiply",
      },
    });
  };

  getRendition = (rendition) => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "200%" : "100%");
    rendition.themes.registerThemes(readerThemes);
    rendition.on("selected", this.onSelection);
  };
  handleChangeFile = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type");
      }
      this.setState({
        localFile: e.target.result,
        localName: file.name,
        location: null,
      });
    }
  };

  handleOnFontSizeChange = (fontSize) => {
    const updatedSize =
      fontSize === "small" ? "50%" : fontSize === "medium" ? "100%" : "150%";
    this.rendition.themes.fontSize(updatedSize);
  };

  handleOnNextPressed = () => {
    this.rendition.next();
  };

  handleOnPreviousPressed = () => {
    this.rendition.prev();
  };

  render() {
    const { fullscreen, location, localFile, localName } = this.state;
    return (
      <div>
        <GlobalStyle />
        <ReaderContainer fullscreen={fullscreen}>
          <Reader
            url={localFile || DEMO_URL}
            title={localName || DEMO_NAME}
            location={location}
            onLocationChanged={this.handleOnLocationChanged}
            getRendition={this.getRendition}
            onFontSizeOptionSelected={this.handleOnFontSizeChange}
            onNextPressed={this.handleOnNextPressed}
            onPreviousPressed={this.handleOnPreviousPressed}
          />
        </ReaderContainer>
      </div>
    );
  }
}

export default App;
