import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import boats from './boats.json';

let boatIdx = Math.floor(Math.random() * boats.length),
	boat = boats[boatIdx];

function reRender() {
	ReactDOM.render(<App boat={boat} onNext={() => changeboat(1)} onPrev={() => changeboat(-1)}/>, document.getElementById('root'));
}

function changeboat(dir) {
	boatIdx += dir;
	if (boatIdx >= boats.length) {
		boatIdx = 0;
	}
	if (boatIdx < 0)
		boatIdx = boats.length - 1;
	boat = boats[boatIdx];
	reRender();
}

reRender();
registerServiceWorker();
