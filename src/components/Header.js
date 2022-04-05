import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

import UserContext from '../context/currentUser';
import * as ROUTES from '../constants/routes';
import {
  DEFAULT_IMAGE_PATH,
  INSTAGRAM_LOGO,
  USER_PROFILE_IMAGE,
} from '../constants/path';

// hover 하면 opacity가 자연스럽게 옅어지는 효과를 tailwind config에 추가해보기
function Header() {
  const { user: loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const onClickHeaderHandle = () => {
    const auth = getAuth();
    signOut(auth);
    navigate(ROUTES.LOGIN);
  };
  return (
    <div className="h-16 bg-white border-b border-gray-primary mb-8">
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center cursor-pointer">
            <h1 className="flex justify-center w-full">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  src={INSTAGRAM_LOGO}
                  alt="Instagram"
                  className="mt-2 w-6/12"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 text-center flex items-center">
            {loggedInUser ? (
              <>
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>
                <button
                  type="button"
                  title="Sign out"
                  onClick={onClickHeaderHandle}
                  onKeyDown={evt => {
                    if (evt.key === 'Enter') {
                      onClickHeaderHandle();
                    }
                  }}
                >
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
                {loggedInUser && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${loggedInUser?.displayName}`}>
                      <img
                        className="rounded-full h-8 w-8 flex"
                        src={loggedInUser?.photoURL}
                        alt={`${loggedInUser?.displayName} profile`}
                        onError={evt => {
                          evt.target.src = DEFAULT_IMAGE_PATH;
                        }}
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-medium hover:bg-opacity-70 transition-all font-bold text-sm rounded text-white w-20 h-8"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button className="font-bold text-sm rounded text-blue-medium hover:text-opacity-70 transition-all w-20 h-8">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
