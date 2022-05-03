import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebase, db } from './lib/firebase';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/app.css';

ReactDOM.render(
  <Router>
    <FirebaseContext.Provider value={{ firebase, db }}>
      <App />
    </FirebaseContext.Provider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
