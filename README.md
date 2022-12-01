# React Reader - an easy way to embed a ePub into your webapp

An ePub-reader for react powered by EpubJS #react #epubjs #webpack #babel #standardjs

[See demo](https://react-reader.metabits.no)

![React Reader logo](https://react-reader.metabits.no/files/react-reader.svg)

## React wrapper for EpubJS

React Reader is a react-wrapper for [epub.js](https://github.com/futurepress/epub.js) using the v.03 branch.

## About

[epub.js](https://github.com/futurepress/epub.js) is a great library and this is a wrapper for it. This wrapper makes it easy to use in a React-app.

This package publish 4 named exports:

- ReactReader - Most used, a basic epub-reader to embed into your webapp
- ReactReaderStyle - styles for above if you need to overwrite them, [see the file](https://github.com/gerhardsletten/react-reader/blob/master/src/modules/ReactReader/style.js)
- EpubView - Underlaying epub-canvas (wrapper for epub.js iframe)
- EpubViewStyle - styles for above if you need to overwrite them, [see the file](https://github.com/gerhardsletten/react-reader/blob/master/src/modules/EpubView/style.js)

Also note that EpubJS is a browser-based epub-reader and it works by rendering the current epub-chapter into an iframe, and then by css-columns it will display the current page. [See limitations below](#limitations)

## Basic usage

`npm install react-reader --save`

-or-

`yarn add react-reader`

And in your react-component...

```js
import React, { useState } from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  // And your own state logic to persist state
  const [location, setLocation] = useState(null)
  const locationChanged = epubcifi => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi)
  }
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url="https://react-reader.metabits.no/files/alice.epub"
      />
    </div>
  )
}

export default App
```

### ReactReader props

- `title` [string] - the title of the book, displayed above the reading-canvas
- `showToc` [bool] - whether to show the toc / toc-nav
- `readerStyles` [object] - override the default styles
- `epubViewStyles` [object] - override the default styles for inner EpubView
- `swipeable` [bool, default false] - enable swiping left/right with [react-swipeable](https://github.com/dogfessional/react-swipeable). _Warning_ this will disable interacting with epub.js iframe content like selection

### ReactReader props passed to inner EpubView

- `url` [string, required] - url to the epub-file, if its on another domain, remember to add cors for the file. Epubjs fetch this by a http-call, so it need to be public available.
- `loadingView` [element] - if you want to customize the loadingView
- `location` [string, number] - set / update location of the epub
- `locationChanged` [func] - a function that receives the current location while user is reading. This function is called everytime the page changes, and also when it first renders.
- `tocChanged` [func] - when the reader has parsed the book you will receive an array of the chapters
- `epubInitOptions` [object] - pass custom properties to the epub init function, see [epub.js](http://epubjs.org/documentation/0.3/#epub)
- `epubOptions` [object] - pass custom properties to the epub rendition, see [epub.js's book.renderTo function](http://epubjs.org/documentation/0.3/#rendition)
- `getRendition` [func] - when epubjs has rendered the epub-file you can get access to the epubjs-rendition object here

### EpubView props

`EpubView` is just the iframe-view from EpubJS if you would like to build the reader yourself, see above for props

## Recipes and tips

### TypeScript support

[See also TypeScript definition](types/index.d.ts) for React Reader here (thanks to [@rafaelsaback](#63))

Can community supply an example of this

### Save and retrieve progress from storage

Saving the current page on storage is pretty simple, but we need to keep in mind that `locationChanged` also gets called on the very
first render of our app.

```js
import React, { useState, useRef } from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  // And your own state logic to persist state
  const [location, setLocation] = useState(null)
  const [firstRenderDone, setFirstRenderDone] = useState(false)
  const renditionRef = useRef(null)
  const locationChanged = epubcifi => {
    // Since this function is also called on initial rendering, we are using custom state
    // logic to check if this is the initial render.
    // If you block this function from running (i.e not letting it change the page on the first render) your app crashes.

    if (!firstRenderDone) {
      setLocation(localStorage.getItem('book-progress')) // getItem returns null if the item is not found.
      setFirstRenderDone(true)
      return
    }

    // This is the code that runs everytime the page changes, after the initial render.
    // Saving the current epubcifi on storage...
    localStorage.setItem('book-progress', epubcifi)
    // And then rendering it.
    setLocation(epubcifi) // Or setLocation(localStorage.getItem("book-progress"))
  }
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url="https://react-reader.metabits.no/files/alice.epub"
        getRendition={rendition => (renditionRef.current = rendition)}
      />
    </div>
  )
}

export default App
```

Why not use `useEffect` for this?  
Because the `locationChanged` function would overwrite the `useEffect` changes,
and if we block it from running on initial rendering the book doesn't render.

### Overwrite styles with react-styles

Import the published styles and extend them, or you can wrap it in a custom container where you can overwrite styles by nested css-styles

```js
import React from 'react'
import { ReactReader, ReactReaderStyle } from 'react-reader'

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'red'
  }
}

const App = () => {
  return (
    <div style={{ height: '100vh' }} className="myReader">
      <ReactReader
        url="https://react-reader.metabits.no/files/alice.epub"
        readerStyles={ownStyles}
      />
    </div>
  )
}
```

### Display page number for current chapter

We store the epubjs rendition in a ref, and get the page numbers in the callback when location is changed. Note that in this example we also find them name of the current chapter from the toc. Also see limitation for pagination for the whole book.

```js
import React, { useRef, useState } from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  const [page, setPage] = useState('')
  const renditionRef = useRef(null)
  const tocRef = useRef(null)
  const locationChanged = epubcifi => {
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      const chapter = tocRef.current.find(item => item.href === href)
      setPage(
        `Page ${displayed.page} of ${displayed.total} in chapter ${
          chapter ? chapter.label : 'n/a'
        }`
      )
    }
  }
  return (
    <>
      <div style={{ height: '100vh' }}>
        <ReactReader
          locationChanged={locationChanged}
          url="https://react-reader.metabits.no/files/alice.epub"
          getRendition={rendition => (renditionRef.current = rendition)}
          tocChanged={toc => (tocRef.current = toc)}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          left: '1rem',
          textAlign: 'center',
          zIndex: 1
        }}
      >
        {page}
      </div>
    </>
  )
}
```

### Change font-size

Hooking into epubJS rendition object is the key for this also.

```js
import React, { useRef, useState, useEffect } from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  const [size, setSize] = useState(100)
  const renditionRef = useRef(null)
  const changeSize = newSize => {
    setSize(newSize)
  }
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${size}%`)
    }
  }, [size])
  return (
    <>
      <div style={{ height: '100vh' }}>
        <ReactReader
          url="https://react-reader.metabits.no/files/alice.epub"
          getRendition={rendition => {
            renditionRef.current = rendition
            renditionRef.current.themes.fontSize(`${size}%`)
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          left: '1rem',
          textAlign: 'center',
          zIndex: 1
        }}
      >
        <button onClick={() => changeSize(Math.max(80, size - 10))}>-</button>
        <span>Current size: {size}%</span>
        <button onClick={() => changeSize(Math.min(130, size + 10))}>+</button>
      </div>
    </>
  )
}
```

### Add / adjust custom css for the epub-html

EpubJS render the epub-file inside a iframe so you will need to create a custom theme and apply it.  
This is useful for when you want to set custom font families, custom background and text colors, and everything CSS related.

```js
import React from "react"
import { ReactReader } from "react-reader"

const App = () => {
  return (
    <div style={{ height: "100vh" }}>
      <ReactReader
        url="https://react-reader.metabits.no/files/alice.epub"
        getRendition={(rendition) => {
          rendition.themes.register('custom', {
            "*": {
              color: #FFFFFF,
              backgroundColor: "#252525",
            },

            img: {
              border: '1px solid red'
            },
            p: {
              'font-family': 'Helvetica, sans-serif',
              'font-weight': '400',
              'font-size': '20px',
              border: '1px solid green'
            }
          })
          rendition.themes.select('custom')
        }}
      />
    </div>
  )
}
```

### Hightlight selection in epub

This shows how to hook into epubJS annotations object and let the user highlight selection and store this in a list where user can go to a selection or delete it.

```js
import React, { useRef, useState, useEffect } from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  const [selections, setSelections] = useState([])
  const renditionRef = useRef(null)
  useEffect(() => {
    if (renditionRef.current) {
      function setRenderSelection(cfiRange, contents) {
        setSelections(
          selections.concat({
            text: renditionRef.current.getRange(cfiRange).toString(),
            cfiRange
          })
        )
        renditionRef.current.annotations.add(
          'highlight',
          cfiRange,
          {},
          null,
          'hl',
          { fill: 'red', 'fill-opacity': '0.5', 'mix-blend-mode': 'multiply' }
        )
        contents.window.getSelection().removeAllRanges()
      }
      renditionRef.current.on('selected', setRenderSelection)
      return () => {
        renditionRef.current.off('selected', setRenderSelection)
      }
    }
  }, [setSelections, selections])
  return (
    <>
      <div style={{ height: '100vh' }}>
        <ReactReader
          url="https://react-reader.metabits.no/files/alice.epub"
          getRendition={rendition => {
            renditionRef.current = rendition
            renditionRef.current.themes.default({
              '::selection': {
                background: 'orange'
              }
            })
            setSelections([])
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          zIndex: 1,
          backgroundColor: 'white'
        }}
      >
        Selection:
        <ul>
          {selections.map(({ text, cfiRange }, i) => (
            <li key={i}>
              {text}{' '}
              <button
                onClick={() => {
                  renditionRef.current.display(cfiRange)
                }}
              >
                Show
              </button>
              <button
                onClick={() => {
                  renditionRef.current.annotations.remove(cfiRange, 'highlight')
                  setSelections(selections.filter((item, j) => j !== i))
                }}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
```

### Handling missing mime-types on server

EpubJS will try to parse the epub-file you pass to it, but if the server send wrong mine-types or the file does not contain `.epub` you can use the epubInitOptions prop to force reading it right.

```js
import React from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url="/my-epub-service"
        epubInitOptions={{
          openAs: 'epub'
        }}
      />
    </div>
  )
}
```

### Display a scrolled epub-view

Pass options for this into epubJS in the prop `epubOptions`

```js
import React from 'react'
import { ReactReader } from 'react-reader'

const App = () => {
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url="https://react-reader.metabits.no/files/alice.epub"
        epubOptions={{
          flow: 'scrolled',
          manager: 'continuous'
        }}
      />
    </div>
  )
}
```

Quick reference for manager and flow options:

```ts
enum ManagerOptions {
  default = 'default', // Default setting, use when flow is set to auto/paginated.
  continuous = 'continuous' // Renders stuff offscreen, use when flow is set to "scrolled".
}

enum FlowOptions {
  default = 'auto', // Based on OPF settings, defaults to "paginated"
  paginated = 'paginated', // Left to right, paginated rendering. Better paired with the default manager.
  scrolled = 'scrolled' // Scrolled viewing, works best with "continuous" manager.
}
```

Things will look weird if you use the wrong manager/flow combination.

## Limitations

EpubJS is a browser-based epub-reader and it works by rendering the current epub-chapter into an iframe, and then by css-columns it will display the current page.

- EpubJS will need to render the current chapter before it will now how many pages it will have in the current viewport. Because of this it will not be able to tell you at which page in the whole epub-book you are at, nor will you be able to get the total pages for the whole book
- Performance for a web-based epub-reader will not be the same as native readers.
- EpubJS support `epub 2` standard, but most `epub 3` features should work since its based on regular html-tags, but there can be more issues with those [See Epub on Wikipedia](https://en.wikipedia.org/wiki/EPUB)

Also be aware that the epub-standard is basically a zip of html-files, and there is a range in quality. Most publishers create pretty ok epubs, but in some older books there could be errors that will make rendering fails.

### Handling not valid epub-files

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

### Enable opening links / running scripts inside epubjs iframe

Epubjs is rendering the epub-content inside and iframe which defaults to `sandbox="allow-same-origin"`, to enable opening links or running javascript in an epub, you will need to pass some extra params in the `epubOptions` prop.

```
<ReactReader
  url={localFile}
  epubOptions={{
    allowPopups: true, // Adds `allow-popups` to sandbox-attribute
    allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
  }}
/>
```
