import { useContext, useState } from 'react';
import User from './User';
import Suggestion from './Suggestion';

import loggedInContext from '../../context/loggedInUser';
function Sidebar() {
  const {
    activeUser: { username, fullName, photoURL, userId, docId = '' } = {},
  } = useContext(loggedInContext);
  return (
    <section className="xs:px-4 col-span-3 lg:col-span-1">
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
