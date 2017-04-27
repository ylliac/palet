import React from 'react'
import logo from '../assets/logo.png'
import './App.css'
import Image from './Image'
import SelectImageButton from './SelectImageButton'
import LoadSampleButton from './LoadSampleButton'
import ProcessImageButton from './ProcessImageButton'

const App = () => {
  return (
    <div className='App'>
      <div className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h2>Palet</h2>
      </div>
      <Image />
      <ProcessImageButton />
      <SelectImageButton />
      <LoadSampleButton />
    </div>
  )
}

export default App
