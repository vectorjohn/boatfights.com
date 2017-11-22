import {connect} from 'react-redux';
import {deleteBoat} from '../actions';

export default connect(state => ({auth: state.auth}),
  dispatch => ({
    onDeleteBoat: (boat) => dispatch(deleteBoat(boat))
  }));
