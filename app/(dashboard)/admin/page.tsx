import NotFound from '@/app/not-found';
import FetchDataError from '@/components/FetchDataError';
import AdminTabs from '@/components/SupAdmin-components/adminTabs';
import { Separator } from '@/components/ui/separator';
import { authOptions } from '@/lib/auth';
import { PrismaClient, User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import React from 'react'
import { columns } from './columns';
import { DataTable } from './data-table';

const prisma = new PrismaClient()

async function getData(): Promise<User[]> {
  const data = await prisma.user.findMany({
    where: {
      deleted: false
    },
    orderBy: {
      id: 'desc'
    }
  })

  return data
  // throw new Error('Simulated error in getPost function');
}


const Admin = async () => {


  try {
    const data = await getData()
    const session = await getServerSession(authOptions);
    if (session?.user.role === 'SYSTEMADMIN') {
      return (
        <>
          <div>
            <h1 className='text-4xl font-bold'>Dashboard</h1>
            <h2 className='text-1xl font-medium'>Welcome back, <span className='font-bold'>{session?.user.username}</span></h2>
          </div>
          <Separator className='my-5' />
          <AdminTabs />
          <DataTable
            columns={columns}
            data={data}
          />
        </>
      )
    }

    return <NotFound />

  } catch (error) {
    return (
      <div className='w-full h-[90%] flex justify-center items-center'>
        <FetchDataError />
      </div>
    )
  }



}

export default Admin;