import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PaletActions from '../actions/PaletActions';
import MainSection from '../components/MainSection.jsx';

const style = {
  marginTop: '15%',
  border: '10px solid transparent',
  boxShadow: '2px 2px 10px 0px',
  borderRadius: '10px'
};

export class PaletApp extends Component {
  static propTypes = {
    paletActions: PropTypes.object.isRequired
  };
  render() {
    const { paletActions } = this.props;
    return (
      <div>
        <div style={style}>
          <MainSection actions={paletActions} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ todos: state.todos });

const mapDispatchToProps = dispatch => ({
  paletActions: bindActionCreators(PaletActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PaletApp);
