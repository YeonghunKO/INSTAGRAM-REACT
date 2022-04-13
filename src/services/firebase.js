import {
  getDocs,
  collection,
  query,
  where,
  limit,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

async function doesUsernameExist(username) {
  const user = query(
    collection(db, 'users'),
    where('username', '==', username.toLowerCase())
  );

  const snapShot = await getDocs(user);
  const userData = snapShot.docs.map(doc => ({ ...doc.data() }));
  return userData.length > 0;
}

async function getUserByUid(id) {
  const user = query(collection(db, 'users'), where('userId', '==', id));

  const snapShot = await getDocs(user);
  const userData = snapShot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));

  return userData;
}

async function getUserByUsername(username) {
  const user = query(
    collection(db, 'users'),
    where('username', '==', username)
  );

  const snapShot = await getDocs(user);
  const userData = snapShot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
  return userData;
}

async function getSuggestedProfiles(loggedInUserId, following) {
  const suggestedUser = query(
    collection(db, 'users'),
    where('userId', 'not-in', [...following, loggedInUserId]),
    limit(10)
  );
  const snapShot = await getDocs(suggestedUser);
  const suggestedUserData = snapShot.docs.map(doc => ({
    ...doc.data(),
    docId: doc.id,
  }));
  return suggestedUserData;
}

async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  const suggestedProfileRef = doc(db, 'users', loggedInUserDocId);
  await updateDoc(suggestedProfileRef, {
    // if isFollowingProfile is false, It means I want to follow
    // because I clicked Follow, while isFollowingProfile is false.
    following: isFollowingProfile
      ? arrayRemove(profileId)
      : arrayUnion(profileId),
  });
}
async function updateFollowedFollowers(
  profileDocId,
  loggedInUserId,
  isFollowingProfile
) {
  const suggestedProfileRef = doc(db, 'users', profileDocId);
  await updateDoc(suggestedProfileRef, {
    followers: isFollowingProfile
      ? arrayRemove(loggedInUserId)
      : arrayUnion(loggedInUserId),
  });
}

async function getFollowingPhotos(userId, following) {
  // [2,3]
  const result = query(
    collection(db, 'photos'),
    where('userId', 'in', following)
  );
  const snapShot = await getDocs(result);
  const followingUserPhotos = snapShot.docs.map(photo => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    followingUserPhotos.map(async photo => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUid(photo.userId);
      const { username, photoURL } = user[0];
      return { username, userPhotoUrl: photoURL, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

async function getUserPhotosByUserId(userId) {
  const result = query(collection(db, 'photos'), where('userId', '==', userId));
  const snapShot = await getDocs(result);
  const userPhotos = snapShot.docs.map(photo => ({
    ...photo.data(),
    docId: photo.id,
  }));
  return userPhotos;
}

async function isUserFollowingProfile(username, profileUserId) {
  const result = query(
    collection(db, 'users'),
    where('username', '==', username),
    where('following', 'array-contains', profileUserId)
  );
  const snapShot = await getDocs(result);
  const [response = {}] = snapShot.docs.map(photo => ({
    ...photo.data(),
    docId: photo.id,
  }));

  return response.userId;
}
//activeUser.docId,profileDocId,profileUserId,activeUser.userId
async function toggleFollow(
  userDocId,
  profileDocId,
  profileUserId,
  userId,
  isFollowingProfile
) {
  await updateLoggedInUserFollowing(
    userDocId,
    profileUserId,
    isFollowingProfile
  );
  await updateFollowedFollowers(profileDocId, userId, isFollowingProfile);
}

export {
  doesUsernameExist,
  getUserByUid,
  getUserByUsername,
  getSuggestedProfiles,
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
  getFollowingPhotos,
  getUserPhotosByUserId,
  isUserFollowingProfile,
  toggleFollow,
};
