import React, { FC, useEffect, useState } from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import ProfileHover from '../profileHover'
import { format, formatDistanceToNow, formatDuration, intervalToDuration, isAfter, isBefore, isEqual, parse, startOfDay } from 'date-fns';
import { Posts } from '@/types/posts';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Calendar, Dot, MapPin, Theater } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FormInputPost } from '@/types/post';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import PostStatus from './post-status';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useMutationSuccess } from '../Context/mutateContext';
import { Button } from '../ui/button';
import { Session } from 'next-auth';

interface PostGridCard {
  post: Posts
  session?: Session | null
}

function convertTimeTo12HourFormat(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const timeIn12HourFormat = `${(parseInt(hours, 10) % 12) || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
  return timeIn12HourFormat;
}

const PostGridCard: FC<PostGridCard> = ({ post, session }) => {
  const { UserPostInteraction } = post
  const going = post.UserPostInteraction.length > 0 ? post.UserPostInteraction[0].going : false;
  const authorCreatedAt = new Date(post.author.createdAt)
  const postedAt = new Date(post.createdAt)
  const [status, setStatus] = useState(post.status)
  const router = useRouter()
  const { setIsMutate } = useMutationSuccess()

  const dateFrom = post.dateFrom ? new Date(post.dateFrom) : undefined;
  const dateTo = post.dateTo ? new Date(post.dateTo) : undefined;

  const date =
    dateTo
      ? dateFrom
        ? `from ${format(dateFrom, 'PP')} to ${format(dateTo, 'PP')}` +
        (post.timeTo ? `, ${convertTimeTo12HourFormat(post.timeFrom)} - ${convertTimeTo12HourFormat(post.timeTo)}` : `, ${convertTimeTo12HourFormat(post.timeFrom)}`)
        : 'No date available'
      : dateFrom
        ? `On ${format(dateFrom, 'PP')}` +
        (post.timeTo ? `, ${convertTimeTo12HourFormat(post.timeFrom)} - ${convertTimeTo12HourFormat(post.timeTo)}` : `, ${convertTimeTo12HourFormat(post.timeFrom)}`)
        : 'No date available';

  const { mutate: updateClicks } = useMutation({
    mutationFn: async (updateClicks: FormInputPost) => {
      return axios.patch(`/api/posts/${post.id}`, updateClicks);
    },
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (updateStatus: FormInputPost) => {
      return axios.patch(`/api/posts/${post.id}`, updateStatus);
    },
    onSuccess: () => {
      router.refresh()
      setIsMutate(true)
    }
  })

  function handleClick() {
    if (session?.user.role === "USER") {
      const data: FormInputPost = {
        title: post.title,
        content: post.content || undefined,
        anonymous: post.anonymous,
        venue: post.venue || undefined,
        accessibility: post.accessibility,
        location: post.location || undefined,
        published: post.published,
        deleted: false,
        category: post.Tag.name,
        authorId: post.author.id,
        clicks: post.clicks + 1,
        status: post.status,
        going: undefined,
        timeFrom: post.timeFrom,
        timeTo: post.timeTo
      };
      updateClicks(data)
    }
  }


  if (post.deleted) {
    return null
  }

  return (
    <Link
      href={`/post/${post.id}`}
      key={post.id}
      onClick={() => handleClick()}
      className='group'
    >
      <Card className='h-[400px] flex justify-center flex-col gap-3 p-5 bg-[#161312]'>
        <div className='relative w-full h-44 overflow-hidden rounded-md flex justify-center items-center border'>
          <div className='absolute w-full h-full z-10 group-hover:bg-black/20 transition-colors' />
          <div className='z-20 top-1 right-1 absolute h-auto flex flex-col items-end gap-2'>
            {post.Tag.name === 'event' && (
              <PostStatus post={post} className='absolute' />
            )}
          </div>
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
              width={56}
              height={56}
              objectFit="cover"
              objectPosition='center'
              className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out'
            />
          )}
        </div>
        <div className='flex-1 flex flex-col gap-1'>
          <h2 className='whitespace-pre-wrap break-words font-semibold text-2xl'>{post.title === '' ? <span>---</span> : post.title}</h2>
          <div className='relative h-14 overflow-hidden'>
            <div className='absolute w-full h-full z-50 bg-gradient-to-t from-[#161312] to-transparent' />
            <p className='whitespace-pre-wrap break-words text-xs text-muted-foreground'>{post.content}</p>
          </div>
          <div className='h-auto'>
            <div className='flex items-center gap-2'>
              <ProfileHover
                username={post.author.username}
                date={format(authorCreatedAt, 'PP')}
                userId={post.author.id}
                imageUrl={post.author.imageUrl}
              />
              <div className='flex flex-col'>
                <Link
                  href={`/user/${post.author.id}`}
                  className='hover:underline font-semibold'
                >
                  {post.author.username}
                </Link>
                <div className='flex items-center gap-1'>
                  <p className='text-xs font-light text-muted-foreground'>
                    {post.Tag.name === 'event' ? (
                      date
                    ) : (
                      `Posted ${formatDistanceToNow(postedAt, { addSuffix: true })}`
                    )}
                  </p>
                  <Badge className='text-[10px]'>
                    {post.Tag.name}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex w-fit items-center gap-2'>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  {post.dateFrom && (
                    <>
                      <TooltipTrigger>
                        <Badge variant='secondary' className='flex items-center px-2'>
                          <Calendar className='stroke-muted-foreground h-4 w-4' />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side='bottom' sideOffset={5}>
                        <p className='text-xs'>{date}</p>
                      </TooltipContent>
                    </>
                  )}
                </Tooltip>
                <Tooltip>
                  {post.location && (
                    <>
                      <TooltipTrigger>
                        <Badge variant='secondary' className='flex items-center px-2'>
                          <MapPin className='stroke-muted-foreground h-4 w-4' />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side='bottom' sideOffset={5}>
                        <p className='text-xs'>{post.location}</p>
                      </TooltipContent>
                    </>
                  )}
                </Tooltip>
                <Tooltip>
                  {post.venue && (
                    <>
                      <TooltipTrigger>
                        <Badge variant='secondary' className='flex items-center px-2'>
                          <Theater className='stroke-muted-foreground h-4 w-4' />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side='bottom' sideOffset={5}>
                        <p className='text-xs'>{post.venue}</p>
                      </TooltipContent>
                    </>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className='text-muted-foreground text-[10px] mt-1 text-right'>Viewed {post.clicks} times</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default PostGridCard