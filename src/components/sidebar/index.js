import { useContext } from 'react';
import UserContext from '../../context/currentUser';
import User from './User';
import Suggestion from './Suggestion';
import useUser from '../../hooks/useUser';

function Sidebar() {
  const { user } = useContext(UserContext);
  const userData = useUser(user.uid);
  const {
    activeUser: {
      docId = '',
      fullName,
      username,
      userId,
      following,
      photoURL,
    } = {},
  } = userData;
  return (
    <div className="p-4">
      <User username={username} fullName={fullName} photoURL={photoURL} />
      <Suggestion
        loggedInUserId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
}

export default Sidebar;
