import { useState, useEffect, useContext } from 'react';
import { getUserByUid } from '../services/firebase';
import FirebaseContext from '../context/firebase';

// https://firebase.google.com/docs/auth/admin/manage-users 참고
function useUser(userId, displayName) {
  console.log(userId, displayName);
  const [activeUser, setActiveUser] = useState();
  const firebase = useContext(FirebaseContext);
  useEffect(() => {
    async function getUserObjByUserId(userId) {
      try {
        const [user] = await getUserByUid(userId);
        // console.log(user);
        setActiveUser(user);
      } catch (error) {
        console.log(error);
        setActiveUser([]);
      }
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
    return () => getUserObjByUserId();
  }, [userId, displayName]);
  return { activeUser, setActiveUser };
}

export default useUser;
