import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import UserContext from './context/currentUser';
import useAuthListner from './hooks/useAuthListener';

import ProtectedRoute from './helpers/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const { user } = useAuthListner();
  return (
    <UserContext.Provider value={{ user }}>
      <Suspense fallback={<p>...Loading</p>}>
        <Routes>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          ;
          <Route path={ROUTES.LOGIN} element={<Login />} />;
          <Route path={ROUTES.SIGN_UP} element={<Signup />} />
          <Route path={ROUTES.NOT_FOUNT} element={<NotFound />} />
        </Routes>
      </Suspense>
    </UserContext.Provider>
  );
}
export default App;
