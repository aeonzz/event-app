import NotFound from '@/app/not-found';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Admin = async () => {

  const session = await getServerSession(authOptions); 

  if (session?.user.role === 'SUPERADMIN') {
    return <h2>admin page - welcome back {session?.user.username}</h2>
  }

  return <NotFound />
}

export default Admin;