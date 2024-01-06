import NotFound from '@/app/not-found';
import Posts from '@/components/Post-components/Fwall'
import PendingPost from '@/components/SupAdmin-components/PendingPost';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const PendingPosts = async () => {

  const session = await getServerSession(authOptions);
  const published = null


  if (session?.user.role === 'SYSTEMADMIN') {
    return (
      <div className='w-[58%] px-10 mt-4 min-h-[400px] flex flex-col'>
        <PendingPost
          published={published}
        />
      </div>
    )
  }

  return <NotFound />
}

export default PendingPosts