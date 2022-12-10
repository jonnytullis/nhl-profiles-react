import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function getRoutes() {
  const routes = [
    {
      Component: React.lazy(() => import('./pages/Home/Home')),
      path: '/',
    },
    {
      Component: React.lazy(() => import('./pages/Team/Team')),
      path: '/team',
    },
    {
      Component: React.lazy(() => import('./pages/Player/Player')),
      path: '/player',
    },
    {
      Component: React.lazy(() => import('./pages/NotFound/NotFound')),
      path: '*',
    },
  ];

  return routes.map(({ path, Component }) => (
    <Route
      key={path}
      path={path}
      element={
        <Suspense key={path} fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      }
    />
  ));
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>{getRoutes()}</Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
