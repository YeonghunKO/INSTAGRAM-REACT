import { useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Actions from './Actions';
import Footer from './Footer';
import Comments from './Comments';

function Post({ photoObj }) {
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
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();
  return (
    <div className="rounded border w-full lg:w-9/12 bg-white border-gray-primary mb-12">
      <Header username={username} userPhotoUrl={userPhotoUrl} />
      <img src={imageSrc} alt={caption} className="w-full" />
      <Actions
        docId={docId}
        // eslint-disable-next-line react/prop-types
        totalLikes={likes.length}
        likedPhoto={userLikedPhoto}
        handleFocus={handleFocus}
      />
      <Footer caption={caption} username={username} />
      <Comments
        docId={docId}
        comments={comments}
        posted={dateCreated}
        commentInput={commentInput}
        location={location}
      />
    </div>
  );
}

export default Post;

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
  }),
};
