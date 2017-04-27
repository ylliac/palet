import React from 'react'
import { connect } from 'react-redux'
import { loadImageFromFile } from '../commands/loadImage'

const styles = {
  label: {
    appearance: 'push-button',
    WebkitAppearance: 'push-button',
    MozAppearance: 'push-button',
    lineHeight: '16px',
    padding: '.2em .4em',
    margin: '.2em'
  },
  button: {
    display: 'none'
  }
}

const SelectImageButton = ({loadImageFromFile, processImageFromFile}) => {
  const handleChange = (event) => {
    const imageFile = event.target.files[0]
    loadImageFromFile(imageFile)
    event.preventDefault()
  }

  return (
    <div>
      <label htmlFor='selectImageButton' style={styles.label}>Prendre une photo</label>
      <input id='selectImageButton' onChange={handleChange} style={styles.button} type='file' name='image' accept='image/*' capture='camera' />
    </div>
  )
}

const mapStateToProps = () => { return {} }

export default connect(mapStateToProps, {loadImageFromFile})(SelectImageButton)
