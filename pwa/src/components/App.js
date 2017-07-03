import React from 'react'
import logo from '../assets/logo.png'
import './App.css'
import Image from './Image'
import SelectImageButton from './SelectImageButton'
import LoadSampleButton from './LoadSampleButton'
import ProcessImageButton from './ProcessImageButton'
import {CPU, GPU_SIMPLE, GPU_OPTIM1, GPU_OPTIM2, GPU_OPTIM3} from '../algo'

const App = () => {
  return (
    <div className='App'>
      <div className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h2>Palet</h2>
      </div>
      <Image />
      <ProcessImageButton label='Analyser (CPU)' mode={CPU} />
      <ProcessImageButton label='Analyser (GPU simple)' mode={GPU_SIMPLE} />
      <ProcessImageButton label='Analyser (GPU optim 1)' mode={GPU_OPTIM1} />
      <ProcessImageButton label='Analyser (GPU optim 2)' mode={GPU_OPTIM2} />
      <ProcessImageButton label='Analyser (GPU optim 3)' mode={GPU_OPTIM3} />
      <SelectImageButton />
      <LoadSampleButton />
    </div>
  )
}

export default App
