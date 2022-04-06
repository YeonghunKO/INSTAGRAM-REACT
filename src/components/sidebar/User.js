import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DEFAULT_IMAGE_PATH } from '../../constants/path';

// react-content-loader로 해봐라 그럼 위치를 조정가능

function User({ username, fullName, photoURL }) {
  // return !username || !fullName ? (
  //   <Skeleton count={1} height={61} />
  // ) : (
  //   <Link
  //     to={`/p/${username}`}
  //     className="grid grid-cols-4 gpa-4 mb-6 items-center"
  //   >
  //     <div className="flex items-center justify-center col-span-1">
  //       <img
  //         className="rounded-full w-13 flex mr-3"
  //         src={photoURL}
  //         alt="username"
  //         onError={e => {
  //           e.target.src = DEFAULT_IMAGE_PATH;
  //         }}
  //       />
  //     </div>
  //     <div className="col-span-3">
  //       <p className="font-bold text-sm">{username}</p>
  //       <p className="text-sm">{fullName}</p>
  //     </div>
  //   </Link>
  // );
  return (
    <>
      <Skeleton
        className="mr-3"
        circle
        height="100%"
        width="20%"
        inline={true}
      />
      <Skeleton
        className="self-center"
        height="50%"
        width="20%"
        inline={true}
      />
    </>
  );
}

export default User;

User.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  photoUrl: PropTypes.string,
};
