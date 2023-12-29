import { Posts } from '@/types/posts'
import React, { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'
import ProfileHover from '../profileHover'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import { Dot } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import PostReview from '../Post-components/PostReview'

interface PendingPostCardProps {
  post: Posts
}

function convertTimeTo12HourFormat(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const timeIn12HourFormat = `${(parseInt(hours, 10) % 12) || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
  return timeIn12HourFormat;
}

const PendingPostCard: FC<PendingPostCardProps> = ({ post }) => {

  const authorCreatedAt = new Date(post.author.createdAt)
  const postedAt = new Date(post.createdAt)
  const dateFrom = post.dateFrom ? new Date(post.dateFrom) : undefined;
  const dateTo = post.dateTo ? new Date(post.dateTo) : undefined;
  const date =
    dateTo
      ? dateFrom
        ? `from ${format(dateFrom, 'PP')} to ${format(dateTo, 'PP')}` +
        (post.timeFrom ? `, ${convertTimeTo12HourFormat(post.timeFrom)}` : '')
        : 'No date available'
      : dateFrom
        ? `On ${format(dateFrom, 'PP')}` +
        (post.timeTo ? `, ${convertTimeTo12HourFormat(post.timeTo)}` : '')
        : 'No date available';

  return (
    <Card className='w-full h-40 flex py-3 px-4 group'>
      <Card className='h-full w-32 flex items-center justify-center overflow-hidden'>
        {post.images && post.images.length > 0 ? (
          <Image
            src={post.images[0].url}
            alt={`${post.Tag.name} image`}
            width={400}
            height={400}
            objectFit="cover"
            objectPosition='center'
            className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out'
          />
        ) : (
          <Image
            src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/carbon_no-image.png'
            alt={`${post.Tag.name} image`}
            width={32}
            height={32}
            objectFit="cover"
            objectPosition='center'
            className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out'
          />
        )}
      </Card>
      <Link
        href={`/post/${post.id}`}
        key={post.id}
        className='flex-1 px-3'
      >
        <div className='flex items-center gap-2'>
          <ProfileHover
            username={post.author.username}
            date={format(authorCreatedAt, 'PP')}
          />
          <div className='flex flex-col'>
            <Link
              href='/'
              className='hover:underline font-semibold'
            >
              {post.author.username}
            </Link>
            <div className='flex items-center'>
              <p className='text-xs font-light text-muted-foreground'>
                Posted {formatDistanceToNow(postedAt, { addSuffix: true })}
              </p>
              <div className='border h-5 mx-2' />
              <p className='text-xs font-light text-muted-foreground'>
                {date}
              </p>
              <Dot />
              <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1 text-xs'>
          <p>Title:</p>
          <h2 className='font-semibold text-muted-foreground'>{post.title === '' ? <span>---</span> : post.title}</h2>
        </div>
        <div className='flex items-start gap-1 text-xs h-12 relative overflow-hidden'>
          <div className='absolute w-full h-full bg-gradient-to-t from-background to-transparent' />
          <p>Description:</p>
          <p className='whitespace-pre-wrap break-words text-xs text-muted-foreground'>{post.content}</p>
        </div>
      </Link>
      <div className='w-fit flex flex-col items-center justify-center gap-2'>
        <PostReview
          post={post}
          style={true}
        />
      </div>
    </Card>
  )
}

export default PendingPostCard