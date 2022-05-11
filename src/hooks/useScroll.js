import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../helpers/debounce';

function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  const setHeight = useCallback(() => {
    setScrollY(window.pageYOffset);
    setInnerHeight(window.innerHeight);
  });

  const delay = 20;
  useEffect(() => {
    let mounted = true;

    window.addEventListener('scroll', () => {
      if (mounted) {
        debounce(setHeight, delay);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return [scrollY, innerHeight];
}

export default useScroll;
