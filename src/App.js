import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as ROUTES from './constants/routes';

const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Routes>
    </Suspense>
  );
}
export default App;
