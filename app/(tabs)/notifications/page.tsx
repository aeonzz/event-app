import CreatePost from '@/components/Admin-components/CreatePost';
import Posts from '@/components/Post-components/Fwall';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Notifications = async () => {

  const session = await getServerSession(authOptions);


  return (
    <div className='w-[58%] border min-h-[400px] mt-4 px-20 flex flex-col'>
    </div>
  )
}
export default Notifications