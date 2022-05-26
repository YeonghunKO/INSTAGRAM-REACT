import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/Header';
import UserProfile from '../components/profile';

import UserFollowingContext from '../context/userFollowing';

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigation = useNavigate();

  const { userFollowing } = useContext(UserFollowingContext);
  useEffect(() => {
    async function chekcUserExists() {
      const [user] = await getUserByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        navigation(ROUTES.NOT_FOUNT);
      }
    }
    chekcUserExists();
  }, [username, navigation, userFollowing]);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile profileUser={user} />
      </div>
    </div>
  );
}

export default Profile;
