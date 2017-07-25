import React from 'react'
import { connect } from 'react-redux'

const style = {
  image: {
    flex: '0 1 auto',
    alignSelf: 'center'
  }
}

const Image = ({imageData}) => {
  if (imageData) {
    return (
      <div style={style.image}>
        <img alt='Palets' src={imageData} />
      </div>
    )
  } else {
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    imageData: state.image ? state.image.imageData : null
  }
}

export default connect(mapStateToProps)(Image)
