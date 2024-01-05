import { Posts } from '@/types/posts'
import { User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import ProfileHover from '../profileHover'
import { format, formatDistanceToNow } from 'date-fns'
import { Badge } from '../ui/badge'

interface ParticipantCardProps {
  user: {
    id: number
    email: string
    imageUrl: string | null
    username: string
    department: string | null
    createdAt: Date
    updateAt: Date
  }
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ user }) => {

  
  const updatedAt = new Date(user.updateAt)

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <ProfileHover
          username={user.username}
          userId={user.id}
          imageUrl={user.imageUrl}
          date={format(user.createdAt, 'PP')}
        />
        <div className='flex flex-col justify-center'>
          <Link
            href={`/user/${user.id}`}
            className='hover:underline font-semibold'
          >
            {user.username}
          </Link>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </div>
      </div>
      <p className='text-xs text-muted-foreground'>{`Listed ${formatDistanceToNow(updatedAt, { addSuffix: true })}`}</p>
      <Badge className='w-32 justify-center' variant={'secondary'}>{user.department}</Badge>
    </div>
  )
}

export default ParticipantCard