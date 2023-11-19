import { Avatar } from '@radix-ui/react-avatar'
import React from 'react'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PostInput from './PostInput'
import { Card } from '../ui/card'

const CreatePost = async () => {

  const session = await getServerSession(authOptions);

  let initialLetter = '';
  if (session && session?.user.username) {
    initialLetter = session?.user.username.charAt(0).toUpperCase();
  }

  return (
    <div className='w-full py-3 px-5'>
      <PostInput 
        initalletter={initialLetter}
        username={session?.user.username}
        authorId={session!.user.id}
      />
    </div>
  )
}

export default CreatePost