import { initializeApp } from 'firebase/app';
import {
  FieldValue,
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  getDocFromCache,
} from 'firebase/firestore';
import 'firebase/auth';

// import { seedDatabase } from '../seed';

const config = {
  apiKey: 'AIzaSyBNAUt3GXqrlVyZE6GCrA8URzF67aDciAg',
  authDomain: 'instagram-d02c0.firebaseapp.com',
  projectId: 'instagram-d02c0',
  storageBucket: 'instagram-d02c0.appspot.com',
  messagingSenderId: '206900872857',
  appId: '1:206900872857:web:1bb7ba5599b040c1021a08',
};

const firebase = initializeApp(config);

const db = getFirestore();

// seedDatabase(db, addDoc, collection);

export { firebase, FieldValue };

// const addData = async data => {
//   await addDoc(collection(db, 'cities'), data);
// };

// const setData = async (countryName, data) => {
//   await setDoc(doc(db, 'cities', countryName), data);
// };
// const cityRef = async countryName => {
//   const docRef = doc(db, 'cities', countryName);
//   try {
//     const doc = await getDoc(docRef);
//     console.log('cached Doc', doc.data());
//   } catch (error) {
//     console.log('no data', error);
//   }
// };
