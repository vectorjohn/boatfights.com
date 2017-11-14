import React from 'react';
import BoatRotator from './components/BoatRotator';
import Uploader from './components/Uploader';
import Login from './components/Login';
import hasCurrentBoat from './connectors/hasCurrentBoat';
import './App.css';

const CurrentBoatRotator = hasCurrentBoat(BoatRotator);

function App({nav, onNext, onPrev, onShowUpload, onShowLogin}) {
  let CurrentThing = null;

  switch (nav.pageState) {
    case 'upload':
      CurrentThing = Uploader;
      break;
    default:
      CurrentThing = CurrentBoatRotator;
  }

  if (nav.showLogin) {

  }

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
              <li><a className="btn btn-secondary" href="#login" onClick={onShowLogin}>Login</a></li>
            </ul>
          </nav>
        </div>
        <ShowIf test={nav.showLogin}>
          <Login />
        </ShowIf>
      </div>
      <div className="App-intro">
	      <CurrentThing />
      </div>
    </div>
  );
}

function ShowIf({test=false, children=null}) {
  return test ? <div>{children}</div> : null;
}

export default App;
