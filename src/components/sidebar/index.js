import { useContext, useRef, useEffect } from 'react';
import User from './User';
import Suggestion from './Suggestion';

import loggedInContext from '../../context/loggedInUser';
function Sidebar() {
  const {
    activeUser: { username, fullName, photoURL, userId, docId = '' } = {},
  } = useContext(loggedInContext);
  const asideRef = useRef();

  useEffect(() => {
    let mounted = true;
    const moveAside = () => {
      if (window.pageYOffset <= 64) {
        asideRef.current.style.transform = `translateY(-${window.pageYOffset}px)`;
      }
    };

    if (mounted) {
      window.addEventListener('scroll', moveAside);
    }

    return () => {
      mounted = false;
      window.removeEventListener('scroll', moveAside);
    };
  }, []);

  return (
    <aside ref={asideRef} className="xs:px-4 col-span-3 lg:fixed">
      {fullName ? (
        <>
          <User username={username} fullName={fullName} photoURL={photoURL} />
          <div className="font-semibold text-gray-base">
            Suggestions for you
          </div>
          <Suggestion loggedInUserId={userId} loggedInUserDocId={docId} />
        </>
      ) : null}
    </aside>
  );
}

export default Sidebar;
