import { redner, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from '';

import Dashboard from '../../pages/Dashboard';

import loggedInContext from '../../context/loggedInUser';
import UserContext from '../../context/currentUser';
import FirebaseContext from '../../context/firebase';

import useUser from '../../hooks/useUser';

import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import {
  getUserByUid,
  getFollowingPhotos,
  getSuggestedProfiles,
} from '../../services/firebase';

import userFixtures from '../../fixtures/logged-in-user';
import photosFixtures from '../../fixtures/timeline-photos';
import suggestedProfilesFixtures from '../../fixtures/timeline-photos';

jest.mock('../../hooks/useUser');
jest.mock('../../services/firebase');
jest.mock('firebase/firestore');

describe('dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the dashboard with a user profile and follows a user from the suggested profile', async () => {
    // getUserByUid is service api inside useUser.
    // but you can also mock useUser itself for the exactly the same job.
    getUserByUid.mockImplementation(() => userFixtures);
    getFollowingPhotos.mockImplementation(() => photosFixtures);
    getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);
    doc.mockImplementation(() => ({}));
    arrayUnion.mockImplementation(() => jest.fn());
    arrayRemove.mockImplementation(() => jest.fn());

    const {}
    console.log(user);
    // expec
  });
});
