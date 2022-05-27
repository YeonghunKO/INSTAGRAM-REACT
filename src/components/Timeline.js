import { useState, useEffect, useRef, useContext } from 'react';

import { Instagram } from 'react-content-loader';
import Post from '../components/post';

import PostPhotosContext from '../context/postPhotos';
import UserFollowingContext from '../context/userFollowing';

import useScroll from '../hooks/useScroll';

import { debounce } from '../helpers/debounce';

function Timeline() {
  const { postPhotos } = useContext(PostPhotosContext);
  const { userFollowing } = useContext(UserFollowingContext);

  const [photos, setPhotos] = useState([]);
  const [photosSlice, setPhotosSlice] = useState(3);

  const PhotosNotEnd = photosSlice <= postPhotos?.length;
  const sectionEle = useRef();
  const [scrollY, innerHeight] = useScroll(PhotosNotEnd);
  if (
    sectionEle.current &&
    scrollY + innerHeight >= sectionEle.current.offsetHeight
  ) {
    if (PhotosNotEnd) {
      debounce(() => {
        setPhotosSlice(prevSlice => prevSlice + 2);
      }, 300);
    }
  }

  useEffect(() => {
    setPhotos(postPhotos);
  }, [postPhotos]);

  return (
    <section
      ref={sectionEle}
      className="col-span-3 lg:col-start-2 lg:col-end-4"
    >
      {!photos && !userFollowing ? (
        Array.from({ length: 4 }, () => 0).map((_, ind) => (
          <Instagram key={ind} />
        ))
      ) : photos && photos.length ? (
        photos
          .slice(0, photosSlice)
          .map(photoObj => <Post key={photoObj.docId} photoObj={photoObj} />)
      ) : (
        <p className="flex justify-center font-bold text-4xl">No Posts</p>
      )}
    </section>
  );
}

export default Timeline;
