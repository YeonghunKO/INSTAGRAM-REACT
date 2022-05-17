import PropTypes from 'prop-types';

import { useEffect, useContext } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';

import PostPhotosContext from '../context/postPhotos';


function Dashboard({ activeUser = {} }) {
  const { following } = activeUser;

  const { postPhotos, setPostPhotos } = useContext(PostPhotosContext);
  useEffect(() => {
    document.title = 'Instagram';
  }, []);
  return (
    <div className="bg-gray-background">
      <Header setPostPhotos={setPostPhotos} />
      <aside className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg px-4 lg:px-0">
        <Timeline photos={postPhotos} following={following} />
        <Sidebar />
      </aside>
    </div>
  );
}

export default Dashboard;

Dashboard.propTypes = {
  activeUser: PropTypes.object,
};
