import {
  render,
  waitFor,
  fireEvent,
  screen,
  act,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Dashboard from '../../pages/Dashboard';

import loggedInContext from '../../context/loggedInUser';
import UserContext from '../../context/currentUser';
import FirebaseContext from '../../context/firebase';
import PostPhotosContext from '../../context/postPhotos';
import originalPhotosContext from '../../context/originalPost';
import UserFollowingContext from '../../context/userFollowing';
import IsProfileEditedContext from '../../context/isProfileEdited';

import useUser from '../../hooks/useUser';
import usePhotos from '../../hooks/usePhotos';

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
} from 'firebase/firestore';

import {
  getSuggestedProfiles,
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
} from '../../services/firebase';

import userFixtures from '../../fixtures/logged-in-user';
import photosFixtures from '../../fixtures/timeline-photos';
import suggestedProfilesFixtures from '../../fixtures/suggested-profiles';
import allUsersFixtures from '../../fixtures/users-for-inputField';

jest.mock('../../hooks/useUser');
jest.mock('../../hooks/usePhotos');
jest.mock('../../services/firebase');

jest.mock('firebase/firestore');

describe('dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render the dashboard and search users and select', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);
    arrayUnion.mockImplementation(() => jest.fn());
    arrayRemove.mockImplementation(() => jest.fn());

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
                    postPhotos: photosFixtures,
                    setPostPhotos: jest.fn(),
                  }}
                >
                  <originalPhotosContext.Provider
                    value={{
                      originalPhotos: photosFixtures,
                      setOriginalPhotos: jest.fn(),
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
                        <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
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

    const searchUserResultContainer = screen.getByTestId(
      'search-users-results-container'
    );

    const searchUserInput = screen.getByPlaceholderText('search user here');
    await waitFor(() => {
      fireEvent.change(searchUserInput, { target: { value: 'r' } });
    });

    await waitFor(() => {
      const searchUserResults = screen.getByTestId('search-users-results');
      expect(searchUserResults.childElementCount).toBe(2);
    });

    // select user using 'Enter' Key
    await waitFor(() => {
      fireEvent.keyUp(searchUserResultContainer, { key: 'ArrowDown' });
      fireEvent.keyUp(searchUserResultContainer, { key: 'ArrowUp' });
      fireEvent.keyUp(searchUserResultContainer, { key: 'ArrowDown' });
    });

    act(() => {
      const searchUserResults = screen.getByTestId('search-users-results');
      fireEvent.keyUp(searchUserResults, { key: 'Enter' });
      const orwellPosts = screen.getAllByText('orwell');
      expect(orwellPosts).toBeTruthy();
    });

    // select user by clicking user
    fireEvent.change(searchUserInput, { target: { value: 'r' } });
    const orwellUser = screen.getByTestId('user-click-4');

    fireEvent.click(orwellUser);
    const orwellPosts = screen.getAllByText('orwell');

    act(() => {
      expect(orwellPosts).toBeTruthy();
    });
  });

  it('renders the dashboard with a user profile and follows a user from the suggested profile', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);
    arrayUnion.mockImplementation(() => jest.fn());
    arrayRemove.mockImplementation(() => jest.fn());

    const {
      container,
      getByText,
      getAllByText,
      getAllByAltText,
      getByTestId,
      debug,
    } = render(
      <Router>
        <FirebaseContext.Provider value={{ db: {} }}>
          <UserContext.Provider
            value={{ user: { uid: 1, displayName: 'sinkyo' } }}
          >
            <loggedInContext.Provider value={{ activeUser: userFixtures }}>
              <PostPhotosContext.Provider
                value={{ postPhotos: photosFixtures, setPostPhotos: jest.fn() }}
              >
                <originalPhotosContext.Provider
                  value={{
                    originalPhotos: photosFixtures,
                    setOriginalPhotos: jest.fn(),
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
                      <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
                    </IsProfileEditedContext.Provider>
                  </UserFollowingContext.Provider>
                </originalPhotosContext.Provider>
              </PostPhotosContext.Provider>
            </loggedInContext.Provider>
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      const heartSvg = getByTestId('like-photo-494LKmaF03bUcYZ4xhNu');
      const isHeartRed = heartSvg.classList.contains('fill-red');
      const focusIcon = getByTestId('focus-icon-494LKmaF03bUcYZ4xhNu');

      const addCommentInput = getByTestId('add-comment-nJMT1l8msuNZ8tH3zvVI');
      const addCommentSubmit = getByTestId(
        'add-comment-submit-nJMT1l8msuNZ8tH3zvVI'
      );
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
    });

    await waitFor(() => {
      const follow = getByTestId('suggested-profile-utH4EadD3gBUbQkdG6Da');
      const viewMore = getByTestId('view-more-494LKmaF03bUcYZ4xhNu');
      fireEvent.click(follow);
      fireEvent.keyDown(viewMore, {
        key: 'Enter',
      });
    });

    const follow = container.querySelector(
      '[data-testid="suggested-profile-utH4EadD3gBUbQkdG6Da"]'
    );
    const viewMore = container.querySelector(
      '[data-testid="view-more-494LKmaF03bUcYZ4xhNu"]'
    );

    expect(follow).toBeFalsy();
    expect(viewMore).toBeFalsy();
  });

  it.only('renders the dashboard and upload a post and delete a post', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);
    arrayUnion.mockImplementation(() => jest.fn());
    arrayRemove.mockImplementation(() => jest.fn());

    const { getByText, getByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ db: {} }}>
          <UserContext.Provider
            value={{ user: { uid: 1, displayName: 'sinkyo' } }}
          >
            <loggedInContext.Provider value={{ activeUser: userFixtures }}>
              <PostPhotosContext.Provider
                value={{ postPhotos: photosFixtures, setPostPhotos: jest.fn() }}
              >
                <originalPhotosContext.Provider
                  value={{
                    originalPhotos: photosFixtures,
                    setOriginalPhotos: jest.fn(),
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
                      <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
                    </IsProfileEditedContext.Provider>
                  </UserFollowingContext.Provider>
                </originalPhotosContext.Provider>
              </PostPhotosContext.Provider>
            </loggedInContext.Provider>
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(async () => {
      const uploadBtn = getByTestId('start-upload-photo');

      fireEvent.click(uploadBtn);
      const uploadDescriptionInput = getByTestId(
        'upload-photo-description'
      ).childNodes[1].querySelector('input');

      const postBtn = getByTestId('post-upload-photo');
      const cancelBtn = getByTestId('cancel-upload-photo');

      fireEvent.change(uploadDescriptionInput, {
        target: { value: 'good day sir!' },
      });
      fireEvent.click(cancelBtn);
      fireEvent.click(uploadBtn);

      // test saved post question modal
      waitFor(() => {
        const confirmModal = getByTestId('saved-question-upload-photo');
        expect(confirmModal).toBeTruthy();

        const savedPostYesBtn = getByText('Yes');
        fireEvent.click(savedPostYesBtn);
        console.log(postBtn);
        fireEvent.click(postBtn);
        const uploadedPost = getByText('good day sir!');
        expect(uploadedPost).toBeTruthy();
      });
    });
  });

  it('renders the dashboard and follow users', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixtures);

    updateLoggedInUserFollowing.mockImplementation(() => jest.fn());
    updateFollowedFollowers.mockImplementation(() => jest.fn());
    updateDoc.mockImplementation(() => jest.fn());

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);
    arrayUnion.mockImplementation(() => jest.fn());
    arrayRemove.mockImplementation(() => jest.fn());

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
                    postPhotos: photosFixtures,
                    setPostPhotos: jest.fn(),
                  }}
                >
                  <originalPhotosContext.Provider
                    value={{
                      originalPhotos: photosFixtures,
                      setOriginalPhotos: jest.fn(),
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
                        <Dashboard user={{ uid: 1, displayName: 'sinkyo' }} />
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
      const suggestedUserDaliFollowBtn = screen.getByTestId(
        'suggested-profile-utH4EadD3gBUbQkdG6Da'
      );
      fireEvent.click(suggestedUserDaliFollowBtn);
      const suggestedUserContainer = screen.getByTestId(
        'suggested-users-container'
      );

      act(() => {
        expect(suggestedUserContainer.childElementCount).toBe(0);
      });
    });
  });

  it('renders the dashboard with a undefined user to trigger fallback', async () => {
    useUser.mockImplementation(() => ({ activeUser: userFixtures }));
    usePhotos.mockImplementation(() => ({ photos: photosFixtures }));
    getSuggestedProfiles.mockImplementation(() => []);

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

    const { getByText } = render(
      <Router>
        <FirebaseContext.Provider value={{ db: {} }}>
          <UserContext.Provider
            value={{
              user: {
                uid: undefined,
                displayName: undefined,
                photoURL: undefined,
              },
            }}
          >
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

    doc.mockImplementation(() => ({}));
    collection.mockImplementation(() => 'collection');
    getDocs.mockImplementation(() => allUsersFixtures);

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
