import PropTypes from 'prop-types';

import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';

import useUser from '../hooks/useUser';

import loggedInContext from '../context/loggedInUser';
import usePhotos from '../hooks/usePhotos';

import loggedInUserContext from '../context/loggedInUser';

function Dashboard({ activeUser = {} }) {
  const { userId, following } = activeUser;

  const [postPhotos, setPostPhotos] = useState([]);
  const [postfollowing, setPostFollowing] = useState([]);

  const { photos } = usePhotos(userId, following);

  useEffect(() => {
    document.title = 'Instagram';
    setPostPhotos(photos);
    setPostFollowing(following);
  }, [photos, following]);
  return (
    <loggedInContext.Provider value={{ activeUser }}>
      <div className="bg-gray-background">
        <Header setPostPhotos={setPostPhotos} />
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg px-4 lg:px-0">
          <Timeline photos={postPhotos} following={postfollowing} />
          <Sidebar setPostFollowing={setPostFollowing} />
        </div>
      </div>
    </loggedInContext.Provider>
  );
}
// setPhotos={setPostPhotos}
// following={postfollowing} photos={postPhotos}
export default Dashboard;

Dashboard.propTypes = {
  activeUser: PropTypes.object,
};
