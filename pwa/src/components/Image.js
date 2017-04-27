import React from 'react'
import { connect } from 'react-redux'

export const Image = ({imageData}) => {
  if (imageData) {
    return (
      <div>
        <img alt='Palets' src={imageData} />
        <p className='App-intro'>
          Pour changer d'image, cliquez sur 'Prendre une photo' ou sur 'Exemple'.
        </p>
        <p className='App-intro'>
          Pour analyser l'image, cliquez sur 'Analyser'.
        </p>
      </div>
    )
  } else {
    return (
      <p className='App-intro'>
          Cliquez sur 'Prendre une photo' ou sur 'Exemple'.
        </p>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image.imageData
  }
}

export default connect(mapStateToProps)(Image)
