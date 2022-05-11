import { useState, useContext, useEffect, useRef } from 'react';

import PostPhotosContext from '../context/postPhotos';

import { Instagram } from 'react-content-loader';
import Post from '../components/post';

import PropTypes from 'prop-types';

import useScroll from '../hooks/useScroll';

function Timeline({ following }) {
  let photos = useContext(PostPhotosContext);
  photos = photos.postPhotos;
  const [postPhotos, setPhotos] = useState(photos);
  console.log(postPhotos);
  const sectionEle = useRef();
  const [scrollY, innerHeight] = useScroll();

  if (sectionEle.current) {
    if (scrollY + innerHeight >= sectionEle.current.offsetHeight - 30) {
    }
  }

  return (
    <section ref={sectionEle} className="col-span-3 lg:col-span-2">
      {!postPhotos && !following ? (
        Array.from({ length: 4 }, (v, i) => 0).map((_, ind) => (
          <Instagram key={ind} />
        ))
      ) : following?.length === 0 ? (
        <p className="flex justify-center font-bold">
          Follow other people to see Photos
        </p>
      ) : (
        postPhotos &&
        postPhotos.map(photoObj => (
          <Post key={photoObj.docId} photoObj={photoObj} />
        ))
      )}
    </section>
  );
}

export default Timeline;

Timeline.propTypes = {
  following: PropTypes.array,
};
