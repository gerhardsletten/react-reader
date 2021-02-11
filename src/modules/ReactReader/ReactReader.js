import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";
import { EpubView } from "..";
import defaultStyles from "./style";
import TestEpub from "../../newModules/EpubView.tsx";

const Swipeable = ({ children, ...props }) => {
  const handlers = useSwipeable(props);
  return <div {...handlers}>{children}</div>;
};

class TocItem extends PureComponent {
  setLocation = () => {
    this.props.setLocation(this.props.href);
  };
  render() {
    const { label, styles } = this.props;
    return (
      <button onClick={this.setLocation} style={styles}>
        {label}
      </button>
    );
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object,
};

class ReactReader extends PureComponent {
  constructor(props) {
    super(props);
    this.readerRef = React.createRef();
    this.state = {
      expandedToc: false,
      toc: false,
      expandedOptions: false,
      selectedFontSize: "medium",
      selectedTheme: "default",
      selectedFlow: "page",
    };
  }
  toggleToc = () => {
    this.setState({
      expandedToc: !this.state.expandedToc,
    });
  };

  toggleOptions = () => {
    this.setState({
      expandedOptions: !this.state.expandedOptions,
    });
  };

  next = () => {
    this.props.onNextPressed();
  };

  prev = () => {
    this.props.onPreviousPressed();
  };

  onTocChange = (toc) => {
    const { tocChanged } = this.props;
    this.setState(
      {
        toc: toc,
      },
      () => tocChanged && tocChanged(toc)
    );
  };

  onThemeOptionSelected = (theme) => {
    this.setState({ selectedTheme: theme });
  };

  onFontSizeOptionSelected = (fontSize) => {
    const { onFontSizeOptionSelected } = this.props;
    this.setState({ selectedFontSize: fontSize });
    onFontSizeOptionSelected(fontSize);
  };

  onFlowOptionSelected = (flow) => {
    this.setState({ selectedFlow: flow });
  };

  renderToc() {
    const { toc, expandedToc } = this.state;
    const { styles } = this.props;
    return (
      <div>
        <div style={styles.tocArea}>
          <div style={styles.toc}>
            {toc.map((item, i) => (
              <TocItem
                {...item}
                key={i}
                setLocation={this.setLocation}
                styles={styles.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {expandedToc && (
          <div style={styles.tocBackground} onClick={this.toggleToc} />
        )}
      </div>
    );
  }

  renderOptions() {
    const { expandedOptions } = this.state;
    const { styles } = this.props;
    return (
      <div>
        <div style={styles.optionsArea}>
          <div style={styles.options}>
            <div>Select Theme</div>
            <div style={styles.optionButtonContainer}>
              <button
                style={
                  this.state.selectedTheme === "default"
                    ? {
                        ...styles.optionButton,
                        ...styles.optionsButtonSelected,
                      }
                    : styles.optionButton
                }
                onClick={() => this.onThemeOptionSelected("default")}
              >
                <div>Default</div>
              </button>
              <button
                style={
                  this.state.selectedTheme === "dark"
                    ? {
                        ...styles.optionButton,
                        ...styles.optionsButtonSelected,
                      }
                    : styles.optionButton
                }
                onClick={() => this.onThemeOptionSelected("dark")}
              >
                <div>Dark</div>
              </button>
              <button
                style={
                  this.state.selectedTheme === "tinted"
                    ? {
                        ...styles.optionButton,
                        ...styles.optionsButtonSelected,
                      }
                    : styles.optionButton
                }
                onClick={() => this.onThemeOptionSelected("tinted")}
              >
                <div>Tinted</div>
              </button>
            </div>
            <div style={styles.optionContainer}>
              <div>Select Font</div>
              <div style={styles.optionButtonContainer}>
                <button
                  style={
                    this.state.selectedFontSize === "small"
                      ? {
                          ...styles.optionButton,
                          ...styles.optionsButtonSelected,
                        }
                      : styles.optionButton
                  }
                  onClick={() => this.onFontSizeOptionSelected("small")}
                >
                  <div>SM</div>
                </button>
                <button
                  style={
                    this.state.selectedFontSize === "medium"
                      ? {
                          ...styles.optionButton,
                          ...styles.optionsButtonSelected,
                        }
                      : styles.optionButton
                  }
                  onClick={() => this.onFontSizeOptionSelected("medium")}
                >
                  <div>MD</div>
                </button>
                <button
                  style={
                    this.state.selectedFontSize === "large"
                      ? {
                          ...styles.optionButton,
                          ...styles.optionsButtonSelected,
                        }
                      : styles.optionButton
                  }
                  onClick={() => this.onFontSizeOptionSelected("large")}
                >
                  <div>LG</div>
                </button>
              </div>
              <div style={styles.optionContainer}>
                <div>Select Flow</div>
                <div style={styles.optionButtonContainer}>
                  <button
                    style={
                      this.state.selectedFlow === "page"
                        ? {
                            ...styles.optionButton,
                            ...styles.optionsButtonSelected,
                          }
                        : styles.optionButton
                    }
                    onClick={() => this.onFlowOptionSelected("page")}
                  >
                    <div>Page</div>
                  </button>
                  <button
                    style={
                      this.state.selectedFlow === "scroll"
                        ? {
                            ...styles.optionButton,
                            ...styles.optionsButtonSelected,
                          }
                        : styles.optionButton
                    }
                    onClick={() => this.onFlowOptionSelected("scroll")}
                  >
                    <div>Scroll</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {expandedOptions && (
          <div style={styles.optionsBackground} onClick={this.toggleoptions} />
        )}
      </div>
    );
  }

  setLocation = (loc) => {
    const { onLocationChanged } = this.props;
    this.setState(
      {
        expandedToc: false,
      },
      () => onLocationChanged && onLocationChanged(loc)
    );
  };

  renderTocToggle() {
    const { expandedToc } = this.state;
    const { styles } = this.props;
    return (
      <button
        style={Object.assign(
          {},
          styles.tocButton,
          expandedToc ? styles.tocButtonExpanded : {}
        )}
        onClick={this.toggleToc}
      >
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)}
        />
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)}
        />
      </button>
    );
  }

