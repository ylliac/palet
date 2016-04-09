import * as types from '../constants/PaletActionTypes';

export function runDetection(imageFile) {
  return {
    type: types.RUN_DETECTION,
    imageFile
  };
}
