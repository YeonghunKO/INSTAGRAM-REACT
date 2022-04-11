import PropTypes from 'prop-types';
import { useState } from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';

function Comments({ docId, comments: allComments, posted, commentInput }) {
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);
  const showNextComments = () => {
    setCommentsSlice(prevCommentsSlice => prevCommentsSlice + 3);
  };
  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map(item => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link to={`/p/${item.displayName}`}>
              <span className="mr-2 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
            onKeyDown={evt => {
              if (evt.key === 'Enter') {
                showNextComments();
              }
            }}
          >
            view more comments
          </button>
        )}
      </div>
      <p className="text-gray-base font-semibold uppercase text-xs mt-2 p-3">
        {formatDistance(posted, new Date())} ago
      </p>
    </>
  );
}

export default Comments;
