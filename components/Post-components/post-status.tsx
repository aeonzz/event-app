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
  className
}: {
  post: Posts,
  className?: string | undefined
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
  console.log(isDateEqual)
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
      'z-20 absolute h-auto flex flex-col items-end gap-2'
    )}>
      {post.Tag.name === 'event' && (
        <Badge
          className={cn(
            post.status === 'eventDay' && 'text-[#FFA500]',
            post.status === 'upcoming' && 'text-[#3498db]',
            post.status === 'ongoing' && 'text-[#2ecc71] animate-pulse',
            post.status === 'completed' && 'text-[#27ae60]',
            post.status === 'cancelled' && 'text-[#e74c3c]',
            post.status === 'postponed' && 'text-[#f39c12]',
            'w-fit'
          )}
          variant='secondary'>
          {post.status === 'eventDay' && <p>Today</p>}
          {post.status === 'upcoming ' && <p>Upcoming</p>}
          {post.status === 'ongoing' && <p>Ongoing</p>}
          {post.status === 'completed' && <p>Completed</p>}
          {post.status === 'cancelled' && <p>Cancelled</p>}
          {post.status === 'postponed' && <p>Postponed</p>}
        </Badge>
      )}
      {going && (
        <Badge className='w-fit text-green-500' variant='secondary'>Listed</Badge>
      )}
    </div>
  )
}

export default PostStatus