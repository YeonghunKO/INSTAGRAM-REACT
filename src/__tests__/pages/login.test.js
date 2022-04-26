import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../pages/Login';
import * as ROUTES from '../../constants/routes';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn((auth, eamil, password) =>
    Promise.resolve('successfully logged in')
  ),
}));

describe('Log in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the log in page with a form submission and logs the user in', () => {});

  const { getByTestId, getByPlaceholderText, queryByTestId } = render(
    <Router>
      <Login />
    </Router>
  );

  console.log();
});
