import { useState } from 'react';

import {
  render,
  waitFor,
  fireEvent,
  act,
  screen,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { renderHook } from '@testing-library/react-hooks';

import Profile from '../../pages/Profile';

import UserContext from '../../context/currentUser';
import loggedInContext from '../../context/loggedInUser';
import PostPhotosContext from '../../context/postPhotos';
import originalPhotosContext from '../../context/originalPost';
import UserFollowingContext from '../../context/userFollowing';
import IsProfileEditedContext from '../../context/isProfileEdited';
import FirebaseContext from '../../context/firebase';

import useUser from '../../hooks/useUser';

import {
  getUserByUsername,
  isUserFollowingProfile,
  toggleFollow,
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
} from '../../services/firebase';

import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';

import { getAuth, signOut, updateProfile } from 'firebase/auth';

import userFixtures from '../../fixtures/logged-in-user';
import profileThatIsFollowedByLoggedInUserFixture from '../../fixtures/profile-followed-by-loggedin-user';
import profileThatIsNotFollowedByLoggedInUserFixture from '../../fixtures/profile-not-followed-by-loggedin-user';
import photosFixtures from '../../fixtures/profile-photos';
import allUsersFixtures from '../../fixtures/users-for-inputField';

import * as ROUTES from '../../constants/routes';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => ({ username: 'raphael' }),
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

    isUserFollowingProfile.mockImplementation(() => false);
    toggleFollow.mockImplementation(() => jest.fn());

    getAuth.mockImplementation(() => ({ user: 'sinkyo' }));
    signOut.mockImplementation(() => jest.fn());

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

    const { result } = renderHook(() => {
      const [photos, setPhotos] = useState(photosFixtures);

      return { photos, setPhotos };
    });

    const { getByTestId, getByText, getByTitle } = render(
      <Router>
        <UserContext.Provider
          value={{ user: { uid: 1, displayName: 'sinkyo' } }}
        >
          <loggedInContext.Provider value={{ activeUser: userFixtures }}>
            <PostPhotosContext.Provider
              value={{
                postPhotos: result.current.photos,
                setPostPhotos: result.current.setPhotos,
              }}
            >
              <originalPhotosContext.Provider
                value={{
                  originalPhotos: result.current.photos,
                  setOriginalPhotos: result.current.setPhotos,
                }}
              >
                <UserFollowingContext.Provider
                  value={{
                    userFollowing: [1, 2, 3, 4, 5],
                    setUserFollowing: jest.fn(),
                  }}
                >
                  <IsProfileEditedContext.Provider
                    value={{
                      isProfileEdited: false,
                      setIsProfileEdited: jest.fn(),
                    }}
                  >
                    <Profile />
                  </IsProfileEditedContext.Provider>
                </UserFollowingContext.Provider>
              </originalPhotosContext.Provider>
            </PostPhotosContext.Provider>
          </loggedInContext.Provider>
        </UserContext.Provider>
      </Router>
    );

    await act(async () => {
      await waitFor(async () => {
        // 5photos, 3followers, 1following testing
        const profilePhotosEle = getByTestId('photos');
        expect(getUserByUsername).toHaveBeenCalledWith('raphael');
        expect(getByText('raphael')).toBeTruthy();
        expect(getByText('santonio raphael')).toBeTruthy();
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
    isUserFollowingProfile.mockImplementation(() => true);
    toggleFollow.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

    const { result } = renderHook(() => {
      const [photos, setPhotos] = useState(photosFixtures);

      return { photos, setPhotos };
    });

    const { getByText } = render(
      <Router>
        <UserContext.Provider
          value={{ user: { uid: 1, displayName: 'sinkyo' } }}
        >
          <loggedInContext.Provider value={{ activeUser: userFixtures }}>
            <PostPhotosContext.Provider
              value={{
                postPhotos: result.current.photos,
                setPostPhotos: result.current.setPhotos,
              }}
            >
              <originalPhotosContext.Provider
                value={{
                  originalPhotos: result.current.photos,
                  setOriginalPhotos: result.current.setPhotos,
                }}
              >
                <UserFollowingContext.Provider
                  value={{
                    userFollowing: [1, 2, 3, 4, 5],
                    setUserFollowing: jest.fn(),
                  }}
                >
                  <IsProfileEditedContext.Provider
                    value={{
                      isProfileEdited: false,
                      setIsProfileEdited: jest.fn(),
                    }}
                  >
                    <Profile />
                  </IsProfileEditedContext.Provider>
                </UserFollowingContext.Provider>
              </originalPhotosContext.Provider>
            </PostPhotosContext.Provider>
          </loggedInContext.Provider>
        </UserContext.Provider>
      </Router>
    );

    // debug();
    await act(async () => {
      await waitFor(async () => {
        fireEvent.keyDown(getByText('Unfollow'), { key: 'Enter' });
        expect(getByText('Follow')).toBeTruthy();
      });
    });
  });

  it('renders the profile page with a undefined user. so redirect triggered ', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    getUserByUsername.mockImplementation(() => [undefined]);

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

    const { result } = renderHook(() => {
      const [photos, setPhotos] = useState(photosFixtures);

      return { photos, setPhotos };
    });
    render(
      <Router>
        <UserContext.Provider
          value={{ user: { uid: 1, displayName: 'sinkyo' } }}
        >
          <loggedInContext.Provider value={{ activeUser: userFixtures }}>
            <PostPhotosContext.Provider
              value={{
                postPhotos: result.current.photos,
                setPostPhotos: result.current.setPhotos,
              }}
            >
              <originalPhotosContext.Provider
                value={{
                  originalPhotos: result.current.photos,
                  setOriginalPhotos: result.current.setPhotos,
                }}
              >
                <UserFollowingContext.Provider
                  value={{
                    userFollowing: [1, 2, 3, 4, 5],
                    setUserFollowing: jest.fn(),
                  }}
                >
                  <IsProfileEditedContext.Provider
                    value={{
                      isProfileEdited: false,
                      setIsProfileEdited: jest.fn(),
                    }}
                  >
                    <Profile />
                  </IsProfileEditedContext.Provider>
                </UserFollowingContext.Provider>
              </originalPhotosContext.Provider>
            </PostPhotosContext.Provider>
          </loggedInContext.Provider>
        </UserContext.Provider>
      </Router>
    );

    await waitFor(async () => {
      expect(mockUseNavigate).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(ROUTES.NOT_FOUNT);
    });
  });

  it('render the profile page and click photo and navigate it', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    getUserByUsername.mockImplementation(() => [
      profileThatIsNotFollowedByLoggedInUserFixture,
    ]);

    isUserFollowingProfile.mockImplementation(() => false);
    toggleFollow.mockImplementation(() => jest.fn());

    getAuth.mockImplementation(() => ({ user: 'sinkyo' }));
    signOut.mockImplementation(() => jest.fn());

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

    const { result } = renderHook(() => {
      const [photos, setPhotos] = useState(photosFixtures);

      return { photos, setPhotos };
    });

    await waitFor(() => {
      render(
        <Router>
          <FirebaseContext.Provider value={{ db: {} }}>
            <UserContext.Provider
              value={{ user: { uid: 1, displayName: 'sinkyo' } }}
            >
              <loggedInContext.Provider value={{ activeUser: userFixtures }}>
                <PostPhotosContext.Provider
                  value={{
                    postPhotos: result.current.photos,
                    setPostPhotos: result.current.setPhotos,
                  }}
                >
                  <originalPhotosContext.Provider
                    value={{
                      originalPhotos: result.current.photos,
                      setOriginalPhotos: result.current.setPhotos,
                    }}
                  >
                    <UserFollowingContext.Provider
                      value={{
                        userFollowing: [1, 2, 3, 4, 5],
                        setUserFollowing: jest.fn(),
                      }}
                    >
                      <IsProfileEditedContext.Provider
                        value={{
                          isProfileEdited: false,
                          setIsProfileEdited: jest.fn(),
                        }}
                      >
                        <Profile />
                      </IsProfileEditedContext.Provider>
                    </UserFollowingContext.Provider>
                  </originalPhotosContext.Provider>
                </PostPhotosContext.Provider>
              </loggedInContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    await waitFor(() => {
      const photo = screen.getByTestId('photo-0');
      fireEvent.click(photo);
    });

    const prevPostBtn = screen.getByTestId('prevPostBtn');
    const nextPostBtn = screen.getByTestId('nextPostBtn');
    const closePostBtn = screen.getByTestId('closePostBtn');

    fireEvent.click(prevPostBtn);
    fireEvent.click(prevPostBtn);
    fireEvent.click(nextPostBtn);
    fireEvent.click(nextPostBtn);
    fireEvent.click(nextPostBtn);
    fireEvent.click(nextPostBtn);
    fireEvent.click(nextPostBtn);
    fireEvent.click(closePostBtn);
  });

  it('render the my profile page and edit profile information', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    getUserByUsername.mockImplementation(() => [
      profileThatIsNotFollowedByLoggedInUserFixture,
    ]);

    isUserFollowingProfile.mockImplementation(() => false);
    toggleFollow.mockImplementation(() => jest.fn());

    getAuth.mockImplementation(() => ({ user: 'sinkyo' }));
    signOut.mockImplementation(() => jest.fn());

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());
    updateProfile.mockImplementation(() =>
      Promise.resolve('succesfully updated')
    );

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

    const { result } = renderHook(() => {
      const [photos, setPhotos] = useState(photosFixtures);

      return { photos, setPhotos };
    });

    await waitFor(() => {
      render(
        <Router>
          <FirebaseContext.Provider value={{ db: {} }}>
            <UserContext.Provider
              value={{ user: { uid: 1, displayName: 'sinkyo' } }}
            >
              <loggedInContext.Provider
                value={{ activeUser: { username: 'raphael', userId: 2 } }}
              >
                <PostPhotosContext.Provider
                  value={{
                    postPhotos: result.current.photos,
                    setPostPhotos: result.current.setPhotos,
                  }}
                >
                  <originalPhotosContext.Provider
                    value={{
                      originalPhotos: result.current.photos,
                      setOriginalPhotos: result.current.setPhotos,
                    }}
                  >
                    <UserFollowingContext.Provider
                      value={{
                        userFollowing: [1, 2, 3, 4, 5],
                        setUserFollowing: jest.fn(),
                      }}
                    >
                      <IsProfileEditedContext.Provider
                        value={{
                          isProfileEdited: false,
                          setIsProfileEdited: jest.fn(),
                        }}
                      >
                        <Profile />
                      </IsProfileEditedContext.Provider>
                    </UserFollowingContext.Provider>
                  </originalPhotosContext.Provider>
                </PostPhotosContext.Provider>
              </loggedInContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    await waitFor(() => {
      const editProfileBtn = screen.getByTestId('edit-profile-btn');
      fireEvent.click(editProfileBtn);

      const usernameEditInput = screen
        .getByTestId('edit-profile-username')
        .childNodes[1].querySelector('input');
      const fullNameEditInput = screen
        .getByTestId('edit-profile-fullName')
        .childNodes[1].querySelector('input');
      const introductionEditInput = screen
        .getByTestId('edit-profile-introduction')
        .childNodes[1].querySelector('input');
      const editProfileConfirmBtn = screen.getByTestId('edit-profile-confirm');

      act(() => {
        fireEvent.change(usernameEditInput, { target: { value: 'harry' } });
        fireEvent.change(fullNameEditInput, {
          target: { value: 'Harry Potter' },
        });
        fireEvent.change(introductionEditInput, {
          target: { value: "I'm Harry. Nice to meet you" },
        });

        fireEvent.click(editProfileConfirmBtn);
      });
    });
  });
});