  renderOptionsToggle() {
    const { expandedOptions } = this.state;
    const { styles } = this.props;
    return (
      <button
        style={Object.assign(
          {},
          styles.optionsButton,
          expandedOptions ? styles.optionsButtonExpanded : {}
        )}
        onClick={this.toggleOptions}
      >
        <span
          style={Object.assign(
            {},
            styles.optionsButtonBar,
            styles.optionsButtonBarTop
          )}
        />
        <span
          style={Object.assign(
            {},
            styles.optionsButtonBar,
            styles.optionsButtonBottom
          )}
        />
      </button>
    );
  }

  render() {
    const {
      title,
      showToc,
      loadingView,
      styles,
      locationChanged,
      swipeable,
      epubViewStyles,
      ...props
    } = this.props;
    const { toc, expandedToc, expandedOptions } = this.state;
    return (
      <div style={styles.container}>
        <div
          style={Object.assign(
            {},
            styles.readerArea,
            expandedToc
              ? styles.containerExpanded
              : expandedOptions
              ? styles.optionsExpanded
              : {}
          )}
        >
          {showToc && this.renderTocToggle()}
          {this.renderOptionsToggle()}
          <div style={styles.titleArea}>{title}</div>
          <Swipeable
            onSwipedRight={this.prev}
            onSwipedLeft={this.next}
            trackMouse
          >
            <div style={styles.reader}>
              <TestEpub
                {...props}
                ref={this.readerRef}
                loadingView={loadingView}
                styles={epubViewStyles}
                onTocChanged={this.onTocChange}
                onLocationChanged={locationChanged}
                flow={this.state.selectedFlow}
                theme={this.state.selectedTheme}
              />
              {swipeable && <div style={styles.swipeWrapper} />}
            </div>
          </Swipeable>
          {this.state.selectedFlow === "page" && (
            <div>
              <button
                style={Object.assign({}, styles.arrow, styles.prev)}
                onClick={this.prev}
              >
                ‹
              </button>
              <button
                style={Object.assign({}, styles.arrow, styles.next)}
                onClick={this.next}
              >
                ›
              </button>
            </div>
          )}
        </div>
        {showToc && toc && this.renderToc()}
        {this.renderOptions()}
      </div>
    );
  }
}

ReactReader.defaultProps = {
  loadingView: <div style={defaultStyles.loadingView}>Loading…</div>,
  onLocationChanged: null,
  onTocChanged: null,
  showToc: true,
  styles: defaultStyles,
};

ReactReader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  showToc: PropTypes.bool,
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubViewStyles: PropTypes.object,
  swipeable: PropTypes.bool,
  onNextPressed: PropTypes.func,
};

export default ReactReader;
