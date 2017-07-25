import React from 'react'

import TakePictureButton from './TakePictureButton'
import LoadSampleButton from './LoadSampleButton'
import AnalyzeButton from './AnalyzeButton'

const style = {
  buttons: {
    display: 'flex',
    flex: '0 1 auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const Buttons = () => {
  return (
    <div style={style.buttons}>
      <TakePictureButton />
      <LoadSampleButton />
      <AnalyzeButton />
    </div>
  )
}

export default Buttons
