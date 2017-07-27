import React from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import Icon from 'material-ui/svg-icons/image/crop-original'

import { loadSampleImage } from '../commands/loadImage'

import {
  grey50
} from 'material-ui/styles/colors'

const style = {
  label: {
    marginTop: '10px',
    marginBottom: '10px',
    color: grey50,
    fontStyle: 'italic'
  }
}

const LoadSampleButton = ({imageData, loadSampleImage}) => {
  const label = imageData ? 'or' : 'Let\'s start with...'

  return (
    <div style={style.label}>
      {label}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image ? state.image.imageData : null
  }
}

export default connect(mapStateToProps, {loadSampleImage})(LoadSampleButton)
