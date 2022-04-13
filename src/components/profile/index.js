import PropTypes from 'prop-types';

import { userReducer, useEffect, useReducer } from 'react';
import Header from './header';
import { getUserPhotosByUserId } from '../../services/firebase';

function UserProfile({ user }) {
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
    async function getUserPhotos() {
      const photos = await getUserPhotosByUserId(user?.userId);
      if (photos) {
        dispatch({
          profile: user,
          photosCollection: photos,
          followersCount: user.followers.length,
        });
      }
    }

    if (user) {
      getUserPhotos();
    }
  }, [user?.userId]);
  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followersCount={followersCount}
        setFollowerCount={dispatch}
      />
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
  }),
};
