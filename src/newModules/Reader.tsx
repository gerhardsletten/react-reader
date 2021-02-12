// @ts-nocheck
import React, { useState } from "react";
import * as CSS from "csstype";
import { useSwipeable } from "react-swipeable";
import defaultStyles from "../modules/ReactReader/style";
import TestEpub from "./EpubView";
import { NavItem } from "epubjs";

const Swipeable = ({ children, ...props }) => {
  const handlers = useSwipeable(props);
  return <div {...handlers}>{children}</div>;
};

interface EpubViewStyles {
  viewHolder: CSS.Properties;
  view: CSS.Properties;
}

interface ReaderProps {
  url: string;
  title: string;
  loadingView: React.ReactNode;
  showToc: boolean;
  onLocationChanged?(value: string | number): void;
  onTocChanged?(value: NavItem[]): void;
  styles: any;
  epubViewStyles: EpubViewStyles;
  swipeable: boolean;
  onNextPressed: () => void;
  onPreviousPressed: () => void;
  onFontSizeOptionSelected: (fontSize: string) => void;
}

interface TocItemProps {
  label: string;
  href: string;
  styles: any;
  onSelection: (href: string) => void;
}

interface OptionButtonProps {
  isSelected: boolean;
  title: string;
  onButtonPressed: () => void;
}

