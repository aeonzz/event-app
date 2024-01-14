'use client'

import React from 'react'
import { Card } from '../ui/card'
import { Posts } from '@/types/posts'
import ProfileHover from '../profileHover'
import { format, formatDistanceToNow } from 'date-fns'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'
import { Session } from 'next-auth'

interface NotificationCardProps {
  post: Posts
  open: boolean
  session: Session
  onChangeOpenState: (newOpenState: boolean) => void
}

const NotificationCard: React.FC<NotificationCardProps> = ({ post, onChangeOpenState, open, session }) => {

  const userIdInt = parseInt(session.user.id)
  const user = session.user.role === 'USER'
  const a = user && post.published === true && session.user.department === post.author.department
  console.log(user)
  const admin = session.user.role === 'ADMIN'
  const sAdmin = session.user.role === 'SYSTEMADMIN'
  const postedAt = new Date(post.createdAt)
  const approvedAt = post.action ? new Date(post.action) : new Date()
  const profile = post.author.imageUrl ? post.author.imageUrl : undefined
  let initialLetter = ''

  
  if (post.author.username) {
    initialLetter = post.author.username.charAt(0).toUpperCase();
  }

  if (sAdmin && post.published === true || sAdmin && post.published === false) {
    return null
  }

  if (admin && post.author.id !== userIdInt) {
    return null
  }

  if (admin && post.published === null) {
    return null
  }

  return (
    <Link
      href={session.user.role === 'SYSTEMADMIN' ? `/pending-post` : `/post/${post.id}`}
      className='p-3 rounded-md flex items-center gap-3 hover:bg-accent/30 relative'
      onClick={() => onChangeOpenState(!open)}
    >
      <div className='h-2 w-2 rounded-full bg-green-500 absolute left-1 top-1' />
      <Avatar className='h-9 w-9 dark:border relative group bg-stone-900 border'>
        <Link
          href={`/user/${post.author.id}`}
          className='relative'
        >
          <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
          <AvatarImage
            src={profile}
            className='object-cover'
          />
          <AvatarFallback className='h-9 w-9 pb-1 pr-1'>
            {initialLetter}
          </AvatarFallback>
        </Link>
      </Avatar>
      <div>
        {sAdmin && post.published === null ? (
          <>
            <h2 className='text-xs'>New post awaiting approval</h2>
            <div className='flex gap-2 items-center mt-1'>
              <Badge variant='secondary'>{post.Tag.name}</Badge>
              <p className='text-muted-foreground text-xs'>{formatDistanceToNow(postedAt, { addSuffix: true })}</p>
            </div>
          </>
        ) : null}
        {admin && post.published === true ? (
          <>
            <h2 className='text-xs'>Post approved</h2>
            <div className='flex gap-2 items-center mt-1'>
              <Badge variant='secondary'>{post.Tag.name}</Badge>
              <p className='text-muted-foreground text-xs'>{formatDistanceToNow(approvedAt, { addSuffix: true })}</p>
            </div>
          </>
        ) : null}
        {admin && post.published === false as boolean ? (
          <>
            <h2 className='text-xs'>Post rejected</h2>
            <div className='flex gap-2 items-center mt-1'>
              <Badge variant='secondary'>{post.Tag.name}</Badge>
              <p className='text-muted-foreground text-xs'>{formatDistanceToNow(approvedAt, { addSuffix: true })}</p>
            </div>
          </>
        ) : null}
        {user && post.published === true && session.user.department === post.author.department ? (
          <>
            <h2 className='text-xs'>New event posted</h2>
            <div className='flex gap-2 items-center mt-1'>
              <Badge variant='secondary'>{post.Tag.name}</Badge>
              <p className='text-muted-foreground text-xs'>{formatDistanceToNow(approvedAt, { addSuffix: true })}</p>
            </div>
          </>
        ) : null}
      </div>
    </Link>
  )
}

export default NotificationCard