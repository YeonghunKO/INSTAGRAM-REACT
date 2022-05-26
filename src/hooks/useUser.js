import { useState, useEffect } from 'react';
import { getUserByUid } from '../services/firebase';

// https://firebase.google.com/docs/auth/admin/manage-users 참고
function useUser(userId, isProfileEdited) {
  const [activeUser, setActiveUser] = useState();
  useEffect(() => {
    async function getUserObjByUserId(userId) {
      try {
        const [user] = await getUserByUid(userId);
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
  }, [userId, isProfileEdited]);
  return { activeUser, setActiveUser };
}

export default useUser;
