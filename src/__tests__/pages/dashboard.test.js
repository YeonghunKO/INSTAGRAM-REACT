import {
  render,
  waitFor,
  fireEvent,
  act,
  getAllByText,
  screen,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Dashboard from '../../pages/Dashboard';

import loggedInContext from '../../context/loggedInUser';
import UserContext from '../../context/currentUser';
import FirebaseContext from '../../context/firebase';

import useUser from '../../hooks/useUser';
import usePhotos from '../../hooks/usePhotos';

import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import {
  getUserByUid,
  getFollowingPhotos,
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
    await act(async () => {
      useUser.mockImplementation(() => ({ activeUser: userFixtures }));
      usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

      updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
      updateFollowedFollowers.mockImplementation(() => jest.fn());
      updateDoc.mockImplementation(() => jest.fn());

      doc.mockImplementation(() => ({}));
      arrayUnion.mockImplementation(() => jest.fn());
      arrayRemove.mockImplementation(() => jest.fn());

      const {
        getByText,
        getByAltText,
        getByTitle,
        getAllByText,
        getAllByAltText,
        getByTestId,
        container,

        debug,
      } = render(
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

      debug();
      // assertions
      // debug();

      await waitFor(
        () => {
          const heartSvg = getByTestId('like-photo-494LKmaF03bUcYZ4xhNu');
          const isHeartRed = heartSvg.classList.contains('fill-red');
          // const addCommentInput = getByTestId('add-comment-494LKmaF03bUcYZ4xhNu');
          // const addCommentSubmit = getByTestId(
          //   'add-comment-submit-494LKmaF03bUcYZ4xhNu'
          // );

          const focusIcon = getByTestId('focus-icon-494LKmaF03bUcYZ4xhNu');

          fireEvent.keyDown(heartSvg, {
            key: 'Enter',
          });
          fireEvent.click(heartSvg);

          // heart back to the first status

          // // submit valid comment

          // // toggle focus

          fireEvent.click(focusIcon);
          fireEvent.keyDown(focusIcon, { key: 'Enter' });

          // submit invalid comment

          fireEvent.change(getByTestId('add-comment-494LKmaF03bUcYZ4xhNu'), {
            target: { value: '' },
          });
          fireEvent.submit(
            getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu')
          );

          fireEvent.change(getByTestId('add-comment-494LKmaF03bUcYZ4xhNu'), {
            target: { value: 'Amazing photos!' },
          });

          fireEvent.submit(
            getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu')
          );
          // const follow = getByTestId('suggested-profile-utH4EadD3gBUbQkdG6Da');
          // const viewMore = getByTestId('view-more-494LKmaF03bUcYZ4xhNu');
          // fireEvent.click();
          // fireEvent.keyDown(, {
          //   key: 'Enter',
          // });
          // console.log(viewMore);

          expect(document.title).toBe('Instagram');
          expect(getAllByText('raphael')).toBeTruthy();
          expect(getAllByAltText('Instagram')).toBeTruthy();
          expect(getAllByText('sinkyo')).toBeTruthy();
          expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
          expect(getByText('Suggestions for you')).toBeTruthy();

          expect(getByText('Amazing photos!')).toBeTruthy();

          expect(isHeartRed).toBe(true);
        },
        { timeout: 4000 }
      );
    });
  });

  it.only('renders the dashboard with a user profile and follows a user from the suggested profile', async () => {
    await act(async () => {
      useUser.mockImplementation(() => ({ activeUser: undefined }));
      usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

      updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
      updateFollowedFollowers.mockImplementation(() => jest.fn());
      updateDoc.mockImplementation(() => jest.fn());

      doc.mockImplementation(() => ({}));
      arrayUnion.mockImplementation(() => jest.fn());
      arrayRemove.mockImplementation(() => jest.fn());

      const {
        getByText,
        getByAltText,
        getByTitle,
        getAllByText,
        getAllByAltText,
        getByTestId,
        container,

        debug,
      } = render(
        <Router>
          <FirebaseContext.Provider value={{ db: {} }}>
            <UserContext.Provider
              value={{ user: { uid: 1, displayName: 'sinkyo' } }}
            >
              <loggedInContext.Provider value={{ activeUser: undefined }}>
                <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
              </loggedInContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      debug();
      // assertions
      // debug();

      await waitFor(() => {
        expect(getByText('Login')).toBeTruthy();
        expect(getByText('Sign Up')).toBeTruthy();
      });
    });
  });
});
