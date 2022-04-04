import { lazy, Suspense, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import UserContext from './context/currentUser';
import useAuthListner from './hooks/useAuthListener';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  const { user } = useAuthListner();
  return (
    <UserContext.Provider value={{ user }}>
      <Suspense fallback={<p>...Loading</p>}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.SIGN_UP} element={<Signup />} />
          <Route path={ROUTES.NOT_FOUNT} element={<NotFound />} />
        </Routes>
      </Suspense>
    </UserContext.Provider>
  );
}
export default App;
