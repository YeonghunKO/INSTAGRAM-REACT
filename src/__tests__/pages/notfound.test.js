import NotFound from '../../pages/NotFound';

import { render, waitFor } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';

import UserContext from '../../context/currentUser';
import originalPhotosContext from '../../context/originalPost';
import PostPhotosContext from '../../context/postPhotos';

describe('not found', () => {
  it('renders not found page with logged in user', async () => {
    const user = {
      uid: 'uid',
      displayName: 'sinkyo',
      photoURL: 'www.naver.com',
    };
    const { queryByText } = render(
      <Router>
        <UserContext.Provider value={{ user }}>
          <originalPhotosContext.Provider
            value={{ originalPhotos: [], setOriginalPhotos: jest.fn() }}
          >
            <PostPhotosContext.Provider value={{ setPostPhotos: jest.fn() }}>
              <NotFound />
            </PostPhotosContext.Provider>
          </originalPhotosContext.Provider>
        </UserContext.Provider>
      </Router>
    );
    expect(queryByText('Not Found!')).toBeInTheDocument();
    expect(document.title).toBe('Not Foun -Instagram');
    expect(queryByText('Log In')).toBeFalsy();
  });

  it('renders not found page without logged in user', async () => {
    const user = {
      uid: null,
      displayName: null,
      photoURL: null,
    };

    const { queryByText } = render(
      <Router>
        <UserContext.Provider value={{ user }}>
          <originalPhotosContext.Provider
            value={{ originalPhotos: [], setOriginalPhotos: jest.fn() }}
          >
            <PostPhotosContext.Provider value={{ setPostPhotos: jest.fn() }}>
              <NotFound />
            </PostPhotosContext.Provider>
          </originalPhotosContext.Provider>
        </UserContext.Provider>
      </Router>
    );

    expect(queryByText('Not Found!')).toBeInTheDocument();
    expect(document.title).toBe('Not Foun -Instagram');
    expect(queryByText('Log In')).toBeTruthy();
  });
});
