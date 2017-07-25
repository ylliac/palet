import React from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import Icon from 'material-ui/svg-icons/image/photo-camera'

import { loadImageFromFile } from '../commands/loadImage'

import {
  blue100
} from 'material-ui/styles/colors'

const style = {
  button: {
    margin: '5px'
  },
  hiddenInput: {
    display: 'none'
  }
}

const TakePictureButton = ({loadImageFromFile}) => {
  let hiddenInput = null

  const triggerHiddenInput = () => {
    hiddenInput.click()
  }

  const takePictureHandler = (event) => {
    const imageFile = event.target.files[0]
    loadImageFromFile(imageFile)
    event.preventDefault()
  }

  return (
    <div>
      <RaisedButton
        label='TAKE A PICTURE'
        backgroundColor={blue100}
        style={style.button}
        icon={<Icon />}
        onTouchTap={triggerHiddenInput} />
      <input
        ref={(input) => { hiddenInput = input }}
        onChange={takePictureHandler}
        style={style.hiddenInput}
        type='file'
        name='image'
        accept='image/*'
        capture='camera' />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, {loadImageFromFile})(TakePictureButton)
