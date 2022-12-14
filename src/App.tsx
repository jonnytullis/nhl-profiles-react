import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AlertProvider } from './contexts/AlertContext';
import AppBar from './components/AppBar/AppBar';
import ErrorBoundary from './ErrorBoundary';
import queryClient from './network/queryClient';
import theme from './theme';

function getRoutes() {
  const routes = [
    {
      Component: React.lazy(() => import('./pages/Home/Home')),
      path: '/',
    },
    {
      Component: React.lazy(() => import('./pages/TeamProfile/TeamProfile')),
      path: '/team/:id',
    },
    {
      Component: React.lazy(() => import('./pages/PlayerProfile/PlayerProfile')),
      path: '/player/:id',
    },
    {
      Component: () => <Navigate to="/" />,
      path: '*',
    },
  ];

  return routes.map(({ path, Component }) => {
    const element = (
      <Suspense key={path} fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    );
    return <Route key={path} path={path} element={element} />;
  });
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AlertProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AppBar />
              <Routes>{getRoutes()}</Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </AlertProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
