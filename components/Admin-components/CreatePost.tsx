import { Avatar } from '@radix-ui/react-avatar'
import React from 'react'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PostInput from './PostInput'
import { Card } from '../ui/card'
import { format } from 'date-fns'

const CreatePost = async () => {

  const session = await getServerSession(authOptions);

  let initialLetter = '';
  if (session && session?.user.username) {
    initialLetter = session?.user.username.charAt(0).toUpperCase();
  }

  const joined = new Date(session?.user.createdAt!)

  return (
    <div className='w-full py-3 px-5'>
      <PostInput 
        initalletter={initialLetter}
        username={session?.user.username}
        authorId={session!.user.id}
        joined={format(joined, 'PP')}
      />
    </div>
  )
}

export default CreatePost