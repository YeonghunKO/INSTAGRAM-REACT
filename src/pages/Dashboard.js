import { useEffect } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';

function Dashboard() {
  useEffect(() => {
    document.title = 'Instagramcoolike';
  }, []);
  return (
    <div className="bg-gray-background">
      <Header />
      <main className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg px-4 lg:px-0">
        <Sidebar />
        <Timeline />
      </main>
    </div>
  );
}

export default Dashboard;
