"use client"; // Ensure this component is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppNavbar from '../../components/common/appNavbar/AppNavbar';
import ProjectCardContent from '../../components/projectCardContent/ProjectCardContent';

export default function ProjectCard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for checking authentication
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const getLoginToken = localStorage.getItem('loginToken');
      if (getLoginToken !== null) {
        setIsAuthenticated(true);
      } else {
        router.push('/login'); // Redirect to login page if not authenticated
      }
      setLoading(false); // Set loading to false after the check
    };

    checkAuthentication();
  }, [router]);

  // If loading, show a spinner or loading message
  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner component if desired
  }

  // If not authenticated, this should not happen because of redirect
  if (!isAuthenticated) {
    return null; // This could be handled better, but is fine in this context
  }

  return (
    <>

      <ProjectCardContent />
    </>
  );
}
