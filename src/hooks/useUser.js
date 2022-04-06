import { useState, useEffect } from 'react';
import { getUserByUid } from '../services/firebase';
// https://firebase.google.com/docs/auth/admin/manage-users 참고
function useUser(userId) {
  const [activeUser, setActiveUser] = useState();
  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUid(userId);
      setActiveUser(user);
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);
  return { activeUser, setActiveUser };
}

export default useUser;
