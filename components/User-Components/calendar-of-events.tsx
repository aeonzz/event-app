'use client'

import React, { useEffect, useState } from 'react'
import { Calendar } from '../ui/calendar'
import { Posts } from '@/types/posts';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DayClickEventHandler, DayMouseEventHandler } from 'react-day-picker';
import ProfileHover from '../profileHover';
import CalendarHoverCard from './calendar-hover-card';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


const fetchPosts = async () => {
  const response = await axios.get('/api/posts');
  return response.data as Posts[];
};

interface CalendarOfEventsProps {

}


const CalendarOfEvents: React.FC<CalendarOfEventsProps> = ({ }) => {

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [disabledDays, setDisabledDays] = useState<(Date | { from: Date; to: Date })[]>([]);
  const [hoveredPost, setHoveredPost] = useState<Posts | null>(null);
  
  const { data: dataPosts, status } = useQuery<Posts[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  useEffect(() => {
    if (status === 'success') {
      const upcomingPosts = dataPosts.filter((post) => (post.status === 'upcoming' || post.status === 'ongoing') && !post.deleted)

      const newDisabledDays = upcomingPosts.map((post) => {
        if (post.dateFrom && post.dateTo) {
          return {
            from: new Date(post.dateFrom as Date),
            to: new Date(post.dateTo as Date),
          };
        } else if (post.dateFrom) {
          return new Date(post.dateFrom as Date);
        } else {
          return null;
        }
      });

      setDisabledDays(
        newDisabledDays.filter((day) => day !== null) as (
          | Date
          | { from: Date; to: Date }
        )[]
      );
    }
  }, [status, dataPosts]);

  const bookedDays = disabledDays
  const bookedStyle = { background: '#EF4444' };
  const [booked, setBooked] = React.useState(false);


  const handleHover: DayMouseEventHandler = (day, modifiers) => {
    setBooked(day && modifiers.booked);
    if (day && modifiers.booked) {
      const hoveredPost = dataPosts?.find(
        (post) =>
          (post.dateFrom && new Date(post.dateFrom).toDateString() === day.toDateString()) ||
          (post.dateTo && new Date(post.dateTo).toDateString() === day.toDateString())
      );
      setHoveredPost(hoveredPost || null);
    } else {
      setHoveredPost(null);
    }
  };

  const footer = booked
    ? <CalendarHoverCard post={hoveredPost} /> : null

  return (
    <div className='relative w-full flex justify-center'>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={{ booked: bookedDays }}
        modifiersStyles={{ booked: bookedStyle }}
        onDayMouseEnter={handleHover}
        footer={footer}
      />
    </div>
  )
}

export default CalendarOfEvents