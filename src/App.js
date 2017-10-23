import React from 'react';
import BoatRotator from './components/BoatRotator';
import Uploader from './components/Uploader';
import hasCurrentBoat from './connectors/hasCurrentBoat';
import './App.css';

const CurrentBoatRotator = hasCurrentBoat(BoatRotator);

function App({nav, onNext, onPrev, onShowUpload}) {
  let CurrentThing = null;

  switch (nav.pageState) {
    case 'upload':
      CurrentThing = Uploader;
      break;
    default:
      CurrentThing = CurrentBoatRotator;
  }

  return (
    <div className="App">
      <div className="App-header container-fluid">
        <div className="col-sm-offset-2 col-sm-8 page-header">
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
      <div className="App-intro">
	      <CurrentThing />
      </div>
    </div>
  );
}

export default App;
