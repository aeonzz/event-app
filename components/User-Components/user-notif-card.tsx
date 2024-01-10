import { Posts } from '@/types/posts'
import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface UserNotificationCardProps {
  post: Posts
  open: boolean
  session: Session
  onChangeOpenState: (newOpenState: boolean) => void
}



const UserNotificationCard: React.FC<UserNotificationCardProps> = ({ post, onChangeOpenState, session, open }) => {

  const postedAt = new Date(post.createdAt)
  const profile = post.author.imageUrl ? post.author.imageUrl : undefined
  const updatedAt = post.action ? new Date(post.action) : new Date()
  let initialLetter = ''
  if (post.author.username) {
    initialLetter = post.author.username.charAt(0).toUpperCase();
  }

  if (post.published !== true) {
    return null
  }

  if (post.accessibility === 'department' && session.user.department !== post.author.department) {
    return null
  }

  if (post.status !== 'cancelled' && post.status !== 'postponed') {
    return (
      <Link
        href={`/post/${post.id}`}
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
          <h2 className='text-xs'>{`${post.author.username} posted a new ${post.Tag.name}`}</h2>
          <div className='flex gap-2 items-center mt-1'>
            <Badge variant='secondary'>{post.Tag.name}</Badge>
            <p className='text-muted-foreground text-xs'>{formatDistanceToNow(postedAt, { addSuffix: true })}</p>
          </div>
        </div>
      </Link >
    )
  }

  if (post.status === 'cancelled') {
    return (
      <Link
        href={`/post/${post.id}`}
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
          <h2 className='text-xs'>{`${post.author.username} cancelled the ${post.Tag.name}`}</h2>
          <div className='flex gap-2 items-center mt-1'>
            <Badge variant='secondary'>{post.Tag.name}</Badge>
            <p className='text-muted-foreground text-xs'>{formatDistanceToNow(updatedAt, { addSuffix: true })}</p>
          </div>
        </div>
      </Link >
    )
  }

  if (post.status === 'postponed') {
    return (
      <Link
        href={`/post/${post.id}`}
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
          <h2 className='text-xs'>{`${post.author.username} postponed the ${post.Tag.name}`}</h2>
          <div className='flex gap-2 items-center mt-1'>
            <Badge variant='secondary'>{post.Tag.name}</Badge>
            <p className='text-muted-foreground text-xs'>{formatDistanceToNow(updatedAt, { addSuffix: true })}</p>
          </div>
        </div>
      </Link >
    )
  }
}

export default UserNotificationCard