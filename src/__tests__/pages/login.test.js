import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Login from '../../pages/Login';
import * as ROUTES from '../../constants/routes';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// var mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('firebase/auth');

describe('Log in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the log in page with a form submission and logs the user in', async () => {
    signInWithEmailAndPassword.mockImplementation(() =>
      Promise.resove('successfully logged in')
    );

    getAuth.mockImplementation(() => ({ username: 'YEONGHUN KO' }));

    // useNavigate.mockImplementation(path => path => {});

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <Login />
      </Router>
    );

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'yhko1988@gmail.com' },
      });

      await fireEvent.change(getByPlaceholderText('Email password'), {
        target: { value: 'password' },
      });

      fireEvent.submit(getByTestId('login'));
      expect(document.title).toEqual('Login - Instagram');
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        { username: 'YEONGHUN KO' },
        'yhko1988@gmail.com',
        'password'
      );
      expect(useNavigate).toHaveBeenCalled(2);
      await waitFor(() => {
        //
        expect(useNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
      });
    });
  });
});
