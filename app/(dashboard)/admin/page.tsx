<<<<<<< HEAD
import NotFound from '@/app/not-found';
import AdminTabs from '@/components/SupAdmin-components/adminTabs';
import { Separator } from '@/components/ui/separator';
=======
<<<<<<< HEAD
import NotFound from '@/app/not-found';
=======
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Admin = async () => {

<<<<<<< HEAD
  const session = await getServerSession(authOptions);

  if (session?.user.role === 'SUPERADMIN') {
    return (
      <>
        <div className='relative h-auto w-full py-5'>
          <h1 className='text-4xl font-bold'>Dashboard</h1>
          <h2 className='text-1xl font-medium'>Welcome back, <span className='font-bold'>{session?.user.username}</span></h2>
          <Separator className='mt-5' />
          <AdminTabs />
        </div>
      </>
    )
  }

  return <NotFound />
=======
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
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
}

export default Admin;