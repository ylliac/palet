import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

export const Image = ({imageData}) => {
  if (imageData) {
    return (
      <img alt='Palets' src={imageData} />
    )
  } else {
    return (
      <span>Cliquer sur l'un des boutons ci dessous</span>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image.imageData
  }
}

export default connect(mapStateToProps, actions)(Image)
