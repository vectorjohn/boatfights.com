import {connect} from 'react-redux';
import {submitAuth} from '../../actions';
import Login from './Login';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (ev) => {
      ev.preventDefault();
      dispatch(submitAuth(ev.target));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
