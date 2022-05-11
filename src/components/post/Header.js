import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

function Header({ username, userPhotoUrl }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`p/${username}`} className="flex items-center">
          <img src={userPhotoUrl} className="rounded-full h-8 w-8 flex mr-3" />
          <p className="font-bold">{username}</p>
        </Link>
      </div>
      <div>
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
          <Button onClick={handleClose} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Header;

Header.propTypes = {
  username: PropTypes.string.isRequired,
  userPhotoUrl: PropTypes.string.isRequired,
};
