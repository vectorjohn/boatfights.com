
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
