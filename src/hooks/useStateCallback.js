import { useState, useCallback, useRef, useEffect } from 'react';

function useStateCallback(initState) {
  const [state, setState] = useState(initState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      console.log(cbRef.current);
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}

export default useStateCallback;
