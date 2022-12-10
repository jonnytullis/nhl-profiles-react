import React from 'react';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div>Hello World</div>
    </ErrorBoundary>
  );
}

export default App;
