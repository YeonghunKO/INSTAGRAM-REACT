import { useContext } from 'react';
import User from './User';
import Suggestion from './Suggestion';

import loggedInUserContext from '../../context/loggedInUser';

function Sidebar() {
  const {
    activeUser: {
      docId = '',
      fullName,
      username,
      userId,
      following,
      photoURL,
    } = {},
  } = useContext(loggedInUserContext);

  return (
    <div className="p-4">
      {fullName ? (
        <>
          <User username={username} fullName={fullName} photoURL={photoURL} />
          <div className="font-semibold text-gray-base">
            Suggestions for you
          </div>
          <Suggestion
            loggedInUserId={userId}
            following={following}
            loggedInUserDocId={docId}
          />
        </>
      ) : null}
    </div>
  );
}

export default Sidebar;
