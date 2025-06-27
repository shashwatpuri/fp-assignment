
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Signin from './pages/Signin';
import AuthContextProvider from './providers/AuthContextProvider';
import PrivateRoute from './components/PrivateRouteWrapper';
import MusicLibraryWrapper from './pages/MusicLibraryWrapper';
import Signup from './pages/Signup';
import CustomLoader from './components/CustomLoader';

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <CustomLoader message="Loading..." />
    </div>}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />} >
              <Route path="/music" element={<MusicLibraryWrapper />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </Suspense>
  );
}

export default App;