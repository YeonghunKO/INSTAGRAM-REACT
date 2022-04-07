import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSuggestedProfiles } from '../../services/firebase';

function Suggestions({ loggedInUserId, following, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function setSuggestedProfile() {
      const profiles = await getSuggestedProfiles(loggedInUserId, following);
      console.log(profiles);
      setProfiles(profiles);
    }

    if (loggedInUserId) {
      setSuggestedProfile();
    }
  }, [loggedInUserId]);

  return <div>Suggestions</div>;
}

export default Suggestions;

Suggestions.propTypes = {
  loggedInUserId: PropTypes.string,
  following: PropTypes.array,
  loggedInUserDocId: PropTypes.string,
};
