import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

// TODO Should be taken off in production
import DevTools from '../containers/DevTools.jsx';

const store = configureStore();

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node
  };
  render() {
    return (
      <div>
        <Provider store={store}>
          { this.props.children }
        </Provider>
        { __DEVTOOLS__ && <DevTools /> }
      </div>
    );
  }
}
