import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Fib from './Fib';
import otherPage from './otherPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib}></Route>
          <Route path="/otherpage" component={otherPage}></Route>
        </div>
      </div>
    </Router>
  );
}

export default App;
