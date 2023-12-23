import NotFound from '@/app/not-found';
import Posts from '@/components/Post-components/Posts'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const PendingPosts = async () => {

  const session = await getServerSession(authOptions);
  const published = false

  if (session?.user.role === 'SYSTEMADMIN') {
    return (
      <div className='w-[58%] mt-4 px-20 flex flex-col'>
        <Posts
          published={published}
        />
      </div>
    )
  }

  return <NotFound />
}

export default PendingPosts