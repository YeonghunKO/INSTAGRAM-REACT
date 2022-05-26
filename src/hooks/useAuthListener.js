import { useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FirebaseContext from '../context/firebase';
import { setItem, removeItem } from '../helpers/storage';

function useAuthListner() {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('authUser'))
  );
  useEffect(() => {
    const auth = getAuth();
    const listener = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setItem('authUser', currentUser);
        setUser(currentUser);
      } else {
        removeItem('authUser');
        setUser(null);
      }
    });
    return () => listener();
  }, [firebase]);

  return { user };
}

export default useAuthListner;
