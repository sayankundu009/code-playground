import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './main.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((worker) => {
    console.log('Service worker registered', worker.scope);
  }, err => {
    console.error('Service worker registration failed', err)
  });
}