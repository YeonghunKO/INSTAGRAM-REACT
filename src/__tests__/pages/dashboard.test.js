import { render, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Dashboard from '../../pages/Dashboard';

import loggedInContext from '../../context/loggedInUser';
import UserContext from '../../context/currentUser';
import FirebaseContext from '../../context/firebase';

import useUser from '../../hooks/useUser';
import usePhotos from '../../hooks/usePhotos';

import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import {
  getSuggestedProfiles,
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
} from '../../services/firebase';

import userFixtures from '../../fixtures/logged-in-user';
import photosFixtures from '../../fixtures/timeline-photos';
import suggestedProfilesFixtures from '../../fixtures/suggested-profiles';

jest.mock('../../hooks/useUser');
jest.mock('../../hooks/usePhotos');
jest.mock('../../services/firebase');

jest.mock('firebase/firestore');

describe('dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with a user profile and follows a user from the suggested profile', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    arrayUnion.mockImplementation(() => jest.fn());
    arrayRemove.mockImplementation(() => jest.fn());

    const { getByText, getAllByText, getAllByAltText, getByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ db: {} }}>
          <UserContext.Provider
            value={{ user: { uid: 1, displayName: 'sinkyo' } }}
          >
            <loggedInContext.Provider value={{ activeUser: userFixtures }}>
              <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
            </loggedInContext.Provider>
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      jest.setTimeout(async () => {
        const heartSvg = getByTestId('like-photo-494LKmaF03bUcYZ4xhNu');
        const isHeartRed = heartSvg.classList.contains('fill-red');
        const focusIcon = getByTestId('focus-icon-494LKmaF03bUcYZ4xhNu');

        const addCommentInput = getByTestId('add-comment-nJMT1l8msuNZ8tH3zvVI');
        const addCommentSubmit = getByTestId(
          'add-comment-submit-nJMT1l8msuNZ8tH3zvVI'
        );
        const follow = getByTestId('suggested-profile-utH4EadD3gBUbQkdG6Da');
        const viewMore = getByTestId('view-more-494LKmaF03bUcYZ4xhNu');

        await fireEvent.click(follow);
        await fireEvent.keyDown(viewMore, {
          key: 'Enter',
        });
        fireEvent.keyDown(heartSvg, {
          key: 'Enter',
        });
        fireEvent.click(heartSvg);

        fireEvent.click(focusIcon);
        fireEvent.keyDown(focusIcon, { key: 'Enter' });

        fireEvent.change(addCommentInput, {
          target: { value: 'Great photo!' },
        });

        fireEvent.submit(addCommentSubmit);

        fireEvent.change(addCommentInput, {
          target: { value: '' },
        });

        fireEvent.submit(addCommentSubmit);
        expect(document.title).toBe('Instagram');
        expect(getAllByText('raphael')).toBeTruthy();
        expect(getAllByAltText('Instagram')).toBeTruthy();
        expect(getAllByText('sinkyo')).toBeTruthy();
        expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
        expect(getByText('Suggestions for you')).toBeTruthy();

        expect(getByText('Great photo!')).toBeTruthy();
        expect(isHeartRed).toBe(true);
        expect(viewMore).toBeFalsy();
      });
    });
  });

  it('renders the dashboard with a undefined user to trigger fallback', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => []);

    const { getByText } = render(
      <Router>
        <FirebaseContext.Provider value={{ db: {} }}>
          <UserContext.Provider value={{ user: undefined }}>
            <loggedInContext.Provider value={{ activeUser: userFixtures }}>
              <Dashboard user={userFixtures} />
            </loggedInContext.Provider>
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      const logInEle = getByText('Log In');
      const signUpEle = getByText('Sign Up');
      expect(logInEle).toBeTruthy();
      expect(signUpEle).toBeTruthy();
    });
  });

  it('renders the dashboard with a user but does not have suggested profiles', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => []);

    const { container } = render(
      <Router>
        <FirebaseContext.Provider value={{ db: {} }}>
          <UserContext.Provider value={{ user: { uid: 1 } }}>
            <loggedInContext.Provider value={{ activeUser: userFixtures }}>
              <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
            </loggedInContext.Provider>
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      const suggestedProfileFollowBtn = container.querySelector(
        '[data-testid="suggested-profile-utH4EadD3gBUbQkdG6Da"]'
      );
      expect(suggestedProfileFollowBtn).toBeFalsy();
    });
  });
});
