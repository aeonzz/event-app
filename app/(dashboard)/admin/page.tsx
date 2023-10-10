import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Admin = async () => {

  const session = await getServerSession(authOptions); 

  if (session?.user) {
    return <h2>admin page - welcome back {session?.user.username}</h2>
  }

  return (
    <h2>please login to see this admin page</h2>
  )
}

export default Admin;