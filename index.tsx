import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext'; // Import AppProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider> {/* Wrap with AppProvider */}
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </AppProvider>
  </React.StrictMode>
);