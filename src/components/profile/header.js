import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import { DEFAULT_IMAGE_PATH } from '../../constants/path';

import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';

import UserFollowingContext from '../../context/userFollowing';
import IsProfileEditedContext from '../../context/isProfileEdited';

import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db } from '../../lib/firebase';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Stack from '@mui/material/Stack';

import ReactImageUploading from 'react-images-uploading';

import ReactLoader from '../../components/Loader';

function Header({
  activeUser,
  photosCount,
  followersCount,
  userProfileDispatch,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName: profileFullName,
    followers,
    following,
    photoURL,
    username: profileUsername,
    introduction: profileIntroduction,
  },
}) {
  console.log('Header');

  const [isFollowingProfile, setIsFollowingProfile] = useState(null);

  const { setUserFollowing } = useContext(UserFollowingContext);
  const { setIsProfileEdited } = useContext(IsProfileEditedContext);

  const [windowWidth] = useState(window.innerWidth);

  const [profileImg, setProfileImg] = useState([]);
  const [username, setUsername] = useState(profileUsername);
  const [fullName, setFullname] = useState(profileFullName);
  const [introduction, setIntroduction] = useState(profileIntroduction);

  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const activeBtnFollow =
    activeUser?.username && activeUser?.username !== profileUsername;

  const handelToggleFollow = async () => {
    setIsFollowingProfile(prevIsFollowing => !prevIsFollowing);
    userProfileDispatch({
      followersCount: isFollowingProfile
        ? followersCount - 1
        : followersCount + 1,
    });
    await toggleFollow(
      activeUser.docId,
      profileDocId,
      profileUserId,
      activeUser.userId,
      isFollowingProfile
    );

    if (isFollowingProfile) {
      setUserFollowing(prevUserFollowing =>
        prevUserFollowing.filter(
          followingUser => followingUser !== profileUserId
        )
      );
    } else {
      setUserFollowing(prevUserFollowing => [
        ...prevUserFollowing,
        profileUserId,
      ]);
    }
  };

  const handleEditProfileOpen = () => {
    setEditProfileOpen(true);
  };

  const handleEditProfileClose = () => {
    setEditProfileOpen(false);
  };

  const onImageChange = (imageList, addUpdateIndex) => {
    try {
      if (imageList.length) {
        setProfileImg([
          { ...imageList[0], imageName: imageList[0]?.file.name },
        ]);
      } else {
        setProfileImg([]);
      }
    } catch (error) {
      console.log(error);
      alert('Picture size is too big.');
    }
  };

  const updateProfileInfoOnly = async photo => {};

  const handleEditProfileConfirm = async () => {
    setIsLoading(true);
    let editedPhotoURL;
    if (profileImg[0].file) {
      console.log('photo url changed');
      const storage = getStorage();
      const storageRef = ref(storage, `userProfilePicture/${username}`);
      const urlStorageRef = ref(
        storage,
        `gs://instagram-d02c0.appspot.com/userProfilePicture/${username}`
      );
      await uploadBytes(storageRef, profileImg[0].file);

      editedPhotoURL = await getDownloadURL(urlStorageRef);
    }

    const auth = getAuth();

    await updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: editedPhotoURL ? editedPhotoURL : photoURL,
    }).catch(error => {
      alert(error);
    });

    const profileDoc = doc(db, 'users', profileDocId);

    await updateDoc(profileDoc, {
      username,
      fullName,
      introduction,
      photoURL: editedPhotoURL ? editedPhotoURL : photoURL,
    });

    userProfileDispatch({
      profile: {
        profileDocId,
        profileUserId,
        followers,
        following,
        username,
        fullName,
        introduction,
        photoURL: editedPhotoURL ? editedPhotoURL : photoURL,
      },
    });
    setEditProfileOpen(false);
    setIsLoading(false);
    navigate(`/p/${username}`, { replace: true });
    setIsProfileEdited(prev => !prev);
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        activeUser?.username,
        profileUserId
      );

      setIsFollowingProfile(!!isFollowing);
    };
    if (activeUser?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
      setProfileImg([photoURL]);
      setUsername(profileUsername);
      setFullname(profileFullName);
      setIntroduction(profileIntroduction);
    }
  }, [activeUser?.username, profileUserId]);

  return (
    <div className="grid grid-cols-2 gap-0 justify-between mx-auto max-w-screen-lg">
      {isLoading && <ReactLoader />}
      <div className="container flex justify-center items-center lg:ml-[3rem]">
        {profileUsername ? (
          <img
            className="rounded-full h-[9rem] lg:h-48 w-[9rem] lg:w-48 flex cursor-pointer"
            src={photoURL}
            onError={e => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        ) : (
          <ContentLoader>
            <circle
              cx={`${windowWidth > 601 ? '210' : '80'}`}
              cy={`${windowWidth > 601 ? '75' : '65'}`}
              r={`${windowWidth > 601 ? '70' : '60'}`}
            />
          </ContentLoader>
        )}
      </div>
      {!followers || !following || !profileUsername ? (
        <ContentLoader>
          <rect x="0" y="40" rx="5" ry="5" width="124" height="23" />
          <rect x="150" y="30" rx="5" ry="5" width="94" height="43" />
          <rect x="0" y="100" rx="5" ry="5" width="74" height="23" />
          <rect x="80" y="100" rx="5" ry="5" width="74" height="23" />
          <rect x="160" y="100" rx="5" ry="5" width="74" height="23" />
        </ContentLoader>
      ) : (
        <div className="flex items-center justify-center flex-col col-span-1 mt-3 xs:text-xs">
          <div className="container flex items-center">
            <p className="text-lg mr-4">{profileUsername}</p>
            {activeBtnFollow ? (
              <button
                className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                type="button"
                onClick={handelToggleFollow}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handelToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              <button
                className="bg-blue-medium font-bold text-sm rounded text-white w-28 h-10"
                type="button"
                onClick={handleEditProfileOpen}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleEditProfileOpen();
                  }
                }}
              >
                Edit your profile
              </button>
            )}
          </div>
          <div className="container flex flex-col lg:flex-row mt-4">
            {
              <>
                <p className="mr-10">
                  <span className="font-bold">{photosCount}</span> photos
                </p>
                <p className="mr-10">
                  <span className="font-bold">{followersCount}</span>
                  {` `}
                  {followersCount === 1 ? 'follower' : 'followers'}
                </p>
                <p className="mr-10">
                  <span className="font-bold">{following?.length}</span>{' '}
                  following
                </p>
              </>
            }
          </div>
          <div className="container mt-4">
            <p className="font-bold">{profileFullName}</p>
          </div>
          <div className="container mt-4">
            <p className="italic">
              {introduction ? profileIntroduction : 'No introduction'}
            </p>
          </div>
        </div>
      )}
      <Dialog open={editProfileOpen} onClose={handleEditProfileClose}>
        <DialogTitle>Edit your profile</DialogTitle>
        <DialogContent>
          <p className="text-[1rem] text-[rgba(0,0,0,0.6)]">
            change your profile image
          </p>
          <ReactImageUploading
            value={profileImg}
            onChange={onImageChange}
            dataURLKey="data_url"
            defaultImg={true}
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
                      src={`${image.data_url ? image.data_url : profileImg}`}
                      alt=""
                      className="w-full"
                    />
                    <div className="image-item__btn-wrapper">
                      <Stack className="mt-3" direction="row" spacing={2}>
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
            margin="dense"
            id="username"
            label="edit your username"
            type="text"
            fullWidth
            variant="standard"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
          />
          <TextField
            margin="dense"
            id="fullName"
            label="edit your fullName"
            type="text"
            fullWidth
            variant="standard"
            onChange={({ target }) => setFullname(target.value)}
            value={fullName}
          />
          <TextField
            margin="dense"
            id="introduction"
            label="edit your introduction"
            type="text"
            fullWidth
            variant="standard"
            onChange={({ target }) => setIntroduction(target.value)}
            value={introduction}
          />
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={handleEditProfileClose}
              variant="contained"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProfileConfirm}
              variant="contained"
              style={{ marginRight: '.3rem' }}
            >
              Edit
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Header;

Header.propTypes = {
  activeUser: PropTypes.object.isRequired,
  photosCount: PropTypes.number.isRequired,
  followersCount: PropTypes.number.isRequired,
  userProfileDispatch: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    photoURL: PropTypes.string,
    introduction: PropTypes.string,
  }).isRequired,
};
