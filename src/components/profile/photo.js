import PropTypes from 'prop-types';
import { useState, memo } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Post from '../post';

const style = {
  position: 'absolute',
  top: '5%',
  left: '33%',
  height: '10%',
  width: '50%',
  // transform: 'translate(-50%, -50%)',
  // width: 400,
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 24,
  // p: 4,
};

function Photo({ photo }) {
  const [likes, setLikes] = useState(photo.likes.length);
  const [comments, setComments] = useState(photo.comments.length);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTimeout(() => setOpen(false), 100);
  };

  console.log(photo.docId);
  return (
    <>
      <div
        onClick={handleOpen}
        data-testid={`photo`}
        key={photo.docId}
        className="h-9/12 mb-3 cursor-pointer relative group"
      >
        <img
          className="rounded h-full w-full"
          src={photo.imageSrc}
          alt={photo.caption}
        />
        <div className="absolute bottom-0 left-0 bg-gray-base z-10 w-full justify-evenly items-center h-full bg-black-faded rounded group-hover:flex hidden">
          <p className="flex items-center text-white font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 mr-4"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            {photo.likes.length}
          </p>
          <p className="flex items-center text-white font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 mr-4"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            {photo.comments.length}
          </p>
        </div>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className="outline-none absolute top-7 h-[92%] xs:left-[12%] lg:left-[26%] xs:w-9/12 lg:w-6/12 m-0">
              <Post isProfile={true} photoObj={photo} />
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
}

export default memo(Photo);

Photo.propTypes = {
  photo: PropTypes.object,
};
