import { useState, useEffect } from 'react';
import { getFollowingPhotos } from '../services/firebase';

function usePhotos(userId, following) {
  const [photos, setPhotos] = useState();
  useEffect(() => {
    async function getTimeLinePhotos() {
      if (following?.length > 0) {
        const followedUserPhotos = await getFollowingPhotos(userId, following);
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        console.log('usePhotos', followedUserPhotos);
        setPhotos(followedUserPhotos);
      }
    }
    getTimeLinePhotos();
  }, [userId, following]);
  return { photos };
}

export default usePhotos;
