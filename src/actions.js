
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
export const navShowUpload = standardAction(NAV_SHOW_PAGE_STATE, () => 'upload');
export const navShowHome = standardAction(NAV_SHOW_PAGE_STATE, () => 'default');

export const BOAT_FORM_CHANGE = 'BOAT_FORM_CHANGE';
export const boatFormChange = standardAction(BOAT_FORM_CHANGE);

export const RESET_BOAT_FORM = 'RESET_BOAT_FORM';
export const resetBoatForm = standardAction(RESET_BOAT_FORM);

export const MOD_BOAT_FORM = 'MOD_BOAT_FORM';
export const modBoatForm = standardAction(MOD_BOAT_FORM);

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

export const BEGIN_SUBMIT_BOAT = 'BEGIN_SUBMIT_BOAT';
const beginSubmitBoat = standardAction(BEGIN_SUBMIT_BOAT);

export const COMPLETE_SUBMIT_BOAT = 'COMPLETE_SUBMIT_BOAT';
const completeSubmitBoat = standardAction(COMPLETE_SUBMIT_BOAT);

export function submitBoatForm(form) {
  return dispatch => {
    const data = new FormData(form);
    dispatch(beginSubmitBoat(form));
    return fetch(form.action, {
      method: form.method,
      body: data
    }).then(resp => resp.json())
    .then(boat => {
      dispatch(completeSubmitBoat(boat));
      return boat;
    });
  }
}

export const SHOW_GROWL = 'SHOW_GROWL';
const showGrowlAction = standardAction(SHOW_GROWL);
export const HIDE_GROWL = 'HIDE_GROWL';
export const hideGrowl = standardAction(HIDE_GROWL);

export function showGrowl(message, timeout = 10000) {
  return dispatch => {
    dispatch(showGrowlAction(message));
    setTimeout(() => dispatch(hideGrowl()), timeout);
  }
}
