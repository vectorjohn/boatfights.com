import {connect} from 'react-redux';
import {changeBoat, setCurrentBoat} from '../actions';

export default connect(state => state.boats.idx !== null ?
  {
    boat: state.boats.all[state.boats.idx],
    boatIdx: state.boats.idx,
    numBoats: state.boats.all.length
  }
  : {}, (dispatch) => ({
    onNext: () => dispatch(changeBoat(1)),
    onPrev: () => dispatch(changeBoat(-1)),
    onModBoat: (n) => dispatch(changeBoat(n)),
    onSetBoat: (path) => dispatch(setCurrentBoat(path))
  }));
