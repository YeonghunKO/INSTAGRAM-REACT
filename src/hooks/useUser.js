import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function useUser(userId) {
  const [activeUser, setActiveUser] = useState();
  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getAuth().getUser(userId);
      console.log(user);
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);
  return { activeUser, setActiveUser };
}

export default useUser;
