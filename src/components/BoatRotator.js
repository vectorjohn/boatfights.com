import React from 'react';

export default ({boat, onNext, onPrev}) => {
  if (!boat) {
    return null;
  }

  return (
    <div>
      <button onClick={onPrev}>&lt;</button>
      <button onClick={onNext}>&gt;</button>
      <br/>
      <img id="daboat" alt={boat.title} title={boat.title} src={boat.path} />
    </div>
  );
}
