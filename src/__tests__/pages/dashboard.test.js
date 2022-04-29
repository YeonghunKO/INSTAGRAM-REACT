import {
  render,
  waitFor,
  fireEvent,
  act,
  getAllByText,
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
      await useUser.mockImplementation(() => ({ activeUser: userFixtures }));
      await usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
      await getSuggestedProfiles.mockImplementation(
        () => suggestedProfilesFixtures
      );

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

      await waitFor(() => {
        const heartSvg = getByTestId('like-photo-494LKmaF03bUcYZ4xhNu');
        const isHeartRed = heartSvg.classList.contains('fill-red');
        // console.log(isHeartRed);
        expect(document.title).toBe('Instagram');
        expect(getAllByText('raphael')).toBeTruthy();
        expect(getAllByAltText('Instagram')).toBeTruthy();
        expect(getByText('sinkyo')).toBeTruthy();
        expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
        expect(getByText('Suggestions for you')).toBeTruthy();

        fireEvent.keyDown(heartSvg, {
          key: 'Enter',
        });
        fireEvent.click(heartSvg);

        expect(isHeartRed).toBe(true);

        // submit valid comment

        // submit invalid comment

        // toggle focus

        // assertions
        // debug();
      });
    });
  });
});
