export const ReactReaderStyle = {
  container: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%'
  },
  readerArea: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    transition: 'all .3s ease'
  },
  containerExpanded: {
    transform: 'translateX(256px)'
  },
  titleArea: {
    position: 'absolute',
    top: 20,
    left: 50,
    right: 50,
    textAlign: 'center',
    color: '#999'
  },
  reader: {
    position: 'absolute',
    top: 50,
    left: 50,
    bottom: 20,
    right: 50
  },
  swipeWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 200
  },
  prev: {
    left: 1
  },
  next: {
    right: 1
  },
  arrow: {
    outline: 'none',
    border: 'none',
    background: 'none',
    position: 'absolute',
    top: '50%',
    marginTop: -32,
    fontSize: 64,
    padding: '0 10px',
    color: '#E2E2E2',
    fontFamily: 'arial, sans-serif',
    cursor: 'pointer',
    userSelect: 'none',
    appearance: 'none',
    fontWeight: 'normal'
  },
  arrowHover: {
    color: '#777'
  },
  tocBackground: {
    position: 'absolute',
    left: 256,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1
  },
  tocArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    width: 256,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    background: '#f2f2f2',
    padding: '10px 0'
  },
  tocAreaButton: {
    userSelect: 'none',
    appearance: 'none',
    background: 'none',
    border: 'none',
    display: 'block',
    fontFamily: 'sans-serif',
    width: '100%',
    fontSize: '.9em',
    textAlign: 'left',
    padding: '.9em 1em',
    borderBottom: '1px solid #ddd',
    color: '#aaa',
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer'
  },
  tocButton: {
    background: 'none',
    border: 'none',
    width: 32,
    height: 32,
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 2,
    outline: 'none',
    cursor: 'pointer'
  },
  tocButtonExpanded: {
    background: '#f2f2f2'
  },
  tocButtonBar: {
    position: 'absolute',
    width: '60%',
    background: '#ccc',
    height: 2,
    left: '50%',
    margin: '-1px -30%',
    top: '50%',
    transition: 'all .5s ease'
  },
  tocButtonBarTop: {
    top: '35%'
  },
  tocButtonBottom: {
    top: '66%'
  },
  loadingView: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    color: '#ccc',
    textAlign: 'center',
    margintop: '-.5em'
  }
}
