import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import AppBase from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import {receiveBoats, setCurrentBoat, receiveAuth} from './actions';
import canEvenNav from './connectors/canEvenNav';
import hasAuth from './connectors/hasAuth';
import mockBoats from './mocks/boats.json';

const App = hasAuth(canEvenNav(AppBase));

if (sessionStorage.getItem('auth')) {
	store.dispatch(receiveAuth(JSON.parse(sessionStorage.getItem('auth'))));
}

store.dispatch((dispatch, _, authFetch) => {
	const boatReq = process.env.NODE_ENV === 'development' ? Promise.resolve(mockBoats)
		: authFetch('/boats.json').then(r => r.json())
	boatReq.then(json => {
		store.dispatch(receiveBoats(json));
		store.dispatch(setCurrentBoat(json.images[Math.floor(Math.random() * json.images.length)].path));
	});
})

function reRender() {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>, document.getElementById('root'));
}

reRender();
registerServiceWorker();
