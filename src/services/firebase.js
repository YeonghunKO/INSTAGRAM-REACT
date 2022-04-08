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

export {
  doesUsernameExist,
  getUserByUid,
  getSuggestedProfiles,
  updateLoggedInUserFollowing,
  updateFollowedFollowers,
};
