import { Avatar } from '@radix-ui/react-avatar'
import React, { FC } from 'react'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PostInput from './PostInput'
import { Card } from '../ui/card'
import { format } from 'date-fns'
import { Session } from 'next-auth'
import { PlusCircle } from 'lucide-react'

interface CreatePostProps {
  tag: string
  session?: Session | null
}

const CreatePost: FC<CreatePostProps> = ({ session, tag }) => {

  const userIdString = session?.user.id;
  const userIdNumber = userIdString ? parseInt(userIdString, 10) : null;

  let initialLetter = '';
  if (session && session?.user.username) {
    initialLetter = session?.user.username.charAt(0).toUpperCase();
  }
  
  const joined = new Date(session?.user.createdAt!)

  return (
    <div className='flex-1'>
      <PostInput
        tag={tag}
        initalletter={initialLetter}
        username={session?.user.username}
        authorId={userIdNumber}
        joined={format(joined, 'PP')}
      />
    </div>
  )
}

export default CreatePost