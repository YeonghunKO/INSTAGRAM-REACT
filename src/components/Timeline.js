import { useContext } from 'react';
import { Instagram } from 'react-content-loader';
import userContext from '../context/currentUser';
import Post from '../components/post';
import useUser from '../hooks/useUser';
import usePhotos from '../hooks/usePhotos';

function Timeline() {
  const { user } = useContext(userContext);
  const { activeUser: { following } = {} } = useUser(user?.uid);
  const { photos } = usePhotos(user?.uid, following);

  return (
    <div className="col-span-2">
      {!photos ? (
        Array.from({ length: 4 }, (v, i) => 0).map((_, ind) => (
          <Instagram key={ind} />
        ))
      ) : following.length === 0 ? (
        <p className="flex justify-center font-bold">
          Follow other people to see Photos
        </p>
      ) : (
        photos &&
        photos.map(photoObj => (
          <Post key={photoObj.docId} photoObj={photoObj} />
        ))
      )}
    </div>
  );
}

export default Timeline;
