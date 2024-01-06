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
    yearLevel: string | null
    section: string | null
  }
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ user }) => {

  const yearAndSection = user.yearLevel && user.section ? user.yearLevel.charAt(0) + user.section : undefined
  const updatedAt = new Date(user.updateAt)

  return (
    <div className='grid grid-cols-4 grid-rows-1 py-2'>
      <div className='flex items-center gap-4 col-span-2'>
        <ProfileHover
          username={user.username}
          userId={user.id}
          imageUrl={user.imageUrl}
          date={format(user.createdAt, 'PP')}
        />
        <div className='flex flex-col justify-center'>
          <Link
            href={`/user/${user.id}`}
            className='hover:underline font-semibold leading-none'
          >
            {user.username}
          </Link>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-xs'>{yearAndSection}</p>
        <p className='text-xs text-muted-foreground'>{`Listed ${formatDistanceToNow(updatedAt, { addSuffix: true })}`}</p>
      </div>
      <div className='flex items-center justify-end'>
        <Badge className='w-32 justify-center'>{user.department}</Badge>
      </div>
    </div>
  )
}

export default ParticipantCard