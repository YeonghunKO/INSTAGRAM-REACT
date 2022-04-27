import {
  render,
  fireEvent,
  waitFor,
  act,
  createEvent,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import SignUp from '../../pages/Signup';
import * as ROUTES from '../../constants/routes';

import { doesUsernameExist } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';

import { db } from '../../lib/firebase';

import { doc, setDoc } from 'firebase/firestore';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { wait } from '@testing-library/user-event/dist/utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../services/firebase');

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('sign up', () => {
  let file;
  beforeEach(() => {
    jest.clearAllMocks();
    file = new File([], 'profilePicture.png', { type: 'image/png' });
  });
  it('renders the sign up page with a form submission and signs a user up', async () => {
    getStorage.mockImplementation(() => ({
      storage: 'storage',
      currentUser: { currentUser: 'YEONGHUN KO' },
    }));
    ref.mockImplementation(() => ({ ref: 'ref' }));
    uploadBytes.mockImplementation(() =>
      Promise.resolve('successfully uploadBytes')
    );

    getAuth.mockImplementation(() => ({ username: 'YEONGHUN KO' }));
    createUserWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve('successfully created user')
    );
    updateProfile.mockImplementation(() =>
      Promise.resolve('successfully update Profile')
    );

    // db.mockImplementation(() => ({ db: 'db' }));

    doc.mockImplementation(() => ({ doc: 'doc' }));
    setDoc.mockImplementation(() => Promise.resolve('successfully doc set'));

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <SignUp />
      </Router>
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
      //   await userEvent.upload(inputFileEle, file);

      fireEvent.submit(getByTestId('sign-up'));

      await waitFor(async () => {
        expect(document.title).toEqual('Sign up - Instagram');
        expect(doesUsernameExist).toHaveBeenCalled();
        expect(doesUsernameExist).toHaveBeenCalledWith('Sinkyo');

        expect(ref).toHaveBeenCalledWith(
          {
            storage: 'storage',
            currentUser: { currentUser: 'YEONGHUN KO' },
          },
          'userProfilePicture/Sinkyo'
        );
        expect(ref).toHaveBeenCalled();

        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          { username: 'YEONGHUN KO' },
          'yhko1988@gmail.com',
          'password'
        );

        expect(inputFileEle.files[0]).toEqual({ profile: 'profile.png' });

        // expect(updateProfile).toHaveBeenCalledWith();

        // expect(doc).toHaveBeenCalled();

        // expect(setDoc).toHaveBeenCalled();
        // expect(setDoc).toHaveBeenCalledWith(
        //   { doc: 'doc' },
        //   {},
        //   { merge: true }
        // );
      });
    });
  });
});
