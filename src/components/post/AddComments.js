import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import UserContext from '../../context/currentUser';

import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';

function AddComments({ docId, comments, setComments, commentInput }) {
  const [comment, setComment] = useState('');
  const {
    user: { displayName },
  } = useContext(UserContext);

  const handleSubmitComment = evt => {
    evt.preventDefault();

    setComments([...comments, { displayName, comment }]);
    // console.log(comment);
    setComment('');

    const suggestedProfileRef = doc(db, 'photos', docId);
    return updateDoc(suggestedProfileRef, {
      comments: arrayUnion({ displayName, comment }),
    });
  };
  return (
    <div className="border-t border-gray-primary">
      <form
        data-testid={`add-comment-submit-${docId}`}
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={evt => {
          if (comment.length >= 1) {
            handleSubmitComment(evt);
          } else {
            evt.preventDefault();
          }
        }}
      >
        <input
          data-testid={`add-comment-${docId}`}
          aria-label="Add a comment"
          autoComplete="off"
          type="text"
          name="add-comment"
          placeholder="Add a comments..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          className="text-sm text-gray-base w-full mr-3 py-5 px-4 focus:outline-none"
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium ${
            !comment && 'opacity-25'
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default AddComments;

AddComments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object,
};
