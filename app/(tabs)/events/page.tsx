import CreatePost from '@/components/Admin-components/CreatePost';
import FetchDataError from '@/components/FetchDataError';
import HomeLoading from '@/components/Loading/HomeLoading';
import PostCard from '@/components/Post-components/PostCard';
import EventCard from '@/components/Post-components/PostCard';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react'

async function getPost() {

  const response = await prisma.post.findMany({
    where: {
      Tag: {
        name: 'event',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      content: true,
      author: true,
      Tag: true,
    },
  });

  return response;

}


const Event = async () => {

  try {

    const posts = await getPost();
    const session = await getServerSession(authOptions);

    return (
      <div className='w-[45%] mt-4 px-1 flex flex-col'>
        {session?.user.role === 'ADMIN' || session?.user.role === 'SUPERADMIN' ?
          <CreatePost />
          : null
        }
        <Suspense fallback={<HomeLoading />}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </Suspense>
        {/* {session?.user.username}
          <Link href='/admin'>hahahahah</Link>
          <h2>Client session</h2>
          <User />
          <h2>Server session</h2>
          {JSON.stringify(session)} */}
      </div>
    )
  } catch (error) {
    return <FetchDataError />
  }
}

export default Event;