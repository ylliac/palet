import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

export const LoadSampleButton = ({processSampleImage}) => {
  return <button onClick={processSampleImage}>Exemple</button>
}

const mapStateToProps = () => { return {} }

export default connect(mapStateToProps, actions)(LoadSampleButton)
