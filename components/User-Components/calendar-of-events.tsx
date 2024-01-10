'use client'

import React, { useEffect, useState } from 'react'
import { Calendar } from '../ui/calendar'
import { Posts } from '@/types/posts';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchPosts = async () => {
  const response = await axios.get('/api/posts');
  return response.data as Posts[];
};

interface CalendarOfEventsProps {

}


const CalendarOfEvents: React.FC<CalendarOfEventsProps> = ({  }) => {
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [disabledDays, setDisabledDays] = useState<(Date | { from: Date; to: Date })[]>([]);

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

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={disabledDays}
      />
    </div>
  )
}

export default CalendarOfEvents