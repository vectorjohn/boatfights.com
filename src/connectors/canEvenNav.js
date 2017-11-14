import {connect} from 'react-redux';
import {navShowUpload, navShowLogin} from '../actions';

export default connect(state => ({nav: state.nav}),
  dispatch => ({
    onShowUpload: () => dispatch(navShowUpload()),
    onShowLogin: () => dispatch(navShowLogin())
  }));
