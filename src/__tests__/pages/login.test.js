import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Login from '../../pages/Login';
import * as ROUTES from '../../constants/routes';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

jest.mock('firebase/auth');

describe('Log in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with a form submission and logs the user in', async () => {
    signInWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve('successfully logged in')
    );

    getAuth.mockImplementation(() => ({ username: 'YEONGHUN KO' }));

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email address'), {
      target: { value: 'yhko1988@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Email password'), {
      target: { value: 'password' },
    });

    fireEvent.submit(getByTestId('login'));
    await act(async () => {
      expect(document.title).toEqual('Login - Instagram');
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        { username: 'YEONGHUN KO' },
        'yhko1988@gmail.com',
        'password'
      );

      await waitFor(() => {
        expect(mockUseNavigate).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe(
          'yhko1988@gmail.com'
        );
        expect(getByPlaceholderText('Email password').value).toBe('password');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });

  it('renders the login page with a for submission and fails to log a user in', async () => {
    signInWithEmailAndPassword.mockImplementation(() =>
      Promise.reject(new Error('Cannot sign in'))
    );
    getAuth.mockImplementation(() => ({ username: 'YEONGHUN KO' }));

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Email address'), {
      target: { value: 'yhko1988.com' },
    });
    fireEvent.change(getByPlaceholderText('Email password'), {
      target: { value: 'passwordblah' },
    });

    fireEvent.submit(getByTestId('login'));

    await act(async () => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        { username: 'YEONGHUN KO' },
        'yhko1988.com',
        'passwordblah'
      );
      expect(signInWithEmailAndPassword).rejects.toThrow('Cannot sign in');
      await waitFor(() => {
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Email password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });
});
