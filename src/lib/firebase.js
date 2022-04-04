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

// Once init the seedData to firebase, it should be turned off.
// seedDatabase(db, addDoc, collection);

export { firebase, FieldValue, db };
