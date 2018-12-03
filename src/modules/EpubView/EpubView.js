import React, { Component } from "react";
import PropTypes from "prop-types";
import Epub from "epubjs/lib/index";
import defaultStyles from "./style";

global.ePub = Epub; // Fix for v3 branch of epub.js -> needs ePub to by a global var

class EpubView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      toc: []
    };
    this.viewerRef = React.createRef();
    this.location = props.location;
    this.book = this.rendition = this.prevPage = this.nextPage = null;
  }

  componentDidMount() {
    const { url, tocChanged } = this.props;
    // use empty options to avoid ArrayBuffer urls being treated as options in epub.js
    const epubOptions = {};
    this.book = new Epub(url, epubOptions);
    this.book.loaded.navigation.then(({ toc }) => {
      this.setState(
        {
          isLoaded: true,
          toc: toc
        },
        () => {
          tocChanged && tocChanged(toc);
          this.initReader();
        }
      );
    });
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount() {
    this.book = this.rendition = this.prevPage = this.nextPage = null;
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  shouldComponentUpdate(nextProps) {
    return !this.state.isLoaded || nextProps.location !== this.props.location;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.location !== this.props.location &&
      this.location !== this.props.location
    ) {
      this.rendition.display(this.props.location);
    }
  }

  initReader() {
    const { toc } = this.state;
    const { location, epubOptions, getRendition } = this.props;
    const node = this.viewerRef.current;
    this.rendition = this.book.renderTo(node, {
      contained: true,
      width: "100%",
      height: "100%",
      ...epubOptions
    });
    this.rendition.display(
      typeof location === "string" || typeof location === "number"
        ? location
        : toc[0].href
    );

    this.prevPage = () => {
      this.rendition.prev();
    };
    this.nextPage = () => {
      this.rendition.next();
    };
    this.rendition.on("locationChanged", this.onLocationChange);
    getRendition && getRendition(this.rendition);
  }

  onLocationChange = loc => {
    const { location, locationChanged } = this.props;
    const newLocation = loc && loc.start;
    if (location !== newLocation) {
      this.location = newLocation;
      locationChanged && locationChanged(newLocation);
    }
  };

  renderBook() {
    const { styles } = this.props;
    return <div ref={this.viewerRef} style={styles.view} />;
  }

  handleKeyPress = ({ key }) => {
    key && key === "ArrowRight" && this.nextPage();
    key && key === "ArrowLeft" && this.prevPage();
  };

  render() {
    const { isLoaded } = this.state;
    const { loadingView, styles } = this.props;
    return (
      <div style={styles.viewHolder}>
        {(isLoaded && this.renderBook()) || loadingView}
      </div>
    );
  }
}

EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null,
  styles: defaultStyles,
  epubOptions: {}
};

EpubView.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(ArrayBuffer)
  ]),
  loadingView: PropTypes.element,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubOptions: PropTypes.object,
  getRendition: PropTypes.func
};

export default EpubView;
