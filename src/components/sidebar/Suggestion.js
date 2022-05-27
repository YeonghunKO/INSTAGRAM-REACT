import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getSuggestedProfiles } from '../../services/firebase';
import ContentLoader from 'react-content-loader';
import SuggestedProfile from './SuggestedProfile';

import UserFollowingContext from '../../context/userFollowing';

import Button from '@mui/material/Button';

function Suggestions({ loggedInUserId, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);
  const [profilesSlice, setProfilesSlice] = useState(3);
  const { userFollowing, setUserFollowing } = useContext(UserFollowingContext);

  const handleMoreSuggestionsBtn = () => {
    if (profilesSlice < profiles.length) {
      setProfilesSlice(prevSlice => prevSlice + 3);
    }
  };

  useEffect(() => {
    async function setSuggestedProfile() {
      const profiles = await getSuggestedProfiles(
        loggedInUserId,
        userFollowing
      );
      setProfiles(profiles);
    }

    if (loggedInUserId && userFollowing) {
      setSuggestedProfile();
    }
  }, [loggedInUserId, userFollowing]);

  return !profiles ? (
    <>
      {Array.from({ length: profiles?.length || 3 }, () => 0).map((_, i) => (
        <ContentLoader className="mt-2" viewBox="0 0 380 70" key={i}>
          <circle cx="30" cy="30" r="20" />
          <rect x="320" y="17" rx="4" ry="4" width="60" height="23" />
        </ContentLoader>
      ))}
    </>
  ) : (
    profiles.length > 0 && (
      <div className="rounded flex flex-col">
        <div className="text-sm flex items-center justify-between mb-2">
          <div className="mt-4 grid gap-5 w-full">
            {profiles.slice(0, profilesSlice).map(profile => (
              <SuggestedProfile
                key={profile.docId}
                profileDocId={profile.docId}
                username={profile.username}
                profileId={profile.userId}
                photoURL={profile.photoURL}
                userId={loggedInUserId}
                loggedInUserDocId={loggedInUserDocId}
                setUserFollowing={setUserFollowing}
              />
            ))}
          </div>
        </div>
        <Button
          onClick={handleMoreSuggestionsBtn}
          className="text-xs"
          size="small"
          color="primary"
        >
          view more suggestions
        </Button>
      </div>
    )
  );
}

export default Suggestions;

Suggestions.propTypes = {
  loggedInUserId: PropTypes.string,
  loggedInUserDocId: PropTypes.string,
};
