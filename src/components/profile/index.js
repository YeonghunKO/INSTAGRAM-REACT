import PropTypes from 'prop-types';

import { useEffect, useReducer, useContext } from 'react';
import Header from './header';
import { getUserPhotosByUserId } from '../../services/firebase';

import Photos from './photos';

import loggedInContext from '../../context/loggedInUser';

function UserProfile({ user }) {
  const { activeUser = {} } = useContext(loggedInContext);
  const reducer = (prevState, newState) => ({ ...prevState, ...newState });
  const initState = {
    profile: {},
    photosCollection: null,
    followersCount: 0,
  };

  const [{ profile, photosCollection, followersCount }, dispatch] = useReducer(
    reducer,
    initState
  );

  useEffect(() => {
    let isMounted = true;
    async function getUserPhotos() {
      const photos = await getUserPhotosByUserId(
        user?.userId,
        activeUser?.userId
      );
      if (photos && isMounted) {
        dispatch({
          profile: user,
          photosCollection: photos.map(photo => ({
            ...photo,
            username: user.username,
            userPhotoUrl: user.photoURL,
          })),
          followersCount: user.followers.length,
        });
      }
    }

    if (user) {
      getUserPhotos();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.userId]);
  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followersCount={followersCount}
        setFollowerCount={dispatch}
        activeUser={activeUser}
      />

      <Photos photos={photosCollection} />
    </>
  );
}

export default UserProfile;

UserProfile.propTypes = {
  user: PropTypes.shape({
    dateCreated: PropTypes.number,
    emailAddress: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    fullName: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};
