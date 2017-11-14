import {createStore, combineReducers, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import {
  RECEIVE_BOATS,
  RECEIVE_AUTH,
  AUTH_FAILURE,
  SET_CURRENT_BOAT,
  CHANGE_BOAT,
  NAV_SHOW_PAGE_STATE,
  BOAT_FORM_CHANGE,
  BEGIN_SUBMIT_BOAT,
  COMPLETE_SUBMIT_BOAT,
  RESET_BOAT_FORM,
  MOD_BOAT_FORM
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
        {idx: all.findIndex(b => b.path === action.payload)});
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
    case COMPLETE_SUBMIT_BOAT:
      //add the new boat to the list, and show it.
      return Object.assign({}, cur, {
        all: cur.all.concat([action.payload]),
        idx: cur.all.length
      })
    default:
      return cur;
  }
}

function nav(cur = {pageState: 'default'}, action = {}) {
  switch(action.type) {
    case NAV_SHOW_PAGE_STATE:
      if (action.payload === 'login') {
        return Object.assign({}, cur, {showLogin: true});
      }
      return Object.assign({}, cur, {pageState: action.payload});
    default:
      return cur;
  }
}

const defaultBoatForm = {complete: false};
function boatForm(cur = defaultBoatForm, action = {}) {
  switch (action.type) {
    case RESET_BOAT_FORM:
      return defaultBoatForm;
    case COMPLETE_SUBMIT_BOAT:
      return Object.assign({}, cur, {complete: true});
    case BEGIN_SUBMIT_BOAT:
      return Object.assign({}, cur, {disabled: true});
    case MOD_BOAT_FORM:
      return Object.assign({}, cur, action.payload);
    case BOAT_FORM_CHANGE:
    default:
      return cur;
  }
}

const authFetch = (url, options) => {
  const auth = store.getState().auth;
  if (!auth.isLoggedIn) {
    return fetch(url, options);
  }
  const headers = options ? {...options.headers} : {};
  headers.authorization = `Bearer ${auth.token}`;

  return fetch(url, {...options, headers});
}

const store = createStore(combineReducers({
  auth,
  boats,
  nav,
  boatForm
}), applyMiddleware(reduxLogger, reduxThunk.withExtraArgument(authFetch)));

export default store;
