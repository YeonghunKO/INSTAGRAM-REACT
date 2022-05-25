import { lazy, Suspense, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import UserContext from './context/currentUser';
import loggedInContext from './context/loggedInUser';
import PostPhotosContext from './context/postPhotos';
import originalPhotosContext from './context/originalPost';
import UserFollowingContext from './context/userFollowing';
import IsProfileEditedContext from './context/isProfileEdited';

import useAuthListner from './hooks/useAuthListener';
import useUser from './hooks/useUser';
import usePhotos from './hooks/usePhotos';
import useStateCallback from './hooks/useStateCallback';

import ProtectedRoute from './helpers/ProtectedRoute';

import ReactLoader from './components/Loader';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const { user } = useAuthListner();
  console.log('APP user', user);
  const [isProfileEdited, setIsProfileEdited] = useState(false);

  const { activeUser = {} } = useUser(user?.uid, isProfileEdited);
  const { userId, following } = activeUser;

  const [postPhotos, setPostPhotos] = useStateCallback([]);
  const [originalPhotos, setOriginalPhotos] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const { photos } = usePhotos(userId, userFollowing);

  console.log('app');
  useEffect(() => {
    setOriginalPhotos(photos);
    setPostPhotos(photos);
  }, [photos]);

  useEffect(() => {
    setUserFollowing(following);
  }, [following]);

  return (
    <UserContext.Provider value={{ user }}>
      <loggedInContext.Provider value={{ activeUser }}>
        <PostPhotosContext.Provider value={{ postPhotos, setPostPhotos }}>
          <originalPhotosContext.Provider
            value={{ originalPhotos, setOriginalPhotos }}
          >
            <UserFollowingContext.Provider
              value={{ userFollowing, setUserFollowing }}
            >
              <IsProfileEditedContext.Provider
                value={{ isProfileEdited, setIsProfileEdited }}
              >
                <Suspense fallback={<ReactLoader />}>
                  <Routes>
                    <Route
                      path={ROUTES.DASHBOARD}
                      element={
                        <ProtectedRoute user={user}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.SIGN_UP} element={<Signup />} />
                    <Route path={ROUTES.PROFILE} element={<Profile />} />
                    <Route path={ROUTES.NOT_FOUNT} element={<NotFound />} />
                  </Routes>
                </Suspense>
              </IsProfileEditedContext.Provider>
            </UserFollowingContext.Provider>
          </originalPhotosContext.Provider>
        </PostPhotosContext.Provider>
      </loggedInContext.Provider>
    </UserContext.Provider>
  );
}
export default App;
