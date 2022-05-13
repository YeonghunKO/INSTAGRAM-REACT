import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function SuggestedUsers({ photoURL, username }) {
  return (
    <Link to={`/p/${username}`}>
      <div className="rounded flex p-2 flex-row items-center justify-between hover:bg-gray-primary">
        <div className="flex items-center justify-between ">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={photoURL}
            alt={username}
            onError={e => (e.target.src = `/images/avatars/default.png`)}
          />

          <p className="font-bold text-sm">{username}</p>
        </div>
      </div>
    </Link>
  );
}

export default SuggestedUsers;

SuggestedUsers.propTypes = {
  photoURL: PropTypes.string,
  username: PropTypes.string,
};
