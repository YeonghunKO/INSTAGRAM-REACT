import PropTypes from 'prop-types';

function SuggestedUsers({
  photoURL,
  userId,
  username,
  userPos,
  cursorPos,
  filterPostbyUserId,
}) {
  return (
    <div
      data-testid={`user-click-${userId}`}
      className={`rounded flex p-2 flex-row items-center justify-between ${
        userPos === cursorPos && 'bg-gray-primary'
      } hover:bg-gray-primary hover:cursor-pointer`}
      onClick={() => filterPostbyUserId(userId)}
    >
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
  );
}

export default SuggestedUsers;

SuggestedUsers.propTypes = {
  photoURL: PropTypes.string,
  username: PropTypes.string,
  userPos: PropTypes.number,
  cursorPos: PropTypes.number,
  userId: PropTypes.string,
  filterPostbyUserId: PropTypes.func,
};
