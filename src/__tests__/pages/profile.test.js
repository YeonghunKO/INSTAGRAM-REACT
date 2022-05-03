import {
  render,
  waitFor,
  fireEvent,
  act,
  screen,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Profile from '../../pages/Profile';

import loggedInContext from '../../context/loggedInUser';
import UserContext from '../../context/currentUser';

import useUser from '../../hooks/useUser';

import {
  getUserByUsername,
  getUserPhotosByUserId,
  isUserFollowingProfile,
  toggleFollow,
} from '../../services/firebase';

import { getAuth, signOut } from 'firebase/auth';

import userFixtures from '../../fixtures/logged-in-user';
import profileThatIsFollowedByLoggedInUserFixture from '../../fixtures/profile-followed-by-loggedin-user';
import profileThatIsNotFollowedByLoggedInUserFixture from '../../fixtures/profile-not-followed-by-loggedin-user';
import photosFixtures from '../../fixtures/profile-photos';

import * as ROUTES from '../../constants/routes';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => ({ username: 'orwell' }),
}));

jest.mock('firebase/firestore');
jest.mock('../../services/firebase');
jest.mock('../../hooks/useUser');
jest.mock('firebase/auth');

describe('profile', () => {
  it('renders the profile page with a user profile and follows', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    getUserByUsername.mockImplementation(() => [
      profileThatIsNotFollowedByLoggedInUserFixture,
    ]);
    getUserPhotosByUserId.mockImplementation(() => photosFixtures);

    // didn't follow orwell
    isUserFollowingProfile.mockImplementation(() => false);
    toggleFollow.mockImplementation(() => jest.fn());

    getAuth.mockImplementation(() => ({ user: 'sinkyo' }));
    signOut.mockImplementation(() => jest.fn());

    const { getAllByTestId, getByText, getByTitle, debug } = render(
      <Router>
        <UserContext.Provider
          value={{ user: { uid: 1, displayName: 'sinkyo' } }}
        >
          <loggedInContext.Provider value={{ activeUser: userFixtures }}>
            <Profile />
          </loggedInContext.Provider>
        </UserContext.Provider>
      </Router>
    );

    // debug();
    await act(async () => {
      await waitFor(async () => {
        // 5photos, 3followers, 1following testing
        const profilePhotosEle = getAllByTestId('photo');
        expect(mockUseNavigate).not.toHaveBeenCalled();
        expect(getUserByUsername).toHaveBeenCalledWith('orwell');
        expect(getByText('orwell')).toBeTruthy();
        expect(getByText('George Orwell')).toBeTruthy();
        expect(profilePhotosEle).toBeTruthy();

        screen.getByText((content, node) => {
          const hasText = node => node.textContent === '5 photos';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every(
            child => !hasText(child)
          );
          return nodeHasText && childrenDontHaveText;
        });

        screen.getByText((content, node) => {
          const hasText = node => node.textContent === '0 followers';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every(
            child => !hasText(child)
          );
          return nodeHasText && childrenDontHaveText;
        });

        screen.getByText((content, node) => {
          const hasText = node => node.textContent === '1 following';
          const nodeHasText = hasText(node);
          const childrenDontHavText = Array.from(node.children).every(
            child => !hasText(child)
          );
          return nodeHasText && childrenDontHavText;
        });
        fireEvent.click(getByText('Follow'));
        expect(getByText('Unfollow')).toBeTruthy();

        fireEvent.click(getByTitle('Sign out'));
        fireEvent.keyDown(getByTitle('Sign out'), { key: 'Enter' });
        expect(mockUseNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
      });
    });
  });

  it('renders the profile page with a user profile and unfollows', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    getUserByUsername.mockImplementation(() => [
      profileThatIsFollowedByLoggedInUserFixture,
    ]);
    getUserPhotosByUserId.mockImplementation(() => photosFixtures);
    isUserFollowingProfile.mockImplementation(() => true);
    toggleFollow.mockImplementation(() => jest.fn());

    const { getAllByTestId, getByText, getByTitle, debug } = render(
      <Router>
        <UserContext.Provider
          value={{ user: { uid: 1, displayName: 'sinkyo' } }}
        >
          <loggedInContext.Provider value={{ activeUser: userFixtures }}>
            <Profile />
          </loggedInContext.Provider>
        </UserContext.Provider>
      </Router>
    );

    // debug();
    await act(async () => {
      await waitFor(async () => {
        const profilePhotosEle = getAllByTestId('photo');
        expect(mockUseNavigate).not.toHaveBeenCalled();
        expect(getUserByUsername).toHaveBeenCalledWith('orwell');
        expect(getByText('orwell')).toBeTruthy();
        expect(getByText('George Orwell')).toBeTruthy();
        expect(profilePhotosEle).toBeTruthy();

        fireEvent.keyDown(getByText('Unfollow'), { key: 'Enter' });
        expect(getByText('Follow')).toBeTruthy();
      });
    });
  });

  it('renders the profile page with a undefined user. so redirect triggered ', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    getUserByUsername.mockImplementation(() => [undefined]);

    render(
      <Router>
        <UserContext.Provider
          value={{ user: { uid: 1, displayName: 'sinkyo' } }}
        >
          <loggedInContext.Provider value={{ activeUser: userFixtures }}>
            <Profile />
          </loggedInContext.Provider>
        </UserContext.Provider>
      </Router>
    );
    await waitFor(async () => {
      expect(mockUseNavigate).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(ROUTES.NOT_FOUNT);
    });
  });
});
