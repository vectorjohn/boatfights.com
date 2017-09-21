import React from 'react';
//import logo from './logo.svg';
import './App.css';

function App({boat, onNext, onPrev}) {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Boat Fights!</h1>
        </div>
        <p className="App-intro">
		    <button onClick={onPrev}>&lt;</button>
		    <button onClick={onNext}>&gt;</button>
		    <br/>
		<img id="daboat" alt={boat.title} title={boat.title} src={boat.src} />
        </p>
      </div>
    );
}

export default App;
