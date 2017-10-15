import React from 'react';
import BoatRotator from './components/BoatRotator';
import hasCurrentBoat from './connectors/hasCurrentBoat';
import './App.css';

const CurrentBoatRotator = hasCurrentBoat(BoatRotator);

function App({onNext, onPrev, onShowUpload}) {
    return (
      <div className="App">
        <div className="App-header container-fluid">
          <div className="col-sm-offset-2 col-sm-8">
            <h1>Boat Fights!</h1>
          </div>
          <div className="col-sm-2">
            <nav>
              <ul className="nav navbar-nav">
                <li><a className="btn btn-default" href="#submit-boat" onClick={onShowUpload}>Submit Boat Fights</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="App-intro">
		      <CurrentBoatRotator />
        </p>
      </div>
    );
}

export default App;
