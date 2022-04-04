import { useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FirebaseContext from '../context/firebase';

function useAuthListner() {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('authUser'))
  );
  useEffect(() => {
    const auth = getAuth();
    const listener = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        localStorage.setItem('authUser', JSON.stringify(currentUser));
        setUser(currentUser);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
      }
    });
    return () => listener();
  }, [firebase]);

  return { user };
}

export default useAuthListner;
