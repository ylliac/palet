const initialState = {
  image: {
    imageData: null
  }
}

const reducer = (state = initialState, action) => {
  if (!action.perform) return state
  const newState = action.perform(state, action)
  return newState
}

export default reducer
