import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';

import { db } from '../lib/firebase';

import UserContext from '../context/currentUser';
import originalPhotosContext from '../context/originalPost';
import PostPhotosContext from '../context/postPhotos';

import * as ROUTES from '../constants/routes';
import {
  DEFAULT_IMAGE_PATH,
  INSTAGRAM_LOGO,
  DEFAULT_POST_IMAGE_PATH,
} from '../constants/path';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';

import { debounce } from '../helpers/debounce';
import { getItem, setItem, removeItem } from '../helpers/storage';
import { getLocation } from '../helpers/getGeoLocation';

import { Alert } from '../styles/Alert';

import ReactImageUploading from 'react-images-uploading';

import ReactLoader from '../components/Loader';

import InputField from './InputField';

// hover 하면 opacity가 자연스럽게 옅어지는 효과를 tailwind config에 추가해보기
function Header() {
  const { username } = useParams();
  const navigate = useNavigate();

  const {
    user: { uid, displayName, photoURL },
  } = useContext(UserContext);

  const { originalPhotos, setOriginalPhotos } = useContext(
    originalPhotosContext
  );
  const { setPostPhotos } = useContext(PostPhotosContext);

  const [isLoading, setIsLoading] = useState(false);

  const [dialogType, setDialogType] = useState('');

  const savedDescription = getItem('post-description');
  const savedPicture = getItem('instagram-picture');
  const [localSnackBarOpen, setLocalSnackBarOpen] = useState(false);
  const [postSnackBarOpen, setpostSnackBarOpen] = useState(false);

  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');

  const [allUsers, setAllUsers] = useState([]);

  useEffect(async () => {
    const allUsers = await getDocs(collection(db, 'users'));
    const allUsersArr = [];
    allUsers.forEach(doc => {
      const { userId, username, photoURL } = doc.data();
      allUsersArr.push({ userId, username, photoURL });
    });
    setAllUsers(allUsersArr);
  }, [db]);

  const onImageChange = (imageList, addUpdateIndex) => {
    try {
      setItem(
        'instagram-picture',
        imageList.length
          ? [{ ...imageList[0], imageName: imageList[0]?.file.name }]
          : null
      );
      if (imageList.length) {
        setImages([{ ...imageList[0], imageName: imageList[0]?.file.name }]);
      } else {
        setImages([]);
      }
    } catch (error) {
      alert('Picture size is too big.');
    }
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

  const handlePostDescriptionChange = evt => {
    setDescription(evt.target.value);
    debounce(() => {
      setItem('post-description', evt.target.value);

      setLocalSnackBarOpen(true);
    }, 500);
  };

  const handlePost = async () => {
    setIsLoading(true);
    let imageSrc;
    if (images[0]?.file) {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `userPhotos/${uid}/${images[0].file.name || images[0].imageName}`
      );
      const urlStorageRef = ref(
        storage,
        `gs://instagram-d02c0.appspot.com/userPhotos/${uid}/${
          images[0].file.name || images[0].imageName
        }`
      );

      await uploadString(storageRef, images[0].data_url, 'data_url');

      imageSrc = await getDownloadURL(urlStorageRef);
    }
    const { latitude, longitude, location } = await getLocation();

    let newPhotoObj = {
      caption: description,
      comments: [],
      dateCreated: Date.now(),
      imageSrc: imageSrc ? imageSrc : DEFAULT_POST_IMAGE_PATH,
      likes: [],
      photoId: images[0] ? images[0].imageName : 'no photo id',
      userId: uid,
      userLatitude: latitude,
      userLongitude: longitude,
      location,
    };

    const { id } = await addDoc(collection(db, 'photos'), newPhotoObj);

    newPhotoObj = {
      ...newPhotoObj,
      docId: id,
      username: displayName,
      userLikedPhoto: false,
      userPhotoUrl: photoURL,
    };

    setpostSnackBarOpen(true);
    setImages([]);
    setDescription('');
    setDialogType('');
    removeItem('post-description');
    removeItem('instagram-picture');
    setOriginalPhotos(prevPhotos => [newPhotoObj, ...prevPhotos]);
    setPostPhotos(prevPhotos => [newPhotoObj, ...prevPhotos]);

    setIsLoading(false);
  };

  const handleLocalSnackBarClose = () => {
    setLocalSnackBarOpen(false);
  };
  const handlePostSnackBarClose = () => {
    setpostSnackBarOpen(false);
  };

  const onClickSignOutHandle = () => {
    const auth = getAuth();
    signOut(auth);
    navigate(ROUTES.LOGIN);
  };

  const getOriginalPhotos = () => {
    setPostPhotos(originalPhotos);
  };

  return (
    <nav className="h-16 px-4 lg:px-0 bg-white border-b border-gray-primary mb-8">
      {isLoading && <ReactLoader />}
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between items-center h-full">
          <div className="text-gray-700 text-center flex cursor-pointer xs:w-[16%] xs:mr-1 ">
            <h1 className="flex justify-center">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  onClick={getOriginalPhotos}
                  src={INSTAGRAM_LOGO}
                  alt="Instagram"
                  className="mt-2 lg:w-6/12"
                />
              </Link>
            </h1>
          </div>

          {!username && <InputField allUsers={allUsers} />}

          <div className="text-gray-700 text-center flex items-center">
            {uid ? (
              <>
                {!username && (
                  <>
                    <AddToPhotosOutlinedIcon
                      data-testid="start-upload-photo"
                      onClick={handleDialogOpen}
                      className="mr-5 mt-[2px] text-black-light cursor-pointer hover:opacity-60 w-6 lg:w-8 h-8 xs:mr-2"
                    />
                    <Dialog
                      open={dialogType === 'showSavedDescription'}
                      onClose={handleDialogClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogContent>
                        <DialogContentText
                          data-testid="saved-question-upload-photo"
                          id="alert-dialog-description"
                        >
                          You already have saved post. Do you want to continue
                          with it?
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
                          data-testid="upload-photo-description"
                          margin="dense"
                          id="description"
                          label="Picture Description"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={handlePostDescriptionChange}
                          value={description}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Stack direction="row" spacing={1}>
                          <Button
                            data-testid="cancel-upload-photo"
                            onClick={handleDialogClose}
                            variant="contained"
                            color="error"
                          >
                            Cancel
                          </Button>
                          <Button
                            data-testid="post-upload-photo"
                            onClick={handlePost}
                            variant="contained"
                            style={{ marginRight: '.3rem' }}
                            disabled={!description}
                          >
                            Post
                          </Button>
                        </Stack>
                      </DialogActions>
                    </Dialog>
                    <Snackbar
                      open={localSnackBarOpen}
                      autoHideDuration={1000}
                      onClose={handleLocalSnackBarClose}
                    >
                      <Alert
                        onClose={handleLocalSnackBarClose}
                        severity="success"
                        sx={{ width: '100%' }}
                      >
                        Description saved !
                      </Alert>
                    </Snackbar>
                    <Snackbar
                      open={postSnackBarOpen}
                      autoHideDuration={3000}
                      onClose={handlePostSnackBarClose}
                    >
                      <Alert
                        onClose={handlePostSnackBarClose}
                        severity="info"
                        sx={{ width: '100%' }}
                      >
                        Post uploaded!
                      </Alert>
                    </Snackbar>
                  </>
                )}

                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    onClick={getOriginalPhotos}
                    className="mr-6 text-black-light cursor-pointer w-6 xs:mr-2 lg:w-8 "
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
                  onClick={onClickSignOutHandle}
                  onKeyDown={evt => {
                    if (evt.key === 'Enter') {
                      onClickSignOutHandle();
                    }
                  }}
                >
                  <svg
                    className="w-[1.7rem] text-black-light cursor-pointer xs:mr-2 lg:w-8 lg:mr-6"
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
                {uid && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${displayName}`}>
                      <img
                        className=" rounded-full h-8 w-8 xs:h-7 xs:w-7 flex"
                        src={photoURL ? photoURL : ''}
                        alt={`${displayName} profile`}
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
    </nav>
  );
}

export default Header;
