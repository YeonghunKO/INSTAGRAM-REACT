import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';

import PostPhotosContext from '../../context/postPhotos';
import loggedInContext from '../../context/loggedInUser';
import originalPhotosContext from '../../context/originalPost';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

import { doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '../../lib/firebase';

function Header({
  isProfile,
  postUsername,
  userPhotoUrl,
  docId,
  photoId,
  userId,
}) {
  const [open, setOpen] = useState(false);

  const { postPhotos, setPostPhotos } = useContext(PostPhotosContext);
  const { originalPhotos, setOriginalPhotos } = useContext(
    originalPhotosContext
  );

  const {
    activeUser: { username },
  } = useContext(loggedInContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const filteredPhotos = postPhotos.filter(photo => photo.docId !== docId);
    setPostPhotos(filteredPhotos);
    setOpen(false);

    const filteredOriginalPhotos = originalPhotos.filter(
      photo => photo.docId !== docId
    );
    setOriginalPhotos(filteredOriginalPhotos);

    await deleteDoc(doc(db, 'photos', docId));

    const storage = getStorage();

    const postPhotoRef = ref(storage, `userPhotos/${userId}/${photoId}`);

    deleteObject(postPhotoRef).catch(error => {
      console.log(error);
    });
  };

  return (
    <header className="flex justify-between items-center border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center">
        <Link
          to={`${isProfile ? '' : `p/${postUsername}`}`}
          className="flex items-center"
        >
          <img src={userPhotoUrl} className="rounded-full h-8 w-8 flex mr-3" />
          <p className="font-bold">{postUsername}</p>
        </Link>
      </div>
      <div className={`${postUsername !== username && 'hidden'}`}>
        <svg
          onClick={handleClickOpen}
          className="h-6 w-6 cursor-pointer hover:text-red-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}

export default Header;

Header.propTypes = {
  isProfile: PropTypes.bool,
  postUsername: PropTypes.string.isRequired,
  userPhotoUrl: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
  photoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.string,
};
