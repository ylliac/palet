import React, { Component, PropTypes } from 'react';
import paletStyle from '../style/palet-style.scss';

export default class MainSection extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions } = this.props;

    return (
      <section className={paletStyle.main}>
        <div>Hello world</div>
        <div>Debug: There is {Object.keys(actions).length} actions registered</div>
      </section>
    );
  }
}
