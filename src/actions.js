
export const RECEIVE_BOATS = 'RECEIVE_BOATS';
export function receiveBoats(boats) {
  return {
    type: RECEIVE_BOATS,
    payload: boats
  }
}
