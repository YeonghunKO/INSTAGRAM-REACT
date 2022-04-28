import { render, fireEvent, waitFor, act } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { BrowserRouter, useNavigate } from 'react-router-dom';
import SignUp from '../../pages/Signup';
import * as ROUTES from '../../constants/routes';

import { doesUsernameExist } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';

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
    // BrowserRouter.mockImplementation(props => {
    //   return 'broswer';
    // });
    // useNavigate.mockImplementation(() => {});
    getStorage.mockImplementation(() => ({
      storage: 'storage',
    }));
    ref.mockImplementation(() => ({ ref: 'ref' }));
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

    // useNavigate.mockImplementation(() => jest.fn());

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
        expect(ref).toHaveBeenCalledWith(
          {
            storage: 'storage',
          },
          'userProfilePicture/Sinkyo'
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

        expect(inputFileEle.files[0]).toEqual({ profile: 'profile.png' });

        expect(updateProfile).toHaveBeenCalledWith(
          { username: 'YEONGHUN KO' },
          { displayName: 'Sinkyo', photoURL: { url: 'url.com' } }
        );

        expect(doc).toHaveBeenCalledWith({ db: 'db' }, 'users', 'Sinkyo');
        expect(setDoc).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);

        expect(getByPlaceholderText('username').value).toBe('Sinkyo');
      });
    });
  });
});
