import React from 'react';

export default function Login({onSubmit}) {
  return (
    <div className="Login">
      <form onSubmit={onSubmit}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="submit" className="btn btn-default" value="Submit" />
      </form>
    </div>
  )
}
