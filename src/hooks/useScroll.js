import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../helpers/debounce';

function useScroll(photosNotEnd) {
  const [scrollY, setScrollY] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  const setHeight = useCallback(() => {
    setScrollY(window.pageYOffset);
    setInnerHeight(window.innerHeight);
  });

  const delay = 20;
  useEffect(() => {
    let mounted = true;
    if (photosNotEnd) {
      window.addEventListener('scroll', () => {
        if (mounted) {
          debounce(setHeight, delay);
        }
      });
    } else {
      window.removeEventListener('scroll', () => {
        if (mounted) {
          debounce(setHeight, delay);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [photosNotEnd]);

  return [scrollY, innerHeight];
}

export default useScroll;
