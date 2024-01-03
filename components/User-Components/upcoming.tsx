import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CircleOff } from 'lucide-react'
import Link from 'next/link'

interface UpcomingProps {
  postStatus: string
  postTitle: string | null
  postDateFrom: Date | null
  postDateTo: Date | null
  postTimeFrom: string | null
  postTimetTo: string | null
  postLink: number
}

function convertTimeTo12HourFormat(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const timeIn12HourFormat = `${(parseInt(hours, 10) % 12) || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
  return timeIn12HourFormat;
}

const Upcoming: React.FC<UpcomingProps> = ({ postStatus, postTitle, postDateFrom, postDateTo, postTimeFrom, postTimetTo, postLink }) => {

  const dateFrom = postDateFrom ? new Date(postDateFrom) : undefined;
  const dateTo = postDateTo ? new Date(postDateTo) : undefined;
  const formattedTimeFrom = postTimeFrom ? convertTimeTo12HourFormat(postTimeFrom) : undefined;
  const formattedTimeTo = postTimetTo ? convertTimeTo12HourFormat(postTimetTo) : undefined;

  const date =
    dateTo
      ? dateFrom
        ? `from ${format(dateFrom, 'PP')} to ${format(dateTo, 'PP')}` +
        (postTimetTo ? `, ${formattedTimeFrom} - ${convertTimeTo12HourFormat(postTimetTo)}` : `, ${formattedTimeFrom}`)
        : 'No date available'
      : dateFrom
        ? `On ${format(dateFrom, 'PP')}` +
        (postTimetTo ? `, ${formattedTimeFrom} - ${convertTimeTo12HourFormat(postTimetTo)}` : `, ${formattedTimeFrom}`)
        : 'No date available';

  if (postStatus === 'completed' || postStatus === 'postponed' || postStatus === 'cancelled') {
    return null
  }

  return (
    <Link
    href={`/post/${postLink}`}
      className='w-full py-1 mt-2 flex items-center justify-between'
    >
      <div>
        {postTitle ? (
          <h3 className='font-semibold'>{postTitle}</h3>
        ) : (
          <span>---</span>
        )}
        <p className='text-xs text-muted-foreground'>{date}</p>
      </div>
      <Badge
        className={cn(
          postStatus === 'eventDay' && 'text-[#FFA500]',
          postStatus === 'upcoming' && 'text-[#3498db]',
          postStatus === 'ongoing' && 'text-[#2ecc71] animate-pulse',
          postStatus === 'completed' && 'text-[#27ae60]',
          postStatus === 'cancelled' && 'text-[#e74c3c]',
          postStatus === 'postponed' && 'text-[#f39c12]',
          'w-fit'
        )}
        variant='secondary'
      >
        {postStatus === 'eventDay' && <p>Today</p>}
        {postStatus === 'upcoming' && <p>Upcoming</p>}
        {postStatus === 'ongoing' && <p>Ongoing</p>}
        {postStatus === 'completed' && <p>Completed</p>}
        {postStatus === 'cancelled' && <p>Cancelled</p>}
        {postStatus === 'postponed' && <p>Postponed</p>}
      </Badge>
    </Link>
  )
}

export default Upcoming