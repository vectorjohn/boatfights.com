import {connect} from 'react-redux';
import {navShowUpload} from '../actions';

export default connect(state => ({nav: state.nav}),
  dispatch => ({
    onShowUpload: () => dispatch(navShowUpload())
  }));
