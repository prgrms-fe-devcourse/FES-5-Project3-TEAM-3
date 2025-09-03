import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/style.css';
import App from './App.tsx';
import { ToastContainer } from 'react-toastify';
import { ConfirmHost } from './component/ConfirmModal.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer theme="colored" position="top-right" className="!top-20 !right-5" />
      <ConfirmHost />
    </QueryClientProvider>
  </StrictMode>
);
