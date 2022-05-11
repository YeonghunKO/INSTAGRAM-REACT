import PropTypes from 'prop-types';
import { useState } from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import AddComments from './AddComments';

function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
  location,
}) {
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
            data-testid={`view-more-${docId}`}
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
        <p className="text-gray-base font-semibold uppercase text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
        <div className="mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block mr-1 w-3 select-none cursor-pointer focus:outline-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-[12px]">{location}</span>
        </div>
      </div>
      <AddComments
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

export default Comments;

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
};