const Reader = (props: ReaderProps) => {
  const {
    title,
    loadingView,
    swipeable,
    epubViewStyles,
    onNextPressed,
    onPreviousPressed,
    onLocationChanged,
    styles = defaultStyles,
    onFontSizeOptionSelected,
  } = props;
  const [isTocVisible, setIsTocVisible] = useState<boolean>(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [tableOfContents, setTableOfContents] = useState<NavItem[]>([]);
  const [selectedFontSize, setSelectedFontSize] = useState<string>("medium");
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [selectedFlow, setSelectedFlow] = useState<string>("page");

  const TocItem = (tocItemProps: TocItemProps) => {
    const { label, styles, onSelection, href } = tocItemProps;

    const handleOnSelection = () => {
      onSelection(href);
    };

    return (
      <button onClick={handleOnSelection} style={styles}>
        {label}
      </button>
    );
  };

  const toggleToc = () => {
    setIsTocVisible(!isTocVisible);
  };

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleOnNextPressed = () => {
    onNextPressed();
  };

  const handleOnPreviousPressed = () => {
    onPreviousPressed();
  };

  const handleOnTocChanged = (contents: NavItem[]) => {
    setTableOfContents(contents);
  };

  const handleOnThemeOptionSelected = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleOnFontSizeOptionSelected = (fontSize: string) => {
    setSelectedFontSize(fontSize);
    onFontSizeOptionSelected(fontSize);
  };

  const handleOnFlowOptionSelected = (flow: string) => {
    setSelectedFlow(flow);
  };

  const handleOnLocationChanged = (newLocation: string | number) => {
    setIsOptionsVisible(false);
    onLocationChanged && onLocationChanged(newLocation);
  };

  const renderToc = () => {
    return (
      <div>
        <div style={styles.tocArea}>
          <div style={styles.toc}>
            {tableOfContents.map((item: NavItem, index) => (
              <TocItem
                {...item}
                key={index}
                onSelection={handleOnLocationChanged}
                styles={styles.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {isTocVisible && (
          <div style={styles.tocBackground} onClick={toggleToc} />
        )}
      </div>
    );
  };

  const OptionButton = (optionButtonProps: OptionButtonProps) => {
    const { isSelected, title, onButtonPressed } = optionButtonProps;

    return (
      <button
        style={
          isSelected
            ? {
                ...styles.optionButton,
                ...styles.optionsButtonSelected,
              }
            : styles.optionButton
        }
        onClick={onButtonPressed}
      >
        <div>{title}</div>
      </button>
    );
  };

  const renderOptions = () => {
    return (
      <div>
        <div style={styles.optionsArea}>
          <div style={styles.options}>
            <div>Select Theme</div>
            <div style={styles.optionButtonContainer}>
              <OptionButton
                isSelected={selectedTheme === "default"}
                title="Default"
                onButtonPressed={() => handleOnThemeOptionSelected("default")}
              />
              <OptionButton
                isSelected={selectedTheme === "dark"}
                title="Dark"
                onButtonPressed={() => handleOnThemeOptionSelected("dark")}
              />
              <OptionButton
                isSelected={selectedTheme === "tinted"}
                title="Tinted"
                onButtonPressed={() => handleOnThemeOptionSelected("tinted")}
              />
            </div>
            <div style={styles.optionContainer}>
              <div>Select Font</div>
              <div style={styles.optionButtonContainer}>
                <OptionButton
                  isSelected={selectedFontSize === "small"}
                  title="SM"
                  onButtonPressed={() =>
                    handleOnFontSizeOptionSelected("small")
                  }
                />
                <OptionButton
                  isSelected={selectedFontSize === "medium"}
                  title="MD"
                  onButtonPressed={() =>
                    handleOnFontSizeOptionSelected("medium")
                  }
                />
                <OptionButton
                  isSelected={selectedFontSize === "large"}
                  title="LG"
                  onButtonPressed={() =>
                    handleOnFontSizeOptionSelected("large")
                  }
                />
              </div>
              <div style={styles.optionContainer}>
                <div>Select Flow</div>
                <div style={styles.optionButtonContainer}>
                  <OptionButton
                    isSelected={selectedFlow === "page"}
                    title="Page"
                    onButtonPressed={() => handleOnFlowOptionSelected("page")}
                  />
                  <OptionButton
                    isSelected={selectedFlow === "scroll"}
                    title="Scroll"
                    onButtonPressed={() => handleOnFlowOptionSelected("scroll")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {isOptionsVisible && (
          <div style={styles.optionsBackground} onClick={toggleOptions} />
        )}
      </div>
    );
  };

  const renderTocToggle = () => {
    return (
      <button
        style={Object.assign(
          {},
          styles.tocButton,
          isTocVisible ? styles.tocButtonExpanded : {}
        )}
        onClick={toggleToc}
      >
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)}
        />
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)}
        />
      </button>
    );
  };

  const renderOptionsToggle = () => {
    return (
      <button
        style={Object.assign(
          {},
          styles.optionsButton,
          isOptionsVisible ? styles.optionsButtonExpanded : {}
        )}
        onClick={toggleOptions}
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
  };

  return (
    <div style={styles.container}>
      <div
        style={Object.assign(
          {},
          styles.readerArea,
          isTocVisible
            ? styles.containerExpanded
            : isOptionsVisible
            ? styles.optionsExpanded
            : {}
        )}
      >
        {renderTocToggle()}
        {renderOptionsToggle()}
        <div style={styles.titleArea}>{title}</div>
        <Swipeable
          onSwipedRight={handleOnPreviousPressed}
          onSwipedLeft={handleOnNextPressed}
          trackMouse
        >
          <div style={styles.reader}>
            <TestEpub
              {...props}
              loadingView={loadingView}
              styles={epubViewStyles}
              onTocChanged={handleOnTocChanged}
              onLocationChanged={handleOnLocationChanged}
              flow={selectedFlow}
              theme={selectedTheme}
            />
            {swipeable && <div style={styles.swipeWrapper} />}
          </div>
        </Swipeable>
        {selectedFlow === "page" && (
          <div>
            <button
              style={Object.assign({}, styles.arrow, styles.prev)}
              onClick={handleOnPreviousPressed}
            >
              ‹
            </button>
            <button
              style={Object.assign({}, styles.arrow, styles.next)}
              onClick={handleOnNextPressed}
            >
              ›
            </button>
          </div>
        )}
      </div>
      {tableOfContents && renderToc()}
      {renderOptions()}
    </div>
  );
};

export default Reader;
