import { useState, useEffect } from 'react';
import { getPhotos } from '../services/firebase';

function usePhotos(userId, following) {
  const [photos, setPhotos] = useState();
  useEffect(() => {
    async function getTimeLinePhotos() {
      if (following?.length > 0) {
        const followedUserPhotos = await getPhotos(userId, following);
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(followedUserPhotos);
      }
    }
    getTimeLinePhotos();
  }, [userId, following]);
  return { photos };
}

export default usePhotos;
