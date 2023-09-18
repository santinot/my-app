import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  // Hooks
  const [x, setMessage] = useState('')
  useEffect(() => {
    fetch('http://localhost:3001/api')
    .then(response => response.json())
    .then(data => setMessage(data.message))
  }, [])



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>{x}</div>
      </header>
    </div>
  );
}

export default App;