import React from 'react';
import BoatRotator from './components/BoatRotator';
import hasCurrentBoat from './connectors/hasCurrentBoat';
import './App.css';

const CurrentBoatRotator = hasCurrentBoat(BoatRotator);

function App({onNext, onPrev}) {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Boat Fights!</h1>
        </div>
        <p className="App-intro">
		      <CurrentBoatRotator />
        </p>
      </div>
    );
}

export default App;
