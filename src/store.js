import {createStore, combineReducers, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import {
  RECEIVE_BOATS,
  RECEIVE_AUTH,
  AUTH_FAILURE,
  SET_CURRENT_BOAT,
  CHANGE_BOAT
} from './actions';

function auth(cur = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_AUTH:
      return Object.assign({}, action.payload, {isLoggedIn: true});
    case AUTH_FAILURE:
      return Object.assign({}, action.payload, {isLoggedIn: false});
    default:
      return cur;
  }
}

function boats(cur = {idx: null, all: []}, action = {}) {
  switch (action.type) {
    case RECEIVE_BOATS:
      return Object.assign({}, cur,
        {all: action.payload.images, idx: null});
    case SET_CURRENT_BOAT: {
      const all = cur.all;
      return Object.assign({}, cur,
        {idx: all.findIndex(b => b.path === action.payload.path)});
    }
    case CHANGE_BOAT: {
      let all = cur.all,
        len = all.length,
        next = (cur.idx + action.payload.change) % len;
      if (next < 0) {
        next = len + next;
      }
      return Object.assign({}, cur, {idx: next});
    }
    default:
      return cur;
  }
}

export default createStore(combineReducers({
  auth,
  boats
}), applyMiddleware(reduxLogger, reduxThunk));
