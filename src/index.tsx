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

const auth = sessionStorage.getItem('auth')
if (auth) {
	store.dispatch(receiveAuth(JSON.parse(auth)));
}

window.addEventListener('hashchange', () => {
	const state = store.getState()
	if (window.location.hash) {
		const findPath = window.location.hash.substr(1)
		const newIdx = state.boats.all.findIndex((image: any) => image.path === findPath)
		
		console.log('LOOKING FOR BOAT', window.location.hash, "found: ", newIdx)
		if (newIdx === state.boats.idx) {
			console.log('but it changes nothing')
			return
		}
		if (newIdx >= 0) {
			store.dispatch(setCurrentBoat(state.boats.all[newIdx].path));
		}
	}
	
})

store.dispatch((dispatch, _, authFetch) => {
	const boatReq = process.env.NODE_ENV === 'development' ? Promise.resolve(mockBoats)
		: authFetch('/boats.json').then(r => r.json())
	boatReq.then((json: {images: {path: string}[]}) => {
		store.dispatch(receiveBoats(json));
		let initialBoat = json.images[Math.floor(Math.random() * json.images.length)]
		if (window.location.hash) {
			const findPath = window.location.hash.substr(1)
			const urlBoat = json.images.find(image => image.path === findPath)
			console.log('LOOKING FOR BOAT', window.location.hash, "found: ", urlBoat)
			initialBoat = urlBoat || initialBoat
		}
		else {
			window.location.replace('#' + initialBoat.path)
			return
		}
		store.dispatch(setCurrentBoat(initialBoat.path));
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
