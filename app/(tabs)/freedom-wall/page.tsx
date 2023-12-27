import CreatePost from '@/components/Admin-components/CreatePost';
import Posts from '@/components/Post-components/Posts';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const FreedomWall = async () => {

  const session = await getServerSession(authOptions);
  const tag = 'fw'
  const published = true


  return (
    <div className='w-[58%] mt-4 px-20 flex flex-col'>
      <CreatePost
        tag={tag}
        session={session}
      />
      <Posts
        tag={tag}
        published={published}
        session={session}
      />
    </div>
  )
}
export default FreedomWall