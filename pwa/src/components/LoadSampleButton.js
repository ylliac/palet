import React from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import Icon from 'material-ui/svg-icons/image/crop-original'

import { loadSampleImage } from '../commands/loadImage'

import {
  blue100
} from 'material-ui/styles/colors'

const style = {
  button: {
    margin: '5px'
  }
}

const LoadSampleButton = ({imageData, loadSampleImage}) => {
  if (imageData) return null

  const loadSampleHandler = () => {
    loadSampleImage()
  }

  return (
    <div>
      <RaisedButton
        label='LOAD SAMPLE'
        backgroundColor={blue100}
        style={style.button}
        icon={<Icon />}
        onTouchTap={loadSampleHandler} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image ? state.image.imageData : null
  }
}

export default connect(mapStateToProps, {loadSampleImage})(LoadSampleButton)
