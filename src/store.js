import {createStore, combineReducers, applyMiddleware} from 'redux';
import {RECEIVE_BOATS, RECEIVE_AUTH, AUTH_FAILURE} from './actions';

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

function boats(cur = {all: []}, action = {}) {
  switch (action.type) {
    case RECEIVE_BOATS:
      return Object.assign({}, cur,
        {all: action.payload.images});
    default:
      return cur;
  }
}

export default createStore(combineReducers({
  auth,
  boats
}), applyMiddleware());
