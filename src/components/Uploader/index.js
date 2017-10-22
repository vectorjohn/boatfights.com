import {connect} from 'react-redux';
import {submitBoatForm, navShowHome, resetBoatForm} from '../../actions';
import Uploader from './Uploader';

function mapStateToProps(state) {
  return {
    disabled: state.boatForm.complete || state.boatForm.disabled
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitBoat: (f) => {
      return dispatch(submitBoatForm(f))
        .then(() => {
          dispatch(navShowHome());
          dispatch(resetBoatForm());
        });
      },
    onCancel: () => dispatch(navShowHome())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
