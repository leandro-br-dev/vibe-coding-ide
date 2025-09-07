import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading Vibe IDE...
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <BrowserRouter>
                <AppLayout>
                  <AppRoutes />
                </AppLayout>
              </BrowserRouter>
            </ThemeProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};
