import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/Header';
import UserProfile from '../components/profile';

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigation = useNavigate();
  useEffect(() => {
    async function chekcUserExists() {
      try {
        const [user] = await getUserByUsername(username);
        if (user?.userId) {
          setUser(user);
        } else {
          navigation(ROUTES.NOT_FOUNT);
        }
      } catch (error) {
        console.log(error);
      }
    }
    chekcUserExists();
  }, [username, navigation]);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
    </div>
  );
}

export default Profile;
