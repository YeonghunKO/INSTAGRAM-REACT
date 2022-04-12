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
  loggedInUserDocId,
  isFollowingProfile
) {
  const suggestedProfileRef = doc(db, 'users', profileDocId);
  await updateDoc(suggestedProfileRef, {
    followers: isFollowingProfile
      ? arrayRemove(loggedInUserDocId)
      : arrayUnion(loggedInUserDocId),
  });
}

async function getPhotos(userId, following) {
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

export {
  doesUsernameExist,
  getUserByUid,
  getSuggestedProfiles,
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
  getPhotos,
};
