
export const busy = (trueOrFalse) => {
  return {
    type: 'BUSY',
    trueOrFalse,
    perform: (state, action) => {
      return {...state, busy: trueOrFalse}
    }
  }
}
