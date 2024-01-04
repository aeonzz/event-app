import CreatePost from '@/components/Admin-components/CreatePost';
import Fwall from '@/components/Post-components/Fwall';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const FreedomWall = async () => {

  const session = await getServerSession(authOptions);
  const tag = 'fw'
  const published = true


  return (
    <div className='w-[58%] mt-4 px-20 flex flex-col gap-3'>
      <CreatePost
        tag={tag}
        session={session}
      />
      <Fwall
        tag={tag}
        published={published}
        session={session}
      />
    </div>
  )
}
export default FreedomWall