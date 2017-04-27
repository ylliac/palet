import React from 'react'
import { connect } from 'react-redux'
import { loadSampleImage } from '../commands/loadImage'

export const LoadSampleButton = ({processSampleImage, loadSampleImage}) => {
  const handleClick = () => {
    loadSampleImage()
  }

  return <button onClick={handleClick}>Exemple</button>
}

const mapStateToProps = () => { return {} }

export default connect(mapStateToProps, {loadSampleImage})(LoadSampleButton)
