import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import ContentLoader from 'react-content-loader';
import useUser from '../../hooks/useUser';
import { DEFAULT_IMAGE_PATH } from '../../constants/path';
import UserContext from '../../context/currentUser';

import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';

function Header({
  photosCount,
  followersCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    photoURL,
    username: profileUsername,
  },
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { activeUser } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const activeBtnFollow =
    activeUser?.username && activeUser?.username !== profileUsername;

  const handelToggleFollow = async () => {
    setIsFollowingProfile(prevIsFollowing => !prevIsFollowing);
    setFollowerCount({
      followersCount: isFollowingProfile
        ? followersCount - 1
        : followersCount + 1,
    });
    await toggleFollow(
      activeUser.docId,
      profileDocId,
      profileUserId,
      activeUser.userId,
      isFollowingProfile
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        activeUser?.username,
        profileUserId
      );

      setIsFollowingProfile(!!isFollowing);
    };
    if (activeUser?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [activeUser?.username, profileUserId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {profileUsername ? (
          <img
            className="rounded-full h-40 w-40 flex"
            src={photoURL}
            onError={e => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        ) : (
          <ContentLoader>
            <circle cx="140" cy="75" r="70" />
          </ContentLoader>
        )}
      </div>
      {!followers || !following || !profileUsername ? (
        <ContentLoader>
          <rect x="0" y="40" rx="5" ry="5" width="124" height="23" />
          <rect x="150" y="30" rx="5" ry="5" width="94" height="43" />
          <rect x="0" y="100" rx="5" ry="5" width="74" height="23" />
          <rect x="80" y="100" rx="5" ry="5" width="74" height="23" />
          <rect x="160" y="100" rx="5" ry="5" width="74" height="23" />
        </ContentLoader>
      ) : (
        <div className="flex items-center justify-center flex-col col-span-2 mt-3">
          <div className="container flex items-center">
            <p className="text-2xl mr-7">{profileUsername}</p>
            {activeBtnFollow && (
              <button
                className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                type="button"
                onClick={handelToggleFollow}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handelToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          <div className="container flex mt-4">
            {
              <>
                <p className="mr-10">
                  <span className="font-bold">{photosCount}</span> photos
                </p>
                <p className="mr-10">
                  <span className="font-bold">{followersCount}</span>
                  {` `}
                  {followersCount === 1 ? 'follower' : 'followers'}
                </p>
                <p className="mr-10">
                  <span className="font-bold">{following?.length}</span>{' '}
                  following
                </p>
              </>
            }
          </div>
          <div className="container mt-4">
            <p className="font-bold">{fullName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followersCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    photoURL: PropTypes.string,
  }).isRequired,
};
