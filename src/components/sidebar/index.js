import { useContext, useState } from 'react';
import User from './User';
import Suggestion from './Suggestion';

import loggedInUserContext from '../../context/loggedInUser';
import UserContext from '../../context/currentUser';

import useUser from '../../hooks/useUser';

function Sidebar() {
  const { user } = useContext(UserContext);

  const {
    activeUser: { username, fullName, photoURL, userId, docId = '' } = {},
  } = useUser(user?.uid, user?.displayName);

  return (
    <section className="p-4 hidden lg:block">
      {fullName ? (
        <>
          <User username={username} fullName={fullName} photoURL={photoURL} />
          <div className="font-semibold text-gray-base">
            Suggestions for you
          </div>
          <Suggestion loggedInUserId={userId} loggedInUserDocId={docId} />
        </>
      ) : null}
    </section>
  );
}

export default Sidebar;
