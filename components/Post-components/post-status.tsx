'use client'

import { Posts } from '@/types/posts';
import { format, isAfter, isBefore, isDate, isEqual, parse, startOfDay } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { FormInputPost } from '@/types/post';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useMutationSuccess } from '../Context/mutateContext';
import { useRouter } from 'next/navigation';


function convertTimeTo12HourFormat(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const timeIn12HourFormat = `${(parseInt(hours, 10) % 12) || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
  return timeIn12HourFormat;
}

function PostStatus({
  post,
  className,
  hidden
}: {
  post: Posts,
  className?: string | undefined
  hidden?: string
}) {

  const going = post.UserPostInteraction.length > 0 ? post.UserPostInteraction[0].going : false;
  const [status, setStatus] = useState(post.status)
  const router = useRouter()

  const dateFrom = post.dateFrom ? new Date(post.dateFrom) : undefined;
  const dateTo = post.dateTo ? new Date(post.dateTo) : undefined;
  const currentDate = new Date();
  const currentTime = new Date();
  const startOfCurrentDay = startOfDay(currentDate);

  const formattedCurrentTime = format(currentTime, 'h:mm a');
  const formattedTimeFrom = post.timeFrom ? convertTimeTo12HourFormat(post.timeFrom) : undefined
  const formattedTimeTo = post.timeTo ? convertTimeTo12HourFormat(post.timeTo) : undefined

  const isTimeAfterTimeFrom = formattedTimeFrom ? isAfter(currentTime, parse(formattedTimeFrom, 'h:mm a', new Date())) : undefined
  const isTimeBeforeTimeTo = formattedTimeTo ? isBefore(currentTime, parse(formattedTimeTo, 'h:mm a', new Date())) : undefined

  const isDateEqual = dateFrom !== undefined && isEqual(dateFrom, startOfCurrentDay);
  const currentEventTime = isTimeAfterTimeFrom && isTimeBeforeTimeTo;
  const isCurrentTimeAfterEventTime = isTimeAfterCurrentTime(post.timeTo);

  const eventDay = isDateEqual && currentEventTime && !isCurrentTimeAfterEventTime;
  const eventEnd = isDateEqual && isCurrentTimeAfterEventTime

  function isTimeAfterCurrentTime(eventTime: string): boolean {
    const currentHourMinute = format(currentTime, 'HH:mm');
    return currentHourMinute >= eventTime;
  }

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (updateStatus: FormInputPost) => {
      return axios.patch(`/api/posts/${post.id}`, updateStatus);
    },
    onSuccess: () => {
      router.refresh()
    }
  })

  function handleStatusUpdate() {
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: post.anonymous,
      venue: post.venue || undefined,
      accessibility: post.accessibility,
      location: post.location || undefined,
      published: post.published,
      deleted: post.deleted,
      category: post.Tag.name,
      authorId: post.author.id,
      clicks: post.clicks,
      status: status,
      going: going || undefined,
      timeFrom: post.timeFrom,
      timeTo: post.timeTo
    };
    updateStatus(data)
  }

  useEffect(() => {
    if (eventDay) {
      setStatus('ongoing')
      handleStatusUpdate()
    } else if (eventEnd) {
      setStatus('completed');
      handleStatusUpdate()
    }
  }, [eventDay, eventEnd, status]);


  return (
    <div className={cn(
      className,
      'z-20 h-auto flex flex-col items-end gap-2'
    )}>
      {post.Tag.name === 'event' && post.published && (
        <Badge
          className={cn(
            post.status === 'eventDay' && 'text-yellow-500',
            post.status === 'upcoming' && 'text-blue-500',
            post.status === 'ongoing' && 'text-teal-500 animate-pulse',
            post.status === 'completed' && 'text-green-500 ',
            post.status === 'cancelled' && 'text-red-500',
            post.status === 'postponed' && 'text-amber-500',
            'w-fit'
          )}
          variant='secondary'>
          {post.status === 'eventDay' && <p>Today</p>}
          {post.status === 'upcoming' && <p>Upcoming</p>}
          {post.status === 'ongoing' && <p>Ongoing</p>}
          {post.status === 'completed' && <p>Completed</p>}
          {post.status === 'cancelled' && <p>Cancelled</p>}
          {post.status === 'postponed' && <p>Postponed</p>}
        </Badge>
      )}
      {post.published === null && (
        <Badge variant='secondary' className='text-slate-500 animate-pulse'>Pending</Badge>
      )}
      <Badge className={cn(
        post.accessibility === 'department' && 'text-red-500',
        post.accessibility === 'public' && 'text-blue-500',
        'w-fit'
      )}
        variant='secondary'
      >
        {post.accessibility === 'department' && <p>Exclusive</p>}
        {post.accessibility === 'public' && <p>Open</p>}
      </Badge>
      {going && (
        <Badge className={cn(
          hidden,
          'w-fit text-green-500'
        )}
          variant='secondary'
        >
          Listed
        </Badge>
      )}
    </div>
  )
}

export default PostStatus