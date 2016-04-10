import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistState } from 'redux-devtools';
import * as reducers from '../reducers';
import DevTools from '../containers/DevTools.jsx';

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

const enhancer = compose(
  // Middleware you want to use in development:
  // applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
);

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const reducer = combineReducers(reducers);
  const store = createStore(reducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (!__CORDOVA__ && module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(combineReducers(require('../reducers')))
    );
  }

  return store;
}
