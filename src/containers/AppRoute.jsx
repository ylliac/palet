import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import PaletApp from './PaletApp.jsx';

class AppRoute extends Component {
  static propTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object
  };
  constructor(...args) {
    super(...args);

    this._isCheckingInitialLogIn = true;
    this._shouldRouterUpdate = true;
  }
  componentDidMount() {
    this._shouldRouterUpdate = false;
  }
  shouldComponentUpdate(nextProps) {
    return this._shouldRouterUpdate;
  }
  componentDidUpdate() {
    this._shouldRouterUpdate = false;
  }
  handleRedirect(nextState, replaceState) {
    replaceState({ nextPathname: nextState.location.pathname }, '/main');
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/main" component={PaletApp} />
        <Route path="*" onEnter={::this.handleRedirect} />
      </Router>
    );
  }
}

const mapStateToProps = state => ({ stores: state });

const mapDispatchToProps = dispatch => ({
  actions: {
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRoute);
