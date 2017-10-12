import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import mockBoats from './mocks/boats.json';

const boatReq = process.env.NODE_ENV === 'development' ? Promise.resolve(mockBoats)
	: fetch('/boats.json').then((r)=>r.json())

let boat = null,
	boatIdx = 0,
	boats = null;

boatReq
	.then((json) => {
		boats = json;
		boatIdx = Math.floor(Math.random() * boats.images.length);
		boat = boats.images[boatIdx];
		reRender();
	});


function reRender() {
	ReactDOM.render(
		<Provider store={store}>
			<App boat={boat} onNext={() => changeboat(1)} onPrev={() => changeboat(-1)}/>
		</Provider>, document.getElementById('root'));
}

function changeboat(dir) {
	boatIdx += dir;
	if (boatIdx >= boats.images.length) {
		boatIdx = 0;
	}
	if (boatIdx < 0)
		boatIdx = boats.images.length - 1;
	boat = boats.images[boatIdx];
	reRender();
}

//reRender();
registerServiceWorker();
