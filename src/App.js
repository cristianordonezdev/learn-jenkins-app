import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App" style={{ background: 'red' }}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Jenkins on Udemy
        </a>
      </header>
      <p style={{ background: 'yellow' }}>
          Application version: { process.env.REACT_APP_VERSION }
      </p>
    </div>
  );
}

export default App;
