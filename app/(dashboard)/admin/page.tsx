import NotFound from '@/app/not-found';
import AdminTabs from '@/components/SupAdmin-components/adminTabs';
import { Separator } from '@/components/ui/separator';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Admin = async () => {

  const session = await getServerSession(authOptions);

  if (session?.user.role === 'SYSTEMADMIN') {
    return (
      <>
        <h1 className='text-4xl font-bold'>Dashboard</h1>
        <h2 className='text-1xl font-medium'>Welcome back, <span className='font-bold'>{session?.user.username}</span></h2>
        <Separator className='mt-5' />
        <AdminTabs />
      </>
    )
  }

  return <NotFound />
}

export default Admin;