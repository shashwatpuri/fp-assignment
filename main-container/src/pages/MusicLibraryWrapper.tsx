import React, { Suspense } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

const MusicLibrary = React.lazy(() => import('microfrontend/MusicLibrary'));

function MusicLibraryWrapper() {
  const { isAuthenticated, user, loading } = useAuthContext()
  if (loading) return <>Loading...</>
  return (
    <ErrorBoundary>
      <Suspense fallback={<>Loading...</>}>
        <MusicLibrary
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

export default MusicLibraryWrapper