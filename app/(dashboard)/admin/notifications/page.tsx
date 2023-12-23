import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Notifications = async () => {

  const session = await getServerSession(authOptions);

  return (
    <div className='w-[58%] mt-4 px-20 flex flex-col'>

    </div>
  )
}
export default Notifications