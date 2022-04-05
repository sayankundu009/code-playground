import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { log } from './utils';
import './main.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((worker) => {
    log('Service worker registered', worker.scope);
  }, err => {
    console.error('Service worker registration failed', err)
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);