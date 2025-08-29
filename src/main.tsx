import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/style.css';
import App from './App.tsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer theme="colored" position="top-right" className="!top-20 !right-5" />
  </StrictMode>
);
