import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
} from '../../services/firebase';

function SuggestedProfile({
  profileDocId,
  username,
  profileId,
  photoURL,
  userId,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false);
  async function handleFollowUser() {
    setFollowed(true);
    updateLoggedInUserFollowing(loggedInUserDocId, profileId, true);
    updateFollowedFollowers(profileId, loggedInUserDocId, false);
  }
  return (
    !followed && (
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center justify-between ">
          <img
            className="rounded-full w-8 flex mr-3"
            src={photoURL}
            alt={username}
            onError={e => (e.target.src = `/images/avatars/default.png`)}
          />
          <Link to={`/p/${username}`}>
            <p className="font-bold text-sm">{username}</p>
          </Link>
        </div>
        <button
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
};
