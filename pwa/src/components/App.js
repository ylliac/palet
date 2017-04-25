import React from 'react'
import logo from '../assets/logo.svg'
import './App.css'
import Image from './Image'
import SelectImageButton from './SelectImageButton'
import LoadSampleButton from './LoadSampleButton'

const App = () => {
  return (
    <div className='App'>
      <div className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h2>Welcome to React</h2>
      </div>
      <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      <Image />
      <SelectImageButton />
      <LoadSampleButton />
    </div>
  )
}

export default App
