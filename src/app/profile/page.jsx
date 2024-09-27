"use client"; // Ensure this component is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppNavbar from '../../components/common/appNavbar/AppNavbar';
import ProfileContent from '../../components/profileContent.jsx/ProfileContent';

export default function Profile() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const router = useRouter();

  useEffect(() => {
    const getLoginToken = localStorage.getItem('loginToken');

    if (getLoginToken !== null) {
      setIsAuthenticated(true);
    } else {
      router.push('/login'); // Redirect to login page if not authenticated
    }
    setLoading(false); // Set loading to false after checking
  }, [router]);

  // If loading, show a spinner or loading message
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  // If not authenticated, this should not happen because of redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>

      <ProfileContent />
    </>
  );
}
