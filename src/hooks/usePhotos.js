import { useState, useEffect } from 'react';
import { getFollowingPhotos } from '../services/firebase';

function usePhotos(userId, following) {
  const [photos, setPhotos] = useState();
  useEffect(() => {
    async function getTimeLinePhotos() {
      if (following) {
        const followedUserPhotos = await getFollowingPhotos(userId, following);
        console.log(followedUserPhotos);
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(followedUserPhotos);
      }
    }
    getTimeLinePhotos();
  }, [userId, following]);
  return { photos };
}

export default usePhotos;
