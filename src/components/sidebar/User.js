import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import { DEFAULT_IMAGE_PATH } from '../../constants/path';

// react-content-loader로 해봐라 그럼 위치를 조정가능

function User({ username, fullName, photoURL }) {
  return !username || !fullName ? (
    <ContentLoader viewBox="0 0 380 120">
      <circle cx="40" cy="40" r="40" />
      <rect x="120" y="37" rx="4" ry="4" width="100" height="13" />
      <rect x="120" y="60" rx="3" ry="3" width="150" height="10" />
    </ContentLoader>
  ) : (
    <Link
      to={`/p/${username}`}
      className="grid grid-cols-4 gpa-4 mb-6 items-center"
    >
      <div className="flex items-center justify-center col-span-1">
        <img
          className="rounded-full w-12 h-12 flex mr-3"
          src={photoURL}
          alt="username"
          onError={e => {
            e.target.src = DEFAULT_IMAGE_PATH;
          }}
        />
      </div>
      <div className="col-span-3">
        <p className="font-bold text-sm">{username}</p>
        <p className="text-sm">{fullName}</p>
      </div>
    </Link>
  );
}

export default User;

User.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  photoURL: PropTypes.string,
};
