import { render, fireEvent, waitFor, act } from '@testing-library/react';

import IsProfileEditedContext from '../../context/isProfileEdited';

import { BrowserRouter } from 'react-router-dom';
import SignUp from '../../pages/Signup';
import * as ROUTES from '../../constants/routes';

import { doesUsernameExist } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';

import { doc, setDoc, collection } from 'firebase/firestore';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

jest.mock('../../services/firebase');

jest.mock('../../lib/firebase', () => ({
  db: { db: 'db' },
}));

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('sign up', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign up page with a form submission and signs a user up', async () => {
    getStorage.mockImplementation(() => ({
      storage: 'storage',
    }));
    ref.mockImplementation(() => () => {});
    uploadBytes.mockImplementation(() =>
      Promise.resolve('successfully uploadBytes')
    );

    getAuth.mockImplementation(() => ({
      username: 'YEONGHUN KO',
      currentUser: { username: 'YEONGHUN KO' },
    }));
    createUserWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve({ user: { uid: 'uid' } })
    );
    updateProfile.mockImplementation(() =>
      Promise.resolve('successfully update Profile')
    );

    getDownloadURL.mockImplementation(() => ({ url: 'url.com' }));

    doc.mockImplementation(() => ({ doc: 'doc' }));

    setDoc.mockImplementation(() => Promise.resolve('successfully doc set'));

    collection.mockImplementation(() => 'collection');

    const { getByTestId, getByPlaceholderText, queryByTestId, debug } = render(
      <BrowserRouter>
        <IsProfileEditedContext.Provider
          value={{ setIsProfileEdited: () => {} }}
        >
          <SignUp />
        </IsProfileEditedContext.Provider>
      </BrowserRouter>
    );

    doesUsernameExist.mockImplementation(ds => Promise.resolve(false));

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('username'), {
        target: { value: 'Sinkyo' },
      });
      await fireEvent.change(getByPlaceholderText('fullname'), {
        target: { value: 'YEONGHUN KO' },
      });
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'yhko1988@gmail.com' },
      });
      await fireEvent.change(getByPlaceholderText('Email password'), {
        target: { value: 'password' },
      });
      await fireEvent.change(getByPlaceholderText('your introduction'), {
        target: { value: 'hello:)' },
      });
      const inputFileEle = getByTestId('profile-picture');
      await fireEvent.change(inputFileEle, {
        target: { files: [{ profile: 'profile.png', name: 'my_profile' }] },
      });

      fireEvent.submit(getByTestId('sign-up'));
      expect(document.title).toEqual('Sign up - Instagram');
      expect(doesUsernameExist).toHaveBeenCalled();
      expect(doesUsernameExist).toHaveBeenCalledWith('Sinkyo');

      await waitFor(async () => {
        expect(ref).toHaveBeenCalledWith(
          {
            storage: 'storage',
          },
          'gs://instagram-d02c0.appspot.com/userProfilePicture/uid'
        );
        expect(ref).toHaveBeenCalledWith(
          {
            storage: 'storage',
          },
          'userProfilePicture/uid'
        );
        expect(ref).toHaveBeenCalled();

        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          {
            username: 'YEONGHUN KO',
            currentUser: { username: 'YEONGHUN KO' },
          },
          'yhko1988@gmail.com',
          'password'
        );

        expect(inputFileEle.files[0]).toEqual({
          profile: 'profile.png',
          name: 'my_profile',
        });

        expect(updateProfile).toHaveBeenCalledWith(
          { username: 'YEONGHUN KO' },
          { displayName: 'Sinkyo', photoURL: { url: 'url.com' } }
        );

        expect(doc).toHaveBeenCalledWith('collection');
        expect(setDoc).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);

        expect(getByPlaceholderText('username').value).toBe('Sinkyo');
        expect(getByPlaceholderText('fullname').value).toBe('YEONGHUN KO');
        expect(getByPlaceholderText('Email address').value).toBe(
          'yhko1988@gmail.com'
        );
        expect(getByPlaceholderText('Email password').value).toBe('password');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });

  it('renders the sign up page but username already exists', async () => {
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    doesUsernameExist.mockImplementation(() => Promise.resolve(true));

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('username'), {
        target: { value: 'Sinkyo' },
      });
      await fireEvent.change(getByPlaceholderText('fullname'), {
        target: { value: 'YEONGHUN KO' },
      });
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'yhko1988@gmail.com' },
      });
      await fireEvent.change(getByPlaceholderText('Email password'), {
        target: { value: 'password' },
      });

      const inputFileEle = getByTestId('profile-picture');

      await fireEvent.change(inputFileEle, {
        target: { files: [{ profile: 'profile.png' }] },
      });

      fireEvent.submit(getByTestId('sign-up'));
      expect(document.title).toEqual('Sign up - Instagram');
      expect(doesUsernameExist).toHaveBeenCalled();
      expect(doesUsernameExist).toHaveBeenCalledWith('Sinkyo');

      await waitFor(async () => {
        expect(mockUseNavigate).not.toHaveBeenCalled();

        expect(getByPlaceholderText('username').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });

  it('renders the sign up page but an error is thrown', async () => {
    updateProfile.mockImplementation(() =>
      Promise.reject(new Error('unsuccessful update profile'))
    );

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    doesUsernameExist.mockImplementation(() => Promise.resolve(false));

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('username'), {
        target: { value: 'Sinkyo' },
      });
      await fireEvent.change(getByPlaceholderText('fullname'), {
        target: { value: 'YEONGHUN KO' },
      });
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'yhko1988@gmail.com' },
      });
      await fireEvent.change(getByPlaceholderText('Email password'), {
        target: { value: 'password' },
      });

      const inputFileEle = getByTestId('profile-picture');

      await fireEvent.change(inputFileEle, {
        target: { files: [{ profile: 'profile.png' }] },
      });

      fireEvent.submit(getByTestId('sign-up'));
      expect(document.title).toEqual('Sign up - Instagram');
      expect(doesUsernameExist).toHaveBeenCalled();
      expect(doesUsernameExist).toHaveBeenCalledWith('Sinkyo');

      await waitFor(async () => {
        expect(mockUseNavigate).not.toHaveBeenCalled();
        expect(getByPlaceholderText('username').value).toBe('');
        expect(getByPlaceholderText('fullname').value).toBe('');
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Email password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });
});
