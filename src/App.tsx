import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppBar } from './components';
import theme from './theme';

function getRoutes() {
  const routes = [
    {
      Component: React.lazy(() => import('./pages/Home/Home')),
      path: '/',
    },
    {
      Component: React.lazy(() => import('./pages/Team/Team')),
      path: '/team/:id',
    },
    {
      Component: React.lazy(() => import('./pages/Player/Player')),
      path: '/player/:id',
    },
    {
      Component: React.lazy(() => import('./pages/NotFound/NotFound')),
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
        <AppBar />
        <BrowserRouter>
          <Routes>{getRoutes()}</Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
