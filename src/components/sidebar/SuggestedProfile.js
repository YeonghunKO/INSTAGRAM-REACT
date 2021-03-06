import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
} from '../../services/firebase';

function SuggestedProfile({
  profileDocId = '',
  username = '',
  profileId = '',
  photoURL = '',
  userId = '',
  loggedInUserDocId = '',
  setUserFollowing,
}) {
  const [followed, setFollowed] = useState(false);

  async function handleFollowUser() {
    setFollowed(true);
    updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    updateFollowedFollowers(profileDocId, userId, false);
    setUserFollowing(prevFollowing => [...prevFollowing, profileId]);
  }

  return (
    !followed && (
      <div className="flex flex-row items-center justify-between mt-4">
        <div className="flex items-center justify-between ">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={photoURL}
            alt={username}
            onError={e => (e.target.src = `/images/avatars/default.png`)}
          />
          <Link to={`/p/${username}`}>
            <p className="font-bold text-sm">{username}</p>
          </Link>
        </div>
        <button
          data-testid={`suggested-profile-${profileDocId}`}
          className="text-sm font-bold text-blue-medium"
          type="button"
          onClick={handleFollowUser}
        >
          Follow
        </button>
      </div>
    )
  );
}

export default SuggestedProfile;

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
  setUserFollowing: PropTypes.func,
};
