import PropTypes from 'prop-types';

import { useEffect, useReducer, useContext } from 'react';
import Header from './header';

import Photos from './photos';

import loggedInContext from '../../context/loggedInUser';
import originalPhotosContext from '../../context/originalPost';

function UserProfile({ user }) {
  const { activeUser = {} } = useContext(loggedInContext);
  const { originalPhotos } = useContext(originalPhotosContext);
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
      if (originalPhotos) {
        const photos = originalPhotos.filter(
          photo => photo.username === user.username
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
    }

    if (user && originalPhotos) {
      getUserPhotos();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.userId, originalPhotos]);
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
