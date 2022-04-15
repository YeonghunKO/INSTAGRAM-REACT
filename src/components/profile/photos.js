import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

function Photos({ photos }) {
  return (
    <>
      <div className="h-16 border-t border-gray-primary mt-12 pt-4">
        {!photos && (
          <ContentLoader viewBox="0 0 380 220">
            <rect x="0" y="0" rx="5" ry="5" width="120" height="100" />
            <rect x="130" y="0" rx="5" ry="5" width="120" height="100" />
            <rect x="260" y="0" rx="5" ry="5" width="120" height="100" />
            <rect x="0" y="110" rx="5" ry="5" width="120" height="100" />
            <rect x="130" y="110" rx="5" ry="5" width="120" height="100" />
            <rect x="260" y="110" rx="5" ry="5" width="120" height="100" />
          </ContentLoader>
        )}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {photos?.length
            ? photos.map((photo, ind) => (
                <div
                  key={photo.docId}
                  className={`${ind + 1 === photos.length && 'mb-6'}`}
                >
                  <img
                    className="rounded"
                    src={photo.imageSrc}
                    alt={photo.caption}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}

export default Photos;

Photos.propTypes = {
  photos: PropTypes.array,
};
