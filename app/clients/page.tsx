import React from 'react'
import ClientsPage from './ClientsPage'
import Navbar from '../components/NavBar'
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';

const page = async () => {

    const session = await getServerSession(authOptions);
      
    if (!session || !session.user?.email) redirect("/login");
  return (
  <>
    <Navbar/>
    <ClientsPage/>
  </>
  );
}

export default page