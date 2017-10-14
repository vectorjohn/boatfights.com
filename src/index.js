import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import {receiveBoats, setCurrentBoat} from './actions';
import mockBoats from './mocks/boats.json';

const boatReq = process.env.NODE_ENV === 'development' ? Promise.resolve(mockBoats)
	: fetch('/boats.json').then((r)=>r.json())

boatReq.then(json => {
	store.dispatch(receiveBoats(json));
	store.dispatch(setCurrentBoat(json.images[Math.floor(Math.random() * json.images.length)].path));
});

function reRender() {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>, document.getElementById('root'));
}

reRender();
registerServiceWorker();
