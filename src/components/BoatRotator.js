import React from 'react';

export default ({boat, onNext, onPrev}) => {
  if (!boat) {
    return null;
  }

  return (
    <div className="BoatRotator">
      <button onClick={onPrev}>&lt;</button>
      <button onClick={onNext}>&gt;</button>
      <figure>
        <img id="daboat" alt={boat.title} title={boat.title} src={boat.path} />
        <figcaption><strong>{boat.title}</strong> {boat.description}</figcaption>
      </figure>
    </div>
  );
}
