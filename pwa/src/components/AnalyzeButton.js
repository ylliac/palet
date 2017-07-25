import React from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import Icon from 'material-ui/svg-icons/image/adjust'

import { processImageFromImageData } from '../commands/processImage'
import {GPU_OPTIM3} from '../algo'

import {
  blue100
} from 'material-ui/styles/colors'

const style = {
  button: {
    margin: '5px'
  }
}

// Example avec worker: https://github.com/oliver-moran/jimp/blob/master/browser/examples/example3.html

const AnalyzeButton = ({imageData, processImageFromImageData}) => {
  if (!imageData) return null

  const analyzeHandler = () => {
    processImageFromImageData(imageData, GPU_OPTIM3)
  }

  return (
    <div>
      <RaisedButton
        label='ANALYZE'
        backgroundColor={blue100}
        style={style.button}
        icon={<Icon />}
        onTouchTap={analyzeHandler} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image ? state.image.imageData : null
  }
}

export default connect(mapStateToProps, {processImageFromImageData})(AnalyzeButton)
