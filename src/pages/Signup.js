import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';

import { db } from '../lib/firebase';

import { doc, setDoc } from 'firebase/firestore';

import { doesUsernameExist } from '../services/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import ReactLoader from '../components/Loader';

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [profileFile, setProfileFile] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const storage = getStorage();
        const storageRef = ref(storage, `userProfilePicture/${username}`);
        const urlStorageRef = ref(
          storage,
          `gs://instagram-d02c0.appspot.com/userProfilePicture/${username}`
        );
        await uploadBytes(storageRef, profileFile);

        const photoURL = await getDownloadURL(urlStorageRef);
        const auth = getAuth();
        const createdUserResult = await createUserWithEmailAndPassword(
          auth,
          emailAddress.trim(''),
          password.trim('')
        );
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL, //{}
        });

        const newUsers = {
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLocaleLowerCase().trim(''),
          following: ['2'],
          followers: [],
          dateCreated: Date.now(),
          photoURL,
        };

        const userRef = doc(db, 'users', username);
        await setDoc(userRef, newUsers, { merge: true });

        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        setIsLoading(false);
        setUsername('');
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
    <div className="container flex flex-col lg:flex-row px-4 lg:px-0 mx-auto max-w-screen-md items-center h-screen">
      {isLoading && <ReactLoader />}
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
          <form onSubmit={handleSignup} method="POST" data-testid="sign-up">
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
            <div className="flex justify-between mb-2">
              <input
                className="inline-block h-2 p-5 middle border border-gray-primary rounded w-full outline-none"
                value={profileFile.name}
                readOnly
                placeholder="Add your profile picture"
              />
              <label
                className="inline-block py-2.5 px-5 text-gray-background middle border border-gray-primary rounded bg-blue-medium cursor-pointer h-11 ml-2.5 "
                htmlFor="file"
              >
                Search
              </label>
              <input
                data-testid="profile-picture"
                id="file"
                type="file"
                onChange={({ target }) => {
                  setProfileFile(target.files[0]);
                }}
                className="absolute w-0 h-0 p-0 overflow-hidden border-0"
                accept="image/png image/jpg"
              />
            </div>
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
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-blue-medium"
              data-testid="log-in"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
