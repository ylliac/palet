import React from 'react'
import { connect } from 'react-redux'
import { processImageFromImageData } from '../commands/processImage'

// Example avec worker: https://github.com/oliver-moran/jimp/blob/master/browser/examples/example3.html

export const ProcessImageButton = ({processImageFromImageData, imageData}) => {
  const handleClick = () => {
    processImageFromImageData(imageData)
  }

  return imageData ? <button onClick={handleClick}>Analyser</button> : <div />
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image.imageData
  }
}

export default connect(mapStateToProps, {processImageFromImageData})(ProcessImageButton)
