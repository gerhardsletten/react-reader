export default {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #f2f2f2 0%,#333 100%)'
  },
  readerHolder: {
    position: 'absolute',
    top: 135,
    left: 20,
    right: 20,
    bottom: 20,
    boxShadow: '0 0 5px rgba(0,0,0,.3)',
    transition: 'all .6s ease'
  },
  readerHolderFullscreen: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: 'none'
  },
  bar: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20
  },
  logo: {
    width: 330,
    height: 104,
    display: 'inline-block',
    marginLeft: 2
  },
  closeLink: {
    fontSize: 20,
    color: '#808080',
    border: 'none',
    background: 'none',
    float: 'right',
    marginTop: 40,
    outline: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    appearance: 'none'
  },
  closeIcon: {
    verticalAlign: 'middle',
    display: 'inline-block',
    width: 50,
    height: 50,
    background: '#4D4D4D',
    marginLeft: 15,
    borderRadius: '50%',
    position: 'relative',
    transform: 'rotate(45deg)'
  },
  closeIconBar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60%',
    height: 2,
    background: '#fff',
    marginLeft: '-30%',
    marginTop: '-1px',
    borderRadius: '1px'
  },
  closeIconBarLast: {
    transform: 'rotate(-90deg)'
  }
}
