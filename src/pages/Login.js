import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function Login(props) {
  const navigate = useNavigate('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isInvalid = password === '' || emailAddress === '';

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const auth = getAuth(); //
      // console.log(auth);
      await signInWithEmailAndPassword(auth, emailAddress, password);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress('');
      setPassword('');
      setError("Sorry Couldn't find users");
    }
  };

  useEffect(() => {
    document.title = 'Login - Instagram';
  }, []);

  return (
    <div className="container flex flex-col lg:flex-row px-4 lg:px-0 mx-auto max-w-screen-md items-center h-screen">
      <div className="block w-3/6 lg:w-3/5 m-3 ">
        <img src="/images/iphone-with-profile.jpg" alt="Iphone Login picture" />
      </div>
      <div className="flex flex-col w-full lg:w-2/5 mt-5">
        <div className="flex flex-col items-center bg-white p-4 border boder-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>
          {error && (
            <p data-testid="error" className="mb-4 text-s text-red-primary">
              {error}
            </p>
          )}
          <form data-testid="login" onSubmit={handleLogin} method="POST">
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2 outline-none"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Email password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2 outline-none"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-10 font-bold ${
                isInvalid && 'opacity-50'
              }`}
            >
              Log in
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account? {`   `}
            <Link
              to={ROUTES.SIGN_UP}
              className="font-bold text-blue-medium"
              data-testid="sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
