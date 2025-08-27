  "use client";

  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
  import WelcomeCard from '../components/dashboard/WelcomeCard';
  import RecentData from '../components/dashboard/RecentData';
  import UserActivities from '../components/dashboard/UserActivities';
  import Header from '../components/layout/Header';
  import Sidebar from '../components/layout/Sidebar';

  export default function Dashboard() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      // Check if user is authenticated
      const token = localStorage.getItem('jwt_token');
      const userData = localStorage.getItem('user_data');
      
      if (!token) {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
    }, [router]);

    if (!user) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6"> 
            <div className="grid grid-cols-1 gap-6 mb-6">
              <WelcomeCard user={user} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RecentData />
              <UserActivities />
            </div>
          </main>
        </div>
      </div>
    );
  }