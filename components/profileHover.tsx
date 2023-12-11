import React, { FC } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "./ui/hover-card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from './ui/avatar'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'
import { CalendarDays } from 'lucide-react'

interface ProfileHoverProps {
  username?: string | null
  date?: string | null
}



const ProfileHover: FC<ProfileHoverProps> = ({ username, date }) => {
  return (
    <HoverCard
      openDelay={200}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        <Avatar className='h-9 w-9 dark:border relative group'>
          <Link
            href='/user/profile'
            className='relative'
          >
            <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
            <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75'
              className='object-cover'
            />
            <AvatarFallback className='h-9 w-9'>
              <Skeleton />
            </AvatarFallback>
          </Link>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 z-50">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75'
              className='object-cover'
            />
            <AvatarFallback className='h-9 w-9 bg-stone-900'></AvatarFallback>
          </Avatar>
          <div className="space-y-1 w-full">
            <h4 className="text-sm font-semibold"></h4>
            <p className="text-sm">
              {username}
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {`Joined ${date}`}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ProfileHover