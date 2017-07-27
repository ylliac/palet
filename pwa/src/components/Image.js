import React from 'react'
import { connect } from 'react-redux'

const style = {
  root: {
    flex: '1 1 0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: '0 1 auto',
    minHeight: '0px'
  }
}

const Image = ({imageData, processedImageData}) => {
  const data = processedImageData || imageData

  if (data) {
    return (
      <div style={style.root}>
        <img style={style.image} alt='Palets' src={data} />
      </div>
    )
  } else {
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image ? state.image.imageData : null,
    processedImageData: state.image ? state.image.processedImageData : null
  }
}

export default connect(mapStateToProps)(Image)
