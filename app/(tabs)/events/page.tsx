import CreatePost from '@/components/Admin-components/CreatePost';
import FetchDataError from '@/components/FetchDataError';
import HomeLoading from '@/components/Loading/PostsLoading';
import NoPostMessage from '@/components/NoPostMessage';
import PostCard from '@/components/Post-components/PostCard';
import EventCard from '@/components/Post-components/PostCard';
import Posts from '@/components/Post-components/Posts';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react'



const Event = async () => {

  const tag = 'event'
  const published = true
  const session = await getServerSession(authOptions);

  return (
    <div className='w-[58%] mt-4 px-20 flex flex-col'>
      {session?.user.role === 'ADMIN' || session?.user.role === 'SYSTEMADMIN' ?
        <CreatePost />
        : null
      }
      <Posts
        tag={tag}
        published={published}
      />
      {/* {session?.user.username}
          <Link href='/admin'>hahahahah</Link>
          <h2>Client session</h2>
          <User />
          <h2>Server session</h2>
          {JSON.stringify(session)} */}
    </div>
  )
}

export default Event;