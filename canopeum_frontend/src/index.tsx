import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './custom.scss';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
