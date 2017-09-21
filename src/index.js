import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import boats from './boats.json';

const boat = boats[Math.floor(Math.random() * boats.length)];

ReactDOM.render(<App boat={boat}/>, document.getElementById('root'));
registerServiceWorker();
