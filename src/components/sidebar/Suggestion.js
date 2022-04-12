import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSuggestedProfiles } from '../../services/firebase';
import ContentLoader from 'react-content-loader';
import SuggestedProfile from './SuggestedProfile';

function Suggestions({ loggedInUserId, following, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function setSuggestedProfile() {
      const profiles = await getSuggestedProfiles(loggedInUserId, following);
      setProfiles(profiles);
    }

    if (loggedInUserId) {
      setSuggestedProfile();
    }
  }, [loggedInUserId]);

  return !profiles ? (
    <>
      {Array.from({ length: profiles?.length || 3 }, (v, i) => 0).map(
        (v, i) => (
          <ContentLoader viewBox="0 0 380 70" key={i}>
            <circle cx="30" cy="30" r="30" />
            <rect x="80" y="17" rx="4" ry="4" width="130" height="13" />
          </ContentLoader>
        )
      )}
    </>
  ) : (
    profiles.length > 0 && (
      <div className="rounded flex flex-col">
        <div className="text-sm flex items-center justify-between mb-2">
          <div className="mt-4 grid gap-5 w-full">
            {profiles.map(profile => (
              <SuggestedProfile
                key={profile.docId}
                profileDocId={profile.docId}
                username={profile.username}
                profileId={profile.userId}
                photoURL={profile.photoURL}
                userId={loggedInUserId}
                loggedInUserDocId={loggedInUserDocId}
              />
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default Suggestions;

Suggestions.propTypes = {
  loggedInUserId: PropTypes.string,
  following: PropTypes.array,
  loggedInUserDocId: PropTypes.string,
};
