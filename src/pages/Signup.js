import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { collection, addDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';

import { db } from '../lib/firebase';

import { doesUsernameExist } from '../services/firebase';

function Signup(props) {
  const navigate = useNavigate();

  // const auth = getAuth();
  // const user = auth.currentUser;

  // if (user !== null) {
  //   user.providerData.forEach(profile => {
  //     console.log('Sign-in provider: ' + profile.providerId);
  //     console.log('  Provider-specific UID: ' + profile.uid);
  //     console.log('  Name: ' + profile.displayName);
  //     console.log('  Email: ' + profile.email);
  //     console.log('  Photo URL: ' + profile.photoURL);
  //   });
  // }

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isInvalid =
    username === '' ||
    fullName === '' ||
    password === '' ||
    emailAddress === '';

  const handleSignup = async event => {
    event.preventDefault();
    if (await doesUsernameExist(username)) {
      setUsername('');
      setError('user is already taken');
    } else {
      try {
        const auth = getAuth();
        const createdUserResult = await createUserWithEmailAndPassword(
          auth,
          emailAddress,
          password
        );
        await updateProfile(auth.currentUser, {
          displayName: username,
        });

        const newUsers = {
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLocaleLowerCase(),
          following: ['2'],
          followers: [],
          dateCreated: Date.now(),
        };
        await addDoc(collection(db, 'users'), newUsers);
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        setEmailAddress('');
        setPassword('');
        setFullName('');
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    document.title = 'Sign up - Instagram';
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5 m-3 ">
        <img src="/images/iphone-with-profile.jpg" alt="Iphone Login picture" />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border boder-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>
          {error && <p className="mb-4 text-s text-red-primary">{error}</p>}
          <form onSubmit={handleSignup} method="POST">
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="username"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2 outline-none"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              aria-label="Enter your fullname"
              type="text"
              placeholder="fullname"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2 outline-none"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
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
              Sign up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Have an account? {`   `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
