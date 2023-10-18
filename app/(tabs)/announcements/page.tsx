import CreatePost from '@/components/Admin-components/CreatePost';
import EventCard from '@/components/Post-components/EventCard';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

const Announcement = async () => {

  const session = await getServerSession(authOptions);

  return (
    <>
      <div className='w-[50%] mt-4 px-1 flex flex-col gap-4'>
        {session?.user.role === 'ADMIN' || 'SUPERADMIN' ?
          <CreatePost />
          : null
        }
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </>
  )
}

export default Announcement;