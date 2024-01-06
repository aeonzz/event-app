import CreatePost from '@/components/Admin-components/CreatePost';
import FetchDataError from '@/components/FetchDataError';
import HomeLoading from '@/components/Loading/PostsLoading';
import NoPostMessage from '@/components/NoPostMessage';
import PostCard from '@/components/Post-components/PostCard';
import EventCard from '@/components/Post-components/PostCard';
import PostGrid from '@/components/Post-components/PostGrid';
import Posts from '@/components/Post-components/Fwall';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react'



const Event = async () => {

  const tag = 'announcement'
  const published = true
  const session = await getServerSession(authOptions);

  return (
    <div className='w-[58%] px-10 mt-4 min-h-[400px] flex flex-col'>
      <div className='flex items-center gap-3'>
        <h1 className='font-semibold text-3xl flex-1'>Announcements</h1>
        {session?.user.role === 'ADMIN' || session?.user.role === 'SYSTEMADMIN' && (
          <CreatePost
            tag={tag}
            session={session}
          />
        )}
      </div>
      <PostGrid
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