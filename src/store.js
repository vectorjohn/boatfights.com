import {createStore, combineReducers, applyMiddleware} from 'redux';
import {RECEIVE_BOATS} from './actions';

function auth(cur = {}, action = {}) {
  return cur;
}

function boats(cur = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_BOATS:

      break;
    default:

  }
}

export default createStore(combineReducers({
  auth
}), applyMiddleware());
