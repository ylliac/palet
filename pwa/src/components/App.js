import React from 'react'

import Image from './Image'
import Buttons from './Buttons'

import {
  blue500
} from 'material-ui/styles/colors'

const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
    maxHeight: '100vh',
    background: blue500
  }
}

const App = () => {
  return (
    <div style={style.root}>
      <Image />
      <Buttons />
    </div>
  )
}

export default App
