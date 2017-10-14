
export const RECEIVE_BOATS = 'RECEIVE_BOATS';
export function receiveBoats(boats) {
  return {
    type: RECEIVE_BOATS,
    payload: boats
  }
}

export const RECEIVE_AUTH = 'RECEIVE_AUTH';
function receiveAuth(auth) {
  return {
    type: RECEIVE_AUTH,
    payload: auth
  }
}

export const AUTH_FAILURE = 'AUTH_FAILURE';
function authFailure(resp) {
  return {
    type: AUTH_FAILURE,
    payload: resp
  };
}

export const SET_CURRENT_BOAT = 'SET_CURRENT_BOAT';
export function setCurrentBoat(path) {
  return {
    type: SET_CURRENT_BOAT,
    payload: {path}
  }
}

export const CHANGE_BOAT = 'CHANGE_BOAT';
export function changeBoat(change) {
  return {
    type: CHANGE_BOAT,
    payload: {change}
  }
}

export function submitAuth(form) {
  return (dispatch) =>
    fetch('/login', {body: form})
      .then(res => res.json())
      .then(json => {
        if (json.token) {
          return dispatch(receiveAuth, json);
        }
        return dispatch(authFailure, json);
      })
}
