import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Login from '../../pages/Login';
import * as ROUTES from '../../constants/routes';

describe('Log in', () => {
  it('first test', () => {
    expect(true).toBeTruthy();
  });
});
