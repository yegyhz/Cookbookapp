import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import Router from '../Router';
import { AppProvider } from '../context/AppContext';
import ErrorBoundary from '../components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </AppProvider>
  </React.StrictMode>
);
