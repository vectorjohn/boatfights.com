import React from 'react';
import './uploader.css';
const nodefault = fn => (ev, ...args) => {ev.preventDefault(); return fn(ev, ...args);}

export default ({onSubmitBoat, onCancel, disabled}) =>
  <form className="uploader" disabled={disabled} onSubmit={nodefault(onSubmitBoat)} action="/boats" method="POST">
    Uploader thingy
    <p className="help-block">Choose one of the following:</p>
    <fieldset>
      <div className="form-group">
        <label for="boat">Local Boat</label>
        <input type="file" id="boat" name="boat"
          onClick={(ev) => disabled && ev.preventDefault()} />
        <p className="help-block">Choose your own personal, artisanal boat from your computer or phone</p>
      </div>

      <div className="form-group">
        <label for="url">Boat on the net?</label>
        <input type="text" id="url" name="url"
          placeholder="http://www.example.com/cool/image.jpg"
          className="form-control" />
        <p className="help-block">Paste the <a
          href="https://simple.wikipedia.org/wiki/Uniform_Resource_Locator"
          target="_blank" rel="noopener noreferrer"s>URL</a> of
          any sweet boat on the web.
        </p>
      </div>
    </fieldset>

    <fieldset>
      <div className="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" name="title"
          placeholder="Let the best boat win"
          className="form-control"/>
        <p className="help-block">Short title / name</p>
      </div>

      <div className="form-group">
        <label for="description">Description</label>
        <textarea id="description" name="description"
          className="form-control" rows="3"></textarea>
        <p className="help-block">Tell us a little about this boat fight</p>
      </div>
    </fieldset>

    <input type="submit" className="btn btn-primary"
      value="Boat Me"
      onClick={nodefault(ev => onSubmitBoat(ev.target.form))} />
    <button className="btn btn-default" onClick={onCancel}>Cancel</button>
  </form>
