'use client'

import { Posts } from '@/types/posts';
import { format, isAfter, isBefore, isEqual, parse, startOfDay } from 'date-fns';
import React from 'react'
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { FormInputPost } from '@/types/post';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


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

  const dateFrom = post.dateFrom ? new Date(post.dateFrom) : undefined;
  const dateTo = post.dateTo ? new Date(post.dateTo) : undefined;
  const currentDate = new Date()
  const currentTime = new Date();
  const startOfCurrentDay = startOfDay(currentDate)
  const formattedCurrentTime = format(currentTime, 'h:mm a')
  const formattedTimeFrom = convertTimeTo12HourFormat(post.timeFrom)
  const formattedTimeTo = convertTimeTo12HourFormat(post.timeTo)
  const isTimeAfterTimeFrom = isAfter(currentTime, parse(formattedTimeFrom, 'h:mm a', new Date()));
  const isTimeBeforeTimeTo = isBefore(currentTime, parse(formattedTimeTo, 'h:mm a', new Date()));
  const isDateEqual = dateFrom !== undefined && isEqual(dateFrom, startOfCurrentDay)
  const currentEventTime = isTimeAfterTimeFrom && isTimeBeforeTimeTo;
  const isCurrentTimeAfterEventTime = isTimeAfterCurrentTime(post.timeTo)
  const eventDay = isDateEqual && currentEventTime && !isCurrentTimeAfterEventTime

  function isTimeAfterCurrentTime(eventTime: string): boolean {
    const currentHourMinute = format(currentTime, 'HH:mm');
    return currentHourMinute > eventTime;
  }
  

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (updateStatus: FormInputPost) => {
      return axios.patch(`/api/posts/${post.id}`, updateStatus);
    },
  })

  function handleStatusUpdate() {
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: post.anonymous,
      venue: post.venue || undefined,
      location: post.location || undefined,
      published: post.published,
      deleted: false,
      category: post.Tag.name,
      authorId: post.author.id,
      clicks: post.clicks,
      status: post.status,
      going: undefined,
      timeFrom: post.timeFrom,
      timeTo: post.timeTo
    };
    updateStatus(data)
  }

  return (
    <div className={cn(
      className,
      'z-20 absolute h-auto flex flex-col items-end gap-2'
    )}>
      {post.Tag.name === 'event' && (
        <>
          {post.status === 'upcoming' && (
            <Badge className='w-fit text-blue-500' variant='secondary'>
              Upcoming
            </Badge>
          )}
          {post.status === 'ongoing' && (
            <Badge className='w-fit text-blue-500' variant='secondary'>
              Ongoing
            </Badge>
          )}
        </>
      )}

      {going && (
        <Badge className='w-fit text-green-500' variant='secondary'>Listed</Badge>
      )}
    </div>
  )
}

export default PostStatus