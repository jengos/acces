import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

// React 16.8 usa ReactDOM.render en lugar de createRoot
ReactDOM.render(<App />, document.getElementById('root'));
