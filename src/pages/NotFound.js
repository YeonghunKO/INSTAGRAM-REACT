import { useEffect } from 'react';
import Header from '../components/Header';

function NotFound() {
  useEffect(() => {
    document.title = 'Not Foun -Instagram';
  }, []);
  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <p className="text-center text-2xl">Not Found!</p>
      </div>
    </div>
  );
}

export default NotFound;
