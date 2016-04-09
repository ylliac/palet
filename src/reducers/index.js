import _ from 'lodash';
import fs from 'fs';
import path from 'path';

// Create the reducer map
const reducers = {};
// Create async actions map
const asyncActions = {};

function registerReducer(reducer) {
  if (typeof reducer.action === 'function') {
    asyncActions[reducer.type] = reducer.action;
  }
  else {
    reducers[reducer.type] = reducer.apply;
  }
}

function registerReducerDirectory(absoluteDirectory){
  const reducerFiles = fs.readdirSync(absoluteDirectory);

  _.each(reducerFiles, reducerFile => {
    const reducer = require(path.join(absoluteDirectory, reducerFile));
    registerReducer(reducer);
  });
}

function dispatch(state, action){
  const reducer = reducers[action.type];
  if (reducer){
    return reducer(state, action);
  }

  return state;
}

registerReducerDirectory('.');

export default dispatch;
