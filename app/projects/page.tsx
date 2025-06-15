import React from 'react'
import Navbar from '../components/NavBar'
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import ProjectsPage from './ProjectsPage';

const page = async () => {

    const session = await getServerSession(authOptions);
      
    if (!session || !session.user?.email) redirect("/login");
  return (
  <>
    <Navbar/>
    <ProjectsPage/>
  </>
  );
}

export default page