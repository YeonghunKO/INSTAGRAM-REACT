import PropTypes from 'prop-types';

import { useEffect } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';

import useUser from '../hooks/useUser';

import loggedInContext from '../context/loggedInUser';

function Dashboard({ user }) {
  const { activeUser } = useUser(user.uid);
  useEffect(() => {
    document.title = 'Instagram';
  }, []);
  return (
    <loggedInContext.Provider value={{ activeUser }}>
      <div className="bg-gray-background">
        <Header />
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
          <Timeline />
          <Sidebar />
        </div>
      </div>
    </loggedInContext.Provider>
  );
}

export default Dashboard;

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};
