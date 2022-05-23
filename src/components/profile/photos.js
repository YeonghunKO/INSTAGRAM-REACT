import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

import { useState, useRef, useCallback, useEffect } from 'react';

import Photo from './photo';

import useScroll from '../../hooks/useScroll';

import { debounce } from '../../helpers/debounce';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { PostContainer } from '../../styles/PostContainer.style';

import Post from '../post';

function Photos({ photos }) {
  console.log('photos');
  const [windowWidth] = useState(window.innerWidth);
  const [photosSlice, setPhotosSlice] = useState(6);

  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  const [postOpen, setpostOpen] = useState(false);

  const [postWidth, setPostWidth] = useState(0);

  const $photosContainer = useRef();
  const $postContainer = useRef();
  const $post = useRef();

  const PhotosNotEnd = photosSlice <= photos?.length - 1;

  const postLength = $photosContainer.current?.childElementCount;

  const handlePostOpen = useCallback(index => {
    setCurrentPostIndex(index);
    setpostOpen(true);
  }, []);

  const handlePostClose = () => {
    setTimeout(() => setpostOpen(false), 100);
  };

  const prevPost = () => {
    if (currentPostIndex === 0) {
      setCurrentPostIndex(postLength - 1);
    } else {
      setCurrentPostIndex(prevPostIndex => prevPostIndex - 1);
    }
  };

  const nextPost = () => {
    if (currentPostIndex === postLength - 1) {
      setCurrentPostIndex(0);
    } else {
      setCurrentPostIndex(prevPostIndex => prevPostIndex + 1);
    }
  };

  const [scrollY, innerHeight] = useScroll(PhotosNotEnd);

  if (
    $photosContainer.current &&
    scrollY + innerHeight >= $photosContainer.current.offsetHeight
  ) {
    if (PhotosNotEnd) {
      debounce(() => {
        setPhotosSlice(prevSlice => prevSlice + 2);
      }, 300);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setPostWidth($post.current?.offsetWidth);
    }, 100);
  }, [postOpen]);

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
            ref={$photosContainer}
          >
            {photos?.length
              ? photos
                  .slice(0, photosSlice)
                  .map((photo, ind) => (
                    <Photo
                      handlePostOpen={handlePostOpen}
                      key={photo.docId}
                      photo={photo}
                      index={ind}
                    />
                  ))
              : null}
          </div>
        ) : null}

        {!photos ||
          (photos?.length === 0 && (
            <p className="text-center text-2xl">No Posts Yet</p>
          ))}
      </div>

      {photos?.length ? (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={postOpen}
          onClose={handlePostClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={postOpen}>
            <Box
              className={`absolute text-white outline-none top-7 h-[92%] xs:left-[12%] lg:left-[35%] xs:w-9/12 lg:w-4/12 m-0`}
            >
              <CloseIcon
                className={`absolute cursor-pointer -top-5 -right-11`}
                onClick={handlePostClose}
              />

              <ArrowCircleLeftOutlinedIcon
                onClick={prevPost}
                className={`${
                  photos.length <= 1 && 'hidden'
                } absolute cursor-pointer top-[50%] -left-11`}
              />
              <ArrowCircleRightOutlinedIcon
                onClick={nextPost}
                className={`${
                  photos.length <= 1 && 'hidden'
                } absolute cursor-pointer top-[50%] -right-11`}
              />
              <Box className="overflow-hidden text-[#000000] outline-none absolute top-7 h-[92%] left-1 w-full m-0">
                <PostContainer
                  width={$photosContainer.current?.childElementCount}
                  ref={$postContainer}
                  postWidth={postWidth}
                  currentPostIndex={currentPostIndex}
                >
                  {photos.slice(0, photosSlice).map((photo, ind) => (
                    <div
                      ref={$post}
                      key={photo.docId}
                      className={`w-full post`}
                    >
                      <Post photoObj={photo} isProfile={true} />
                    </div>
                  ))}
                </PostContainer>
              </Box>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  );
}

export default Photos;

Photos.propTypes = {
  photos: PropTypes.array,
};

// ind + 1 === photos.length && 'mb-6'
