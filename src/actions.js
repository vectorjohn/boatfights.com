
function standardAction(type, buildPayload = x => x) {
  return payload => ({type, payload: buildPayload(payload)})
}

export const RECEIVE_BOATS = 'RECEIVE_BOATS';
export const receiveBoats = standardAction(RECEIVE_BOATS);

export const RECEIVE_AUTH = 'RECEIVE_AUTH';
export const receiveAuth = standardAction(RECEIVE_AUTH);

export const AUTH_FAILURE = 'AUTH_FAILURE';
export const authFailure = standardAction(AUTH_FAILURE);

export const SET_CURRENT_BOAT = 'SET_CURRENT_BOAT';
export const setCurrentBoat = standardAction(SET_CURRENT_BOAT);

export const CHANGE_BOAT = 'CHANGE_BOAT';
export const changeBoat = standardAction(CHANGE_BOAT, change => ({change}));

export const NAV_SHOW_PAGE_STATE = 'NAV_SHOW_PAGE_STATE';
export const navShowUpload = standardAction(NAV_SHOW_PAGE_STATE);

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
