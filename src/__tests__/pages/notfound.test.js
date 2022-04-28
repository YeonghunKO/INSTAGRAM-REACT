import NotFound from '../../pages/NotFound';

import { render } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';

import UserContext from '../../context/currentUser';

import loggedInUser from '../../fixtures/logged-in-user';

describe('not found', () => {
  it('renders not found page with logged in user', async () => {
    const user = { user: { loggedInUser } };
    const { queryByText } = render(
      <Router>
        <UserContext.Provider value={{ user }}>
          <NotFound />
        </UserContext.Provider>
      </Router>
    );

    expect(queryByText('Not Found!')).toBeInTheDocument();
    expect(document.title).toBe('Not Foun -Instagram');
    expect(queryByText('Log In')).toBeFalsy();
  });

  it('renders not found page without logged in user', async () => {
    const { queryByText } = render(
      <Router>
        <UserContext.Provider value={{ user: null }}>
          <NotFound />
        </UserContext.Provider>
      </Router>
    );

    expect(queryByText('Not Found!')).toBeInTheDocument();
    expect(document.title).toBe('Not Foun -Instagram');
    expect(queryByText('Log In')).toBeTruthy();
  });
});
