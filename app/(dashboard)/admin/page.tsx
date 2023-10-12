<<<<<<< HEAD
import NotFound from '@/app/not-found';
=======
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Admin = async () => {

  const session = await getServerSession(authOptions); 

<<<<<<< HEAD
  if (session?.user.role === 'SUPERADMIN') {
    return <h2>admin page - welcome back {session?.user.username}</h2>
  }

  return <NotFound />
=======
  if (session?.user) {
    return <h2>admin page - welcome back {session?.user.username}</h2>
  }

  return (
    <h2>please login to see this admin page</h2>
  )
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
}

export default Admin;