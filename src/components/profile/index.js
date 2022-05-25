import PropTypes from 'prop-types';

import { useEffect, useReducer, useContext } from 'react';
import Header from './header';

import Photos from './photos';

import loggedInContext from '../../context/loggedInUser';
import originalPhotosContext from '../../context/originalPost';

function UserProfile({ profileUser }) {
  console.log('UserProfile');

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
          photo => photo.userId === profileUser.userId
        );

        if (photos && isMounted) {
          dispatch({
            profile: profileUser,
            photosCollection: photos.map(photo => ({
              ...photo,
              username: profileUser.username,
              userPhotoUrl: profileUser.photoURL,
            })),
            followersCount: profileUser.followers.length,
          });
        }
      }
    }

    if (profileUser && originalPhotos) {
      getUserPhotos();
    }

    return () => {
      isMounted = false;
    };
  }, [profileUser?.userId, originalPhotos]);
  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followersCount={followersCount}
        userProfileDispatch={dispatch}
        activeUser={activeUser}
      />

      <Photos photos={photosCollection} />
    </>
  );
}

export default UserProfile;

UserProfile.propTypes = {
  profileUser: PropTypes.shape({
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
