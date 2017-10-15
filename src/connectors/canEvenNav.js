import {connect} from 'react-redux';
import {navShowUpload} from '../actions';

export default connect(state => {},
  dispatch => ({
    onShowUpload: () => dispatch(navShowUpload())
  }));
