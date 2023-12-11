import NotFound from '@/app/not-found';
import CreatePost from '@/components/Admin-components/CreatePost';
import Posts from '@/components/Post-components/Posts';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const FreedomWall = async () => {

  const tag = 'fw'
  const published = true
  const fw = true

  return (
    <div className='w-[58%] mt-4 px-20 flex flex-col'>
      <CreatePost />
      <Posts
        fw={fw}
        tag={tag}
        published={published}
      />
    </div>
  )
}
export default FreedomWall