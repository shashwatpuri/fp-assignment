import React, { Suspense } from 'react';

const RemoteTestApp = React.lazy(() => import('microfrontend/TestApp'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RemoteTestApp />
    </Suspense>
  );
}

export default App;