import PropTypes from 'prop-types';

import { useState, useContext } from 'react';

import FirebaseContext from '../../context/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import UserContext from '../../context/currentUser';
import originalPhotosContext from '../../context/originalPost';

function Actions({ docId, totalLikes, likedPhoto, handleFocus }) {
  const { user: { uid: userId } = {} } = useContext(UserContext);
  const { originalPhotos, setOriginalPhotos } = useContext(
    originalPhotosContext
  );

  const { db } = useContext(FirebaseContext);

  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);

  const handleToggleLiked = async () => {
    setToggleLiked(prevToggleLiked => !prevToggleLiked);
    setLikes(prevLikes => (toggleLiked ? prevLikes - 1 : prevLikes + 1));

    const suggestedProfileRef = doc(db, 'photos', docId);
    await updateDoc(suggestedProfileRef, {
      likes: toggleLiked ? arrayRemove(userId) : arrayUnion(userId),
    });

    const toggledOriginalPhotos = originalPhotos.map(photo => {
      if (photo.docId === docId) {
        if (!toggleLiked) {
          return {
            ...photo,
            likes: [...photo.likes, userId],
            userLikedPhoto: true,
          };
        } else {
          return {
            ...photo,
            likes: [...photo.likes.filter(likedUser => likedUser !== userId)],
            userLikedPhoto: false,
          };
        }
      }
      return photo;
    });
    setOriginalPhotos(toggledOriginalPhotos);
    // setPostPhotos(toggledOriginalPhotos);
  };
  return (
    <div className="flex justify-between p-4">
      <div className="flex">
        <svg
          data-testid={`like-photo-${docId}`}
          onClick={handleToggleLiked}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleToggleLiked();
            }
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          tabIndex={0}
          className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
            toggleLiked ? 'fill-red text-red-primary' : 'text-black-light'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          data-testid={`focus-icon-${docId}`}
          onClick={handleFocus}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleFocus();
            }
          }}
          className="w-8 text-black-light select-none cursor-pointer focus:outline-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          tabIndex={0}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">
          {likes <= 1 ? `${likes} like` : `${likes} likes`}
        </p>
      </div>
    </div>
  );
}

export default Actions;

Actions.propTypes = {
  docId: PropTypes.string.isRequired,
  totalLikes: PropTypes.number.isRequired,
  likedPhoto: PropTypes.bool.isRequired,
  handleFocus: PropTypes.func.isRequired,
};
