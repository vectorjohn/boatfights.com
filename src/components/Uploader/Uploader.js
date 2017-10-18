import React from 'react';
import './uploader.css';

export default ({onSubmitBoat, disabled}) =>
  <form className="uploader" disabled={disabled} onSubmit={onSubmitBoat} action="/boats" method="POST">
    Uploader thingy
    <input type="file" name="boat" onClick={(ev) => disabled && ev.preventDefault()} onChange={(ev) => onSubmitBoat(ev.target.form)} />
  </form>
