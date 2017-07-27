import React from 'react'

import TakePictureButton from './TakePictureButton'
import LoadSampleButton from './LoadSampleButton'
import AnalyzeButton from './AnalyzeButton'
import ButtonLabel from './ButtonLabel'

import {GPU_OPTIM3} from '../algo'

const style = {
  buttons: {
    display: 'flex',
    flex: '0 1 auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px'
  },
  loadButtons: {
    display: 'flex',
    flexDirection: 'row'
  }
}

const Buttons = () => {
  return (
    <div style={style.buttons}>
      <AnalyzeButton mode={GPU_OPTIM3} />
      <ButtonLabel />
      <div style={style.loadButtons}>
        <TakePictureButton />
        <LoadSampleButton />
      </div>
    </div>
  )
}

export default Buttons
