import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

import { useState, useRef } from 'react';

import Photo from './photo';

import useScroll from '../../hooks/useScroll';

import { debounce } from '../../helpers/debounce';

function Photos({ photos }) {
  console.log('photos');
  const [windowWidth] = useState(window.innerWidth);
  const [photosSlice, setPhotosSlice] = useState(3);

  const PhotosNotEnd = photosSlice <= photos?.length;

  const photosContainer = useRef();
  const [scrollY, innerHeight] = useScroll(PhotosNotEnd);

  if (
    photosContainer.current &&
    scrollY + innerHeight >= photosContainer.current.offsetHeight
  ) {
    if (PhotosNotEnd) {
      debounce(() => {
        setPhotosSlice(prevSlice => prevSlice + 2);
      }, 300);
    }
  }
  return (
    <>
      <div className="h-16 border-t border-gray-primary mt-12 pt-4">
        {!photos &&
          (windowWidth > 601 ? (
            <ContentLoader viewBox="0 0 380 220">
              <rect x="0" y="0" rx="5" ry="5" width="120" height="100" />
              <rect x="130" y="0" rx="5" ry="5" width="120" height="100" />
              <rect x="260" y="0" rx="5" ry="5" width="120" height="100" />
              <rect x="0" y="110" rx="5" ry="5" width="120" height="100" />
              <rect x="130" y="110" rx="5" ry="5" width="120" height="100" />
              <rect x="260" y="110" rx="5" ry="5" width="120" height="100" />
            </ContentLoader>
          ) : (
            <ContentLoader viewBox="0 0 380 670">
              <rect x="15" y="0" rx="5" ry="5" width="350" height="300" />
              <rect x="15" y="310" rx="5" ry="5" width="350" height="300" />
            </ContentLoader>
          ))}

        {photos?.length ? (
          <div
            data-testid="photos"
            className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-12 px-3 lg:px-0"
            ref={photosContainer}
          >
            {photos?.length
              ? photos
                  .slice(0, photosSlice)
                  .map(photo => <Photo key={photo.docId} photo={photo} />)
              : null}
          </div>
        ) : null}

        {!photos ||
          (photos?.length === 0 && (
            <p className="text-center text-2xl">No Posts Yet</p>
          ))}
      </div>
    </>
  );
}

export default Photos;

Photos.propTypes = {
  photos: PropTypes.array,
};

// ind + 1 === photos.length && 'mb-6'
