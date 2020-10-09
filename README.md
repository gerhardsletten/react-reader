# React ePub reader

An ePub-reader for react powered by EpubJS #react #epubjs #webpack #babel #standardjs

[See demo](https://gerhardsletten.github.io/react-reader)

![React Reader logo](https://gerhardsletten.github.io/react-reader/files/react-reader.svg)

## React wrapper for epubjs

React reader is a react-wrapper for [epub.js](https://github.com/futurepress/epub.js), using the v.03 branch.

## About

[epub.js](https://github.com/futurepress/epub.js) is a great library, and this is a wrapper for this library, making it easier to use in a React-app.

```js
import {
  EpubView, // Underlaying epub-canvas (wrapper for epub.js iframe)
  EpubViewStyle, // Styles for EpubView, you can pass it to the instance as a style prop for customize it
  ReactReader, // A simple epub-reader with left/right button and chapter navigation
  ReactReaderStyle // Styles for the epub-reader it you need to customize it
} from "react-reader";
```

## Basic usage

`npm install react-reader --save`

And in your react-component...

```js
import React, { Component } from "react";
import { ReactReader } from "react-reader";

class App extends Component {
  render() {
    return (
      <div style={{ position: "relative", height: "100%" }}>
        {" "}
        // * Container needs a height..
        <ReactReader
          url={"/alice.epub"}
          title={"Alice in wonderland"}
          location={"epubcfi(/6/2[cover]!/6)"}
          locationChanged={epubcifi => console.log(epubcifi)}
        />
      </div>
    );
  }
}
```

[See src/App.js](src/App.js) for an example of using the selection api in epubjs.

#### ReactReader props

- `title` [string] - the title of the book, displayed above the reading-canvas
- `loadingView` [element] - if you want to customize the loadingView
- `showToc` [bool] - whether to show the toc / toc-nav
- `locationChanged` [func] - a function that receives the current location while user is reading
- `tocChanged` [func] - when the reader has parsed the book you will receive an array of the chapters
- `styles` [object] - override the default styles
- `swipeable` [bool, default false] - enable swiping left/right with [react-swipeable](https://github.com/dogfessional/react-swipeable). _Warning_ this will disable interacting with epub.js iframe content like selection

[See also TypeScript definition](types/index.d.ts) for React Reader here (thanks to [@rafaelsaback](#63))

Additional props will be forwarded to the underlying EpubView component, like url, location, epubOptions, epubInitOptions and getRendition. [See its props here](#epubview-props)

_Container needs a height._
The ReactReader will expand to 100% of width/height, so be sure to set a height on the parent element, either with position it absolute of window, set height or use paddingTop for proporcional scaling.

### Optional use the underlying EpubView

This is just the plain epub canvas, you will then need to implement the reader stuff like chapter (toc) navigation and next/prev buttons. Take a look at the implementation in ReactReader.js

```js
import React, { Component } from "react";
import { EpubView } from "react-reader";

class App extends Component {
  render() {
    return (
      /* The ReactReader will expand to 100% of width/height, so be sure to set a height on the parent element, either with position it absolute of window, set height or use paddingTop for proporsjonal scaling */
      <div style={{ position: "relative", height: "100%" }}>
        <EpubView
          url={"/alice.epub"}
          location={"epubcfi(/6/2[cover]!/6)"}
          locationChanged={epubcifi => console.log(epubcifi)}
          tocChanged={toc => console.log(toc)}
        />
      </div>
    );
  }
}
```

#### EpubView props

- `url` [string, required] - url to the epub-file, if its on another domain, remember to add cors for the file. Epubjs fetch this by a http-call, so it need to be public available. 
- `loadingView` [element] - if you want to customize the loadingView
- `location` [string, number] - set / update location of the epub
- `locationChanged` [func] - a function that receives the current location while user is reading
- `tocChanged` [func] - when the reader has parsed the book you will receive an array of the chapters
- `styles` [object] - override the default styles
- `epubInitOptions` [object] - pass custom properties to the epub init function, see [epub.js](http://epubjs.org/documentation/0.3/#epub)
- `epubOptions` [object] - pass custom properties to the epub rendition, see [epub.js's book.renderTo function](http://epubjs.org/documentation/0.3/#bookrenderto)
- `getRendition` [func] - when epubjs has rendered the epub-file you can get access to the epubjs-rendition object here

#### Handling not valid epub-files

A tip if you have problems with not valid epub-files is to override the build in DOMParser and modify the markup-string passed to its parseFromString function. This example fixes a not valid `<title/>` tag in an old epub, which would render as a blank page if not fixed:

```
const DOMParser = window.DOMParser

class OwnParser {
  parseFromString(markup, mime) {
    if (markup.indexOf('<title/>') !== -1) {
      markup = markup.replace('<title/>', '');
    }
    return new DOMParser().parseFromString(markup, mime)
  }
}

window.DOMParser = OwnParser
```

#### Usage in cordova

There is a limitation with iframe and `srcdoc` so you need to add this to your config.xml to make react-reader work within a cordova application:

```
<allow-navigation href="about:*" />
```

See [stackoverflow.com/questions/39165545/cordova-iframe-with-html-inside-not-showing-on-ios-device](https://stackoverflow.com/questions/39165545/cordova-iframe-with-html-inside-not-showing-on-ios-device)
