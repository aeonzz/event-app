import React from 'react'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import ProfileHover from '../profileHover'
import { format, formatDistanceToNow } from 'date-fns'

interface CommentBoxProps {
  comment: {
    id: number,
    comment: string,
    userId: number,
    createdAt: Date,
    updatedAt: Date,
    user: {
      id: number,
      username: string,
      imageUrl: string,
      role: string,
      createdAt: Date
    },
  }
}

const CommentBox: React.FC<CommentBoxProps> = ({ comment }) => {

  const authorCreatedAt = new Date(comment.user.createdAt)
  const postedAt = new Date(comment.createdAt)

  return (
    <div className='w-fit h-16 flex gap-3'>
      <ProfileHover
        username={comment.user.username}
        date={format(authorCreatedAt, 'PP')}
        userId={comment.user.id}
        imageUrl={comment.user.imageUrl}
        className='!h-7 !w-7'
      />
      <div className='flex flex-col gap-1'>
        <div className='py-2 px-3 rounded-md bg-accent/50'>
          <div className='flex items-center gap-1'>
            <h3 className='text-sm font-semibold'>{comment.user.username}</h3>
            {comment.user.role === 'SYSTEMADMIN' && (
              <BadgeCheck className='h-4 w-4 text-red-500' />
            )}
            {comment.user.role === 'ADMIN' && (
              <BadgeCheck className='h-4 w-4 text-primary' />
            )}
          </div>
          <p className='text-sm'>{comment.comment}</p>
        </div>
        <p className='text-xs text-muted-foreground'>{formatDistanceToNow(postedAt)}</p>
      </div>
    </div>
  )
}

export default CommentBox