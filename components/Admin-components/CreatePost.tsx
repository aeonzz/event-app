import { Avatar } from '@radix-ui/react-avatar'
import React, { FC } from 'react'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PostInput from './PostInput'
import { Card } from '../ui/card'
import { format } from 'date-fns'

interface CreatePostProps {
  tag: string
}

const CreatePost: FC<CreatePostProps> = async ({ tag }) => {

  const session = await getServerSession(authOptions);

  let initialLetter = '';
  if (session && session?.user.username) {
    initialLetter = session?.user.username.charAt(0).toUpperCase();
  }

  const joined = new Date(session?.user.createdAt!)

  return (
    <div className='w-full'>
      <PostInput
        tag={tag}
        initalletter={initialLetter}
        username={session?.user.username}
        authorId={session!.user.id}
        joined={format(joined, 'PP')}
      />
    </div>
  )
}

export default CreatePost