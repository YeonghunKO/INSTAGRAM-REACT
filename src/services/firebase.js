import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function doesUsernameExist(username) {
  const user = await query(
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

export { doesUsernameExist, getUserByUid };
