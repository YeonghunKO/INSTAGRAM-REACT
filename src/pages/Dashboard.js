import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';

import loggedInContext from '../context/loggedInUser';
import PostPhotosContext from '../context/postPhotos';

import usePhotos from '../hooks/usePhotos';

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
      <PostPhotosContext.Provider value={{ postPhotos, setPostPhotos }}>
        <div className="bg-gray-background">
          <Header setPostPhotos={setPostPhotos} />
          <section className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg px-4 lg:px-0">
            <Timeline photos={postPhotos} following={postfollowing} />
            <Sidebar />
          </section>
        </div>
      </PostPhotosContext.Provider>
    </loggedInContext.Provider>
  );
}

export default Dashboard;

Dashboard.propTypes = {
  activeUser: PropTypes.object,
};
