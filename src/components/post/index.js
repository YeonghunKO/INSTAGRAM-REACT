import { useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Actions from './Actions';
import Footer from './Footer';
import Comments from './Comments';

function Post({ photoObj, isProfile }) {
  const {
    username,
    imageSrc,
    caption,
    docId,
    userLikedPhoto,
    likes,
    comments,
    dateCreated,
    userPhotoUrl,
    location,
  } = photoObj;
  console.log(docId);
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();
  return (
    <div
      className={`flex flex-col justify-between ${
        isProfile && 'overflow-y-scroll'
      } rounded border ${isProfile && 'h-full'} w-full ${
        isProfile ? 'lg:w-full' : 'lg:w-9/12'
      } bg-white border-gray-primary mb-12 scrollbar`}
    >
      <div>
        <Header
          docId={docId}
          postUsername={username}
          userPhotoUrl={userPhotoUrl}
        />
        <img src={imageSrc} alt={caption} className="w-full" />
        <Actions
          docId={docId}
          // eslint-disable-next-line react/prop-types
          totalLikes={likes.length}
          likedPhoto={userLikedPhoto}
          handleFocus={handleFocus}
        />
        <Footer caption={caption} username={username} />
      </div>
      <div>
        <Comments
          docId={docId}
          comments={comments}
          posted={dateCreated}
          commentInput={commentInput}
          location={location}
        />
      </div>
    </div>
  );
}

export default memo(Post);

Post.propTypes = {
  photoObj: PropTypes.shape({
    username: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired,
    userLikedPhoto: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    userPhotoUrl: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }),
  isProfile: PropTypes.bool,
};
