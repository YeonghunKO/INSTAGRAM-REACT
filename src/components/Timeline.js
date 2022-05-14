import { useState, useEffect, useRef } from 'react';

import { Instagram } from 'react-content-loader';
import Post from '../components/post';

import PropTypes from 'prop-types';

import useScroll from '../hooks/useScroll';

import { debounce } from '../helpers/debounce';

function Timeline({ following, photos }) {
  const [postPhotos, setPostPhotos] = useState([]);
  const [photosSlice, setPhotosSlice] = useState(3);

  const sectionEle = useRef();
  const [scrollY, innerHeight] = useScroll();
  if (
    sectionEle.current &&
    scrollY + innerHeight >= sectionEle.current.offsetHeight
  ) {
    if (photosSlice <= postPhotos?.length) {
      debounce(() => {
        setPhotosSlice(prevSlice => prevSlice + 2);
      }, 300);
    }
  }

  useEffect(() => {
    setPostPhotos(photos);
  }, [photos]);

  return (
    <section ref={sectionEle} className="col-span-3 lg:col-span-2">
      {!postPhotos && !following ? (
        Array.from({ length: 4 }, () => 0).map((_, ind) => (
          <Instagram key={ind} />
        ))
      ) : following?.length === 0 ? (
        <p className="flex justify-center font-bold">
          Follow other people to see Photos
        </p>
      ) : (
        postPhotos &&
        postPhotos
          .slice(0, photosSlice)
          .map(photoObj => <Post key={photoObj.docId} photoObj={photoObj} />)
      )}
    </section>
  );
}

export default Timeline;

Timeline.propTypes = {
  following: PropTypes.array,
  photos: PropTypes.array,
};
