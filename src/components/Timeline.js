import { Instagram } from 'react-content-loader';
import Post from '../components/post';

import PropTypes from 'prop-types';

function Timeline({ photos, following }) {
  return (
    <div className="col-span-3 lg:col-span-2">
      {!photos && !following ? (
        Array.from({ length: 4 }, (v, i) => 0).map((_, ind) => (
          <Instagram key={ind} />
        ))
      ) : following?.length === 0 ? (
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

Timeline.propTypes = {
  photos: PropTypes.array,
  following: PropTypes.array,
};
