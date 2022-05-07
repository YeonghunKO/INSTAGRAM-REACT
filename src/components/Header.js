import { useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

import UserContext from '../context/currentUser';
import * as ROUTES from '../constants/routes';
import { DEFAULT_IMAGE_PATH, INSTAGRAM_LOGO } from '../constants/path';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';

import { debounce } from '../helpers/debounce';
import { getItem, setItem, removeItem } from '../helpers/storage';

import { Alert } from '../styles/Alert';

import ReactImageUploading from 'react-images-uploading';

// hover 하면 opacity가 자연스럽게 옅어지는 효과를 tailwind config에 추가해보기
function Header() {
  const { username } = useParams();

  const [dialogType, setDialogType] = useState('');

  const savedDescription = getItem('post-description');
  const savedPicture = getItem('instagram-picture');

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');

  const onImageChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const handleDialogClose = () => {
    setDialogType(false);
  };

  const handleDialogOpen = () => {
    if (savedDescription) {
      setDialogType('showSavedDescription');
    } else {
      setDialogType('choosePicture');
    }
  };

  const continueWithSaveDescription = () => {
    setDescription(savedDescription);
    setImages(savedPicture);
    setDialogType('choosePicture');
  };

  const notContinueWithSaveDescription = () => {
    setDialogType('choosePicture');
    setDescription('');
    setImages([]);
    removeItem('post-description');
    removeItem('instagram-picture');
  };

  const handlePostDescriptionChnage = evt => {
    setDescription(evt.target.value);
    debounce(() => {
      setItem('post-description', description);
      setItem('instagram-picture', images);
      setSnackBarOpen(true);
    }, 1000);
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const { user: loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const onClickHeaderHandle = () => {
    const auth = getAuth();
    signOut(auth);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="h-16 px-4 lg:px-0 bg-white border-b border-gray-primary mb-8">
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center cursor-pointer">
            <h1 className="flex justify-center w-full">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  src={INSTAGRAM_LOGO}
                  alt="Instagram"
                  className="mt-2 w-6/12"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 text-center flex items-center">
            {loggedInUser ? (
              <>
                {!username && (
                  <>
                    <svg
                      onClick={handleDialogOpen}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 mr-6 mt-[2px] text-black-light cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <Dialog
                      open={dialogType === 'showSavedDescription'}
                      onClose={handleDialogClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          You already have saved description. Do you want to
                          continue with it?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={notContinueWithSaveDescription}>
                          No
                        </Button>
                        <Button onClick={continueWithSaveDescription} autoFocus>
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog
                      open={dialogType === 'choosePicture'}
                      onClose={handleDialogClose}
                    >
                      <DialogTitle>Shine your life</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Choose picture and write down description about the
                          picture
                        </DialogContentText>
                        <ReactImageUploading
                          value={images}
                          onChange={onImageChange}
                          dataURLKey="data_url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                          }) => (
                            // write your building UI
                            <div className="upload__image-wrapper">
                              <Button
                                startIcon={<InsertPhotoIcon />}
                                style={
                                  isDragging
                                    ? { color: 'red', marginTop: '1rem' }
                                    : { marginTop: '1rem' }
                                }
                                onClick={onImageUpload}
                                {...dragProps}
                                variant="outlined"
                                className="my-1"
                                fullWidth={true}
                              >
                                {' '}
                                Click or Drop here
                              </Button>
                              &nbsp;
                              {imageList.map((image, index) => (
                                <div key={index} className="image-item">
                                  <img
                                    src={image.data_url}
                                    alt=""
                                    className="w-full"
                                  />
                                  <div className="image-item__btn-wrapper">
                                    <Stack
                                      className="mt-3"
                                      direction="row"
                                      spacing={2}
                                    >
                                      <Button
                                        onClick={() => onImageUpdate(index)}
                                        variant="contained"
                                        endIcon={<UpgradeIcon />}
                                      >
                                        Update
                                      </Button>
                                      <Button
                                        onClick={() => onImageRemove(index)}
                                        variant="contained"
                                        color="error"
                                        endIcon={<DeleteForeverIcon />}
                                      >
                                        Remove
                                      </Button>
                                    </Stack>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ReactImageUploading>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="description"
                          label="Picture Description"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={handlePostDescriptionChnage}
                          value={description}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Stack direction="row" spacing={1}>
                          <Button
                            onClick={handleDialogClose}
                            variant="contained"
                            color="error"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleDialogClose}
                            variant="contained"
                            style={{ marginRight: '.3rem' }}
                          >
                            Post
                          </Button>
                        </Stack>
                      </DialogActions>
                    </Dialog>
                    <Snackbar
                      open={snackBarOpen}
                      autoHideDuration={3000}
                      onClose={handleSnackBarClose}
                    >
                      <Alert
                        onClose={handleSnackBarClose}
                        severity="success"
                        sx={{ width: '100%' }}
                      >
                        description saved !
                      </Alert>
                    </Snackbar>
                  </>
                )}

                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>
                <button
                  data-testid="sign-out"
                  type="button"
                  title="Sign out"
                  onClick={onClickHeaderHandle}
                  onKeyDown={evt => {
                    if (evt.key === 'Enter') {
                      onClickHeaderHandle();
                    }
                  }}
                >
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
                {loggedInUser && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${loggedInUser?.displayName}`}>
                      <img
                        className="rounded-full h-8 w-8 flex"
                        src={loggedInUser?.photoURL}
                        alt={`${loggedInUser?.displayName} profile`}
                        onError={evt => {
                          evt.target.src = DEFAULT_IMAGE_PATH;
                        }}
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-medium hover:bg-opacity-70 transition-all font-bold text-sm rounded text-white w-20 h-8"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button className="font-bold text-sm rounded text-blue-medium hover:text-opacity-70 transition-all w-20 h-8">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
