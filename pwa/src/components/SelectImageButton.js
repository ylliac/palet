import React from 'react'

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

const SelectImageButton = () => {
  return (
    <div>
      <label htmlFor='selectImageButton' style={styles.label}>Prendre une photo</label>
      <input id='selectImageButton' style={styles.button} type='file' name='image' accept='image/*' capture='camera' />
    </div>
  )
}

export default SelectImageButton
