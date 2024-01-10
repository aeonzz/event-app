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
  userId?: number | null
  imageUrl?: string | null
}


const ProfileHover: FC<ProfileHoverProps> = ({ username, date, userId, imageUrl }) => {

  const profile = imageUrl ? imageUrl : undefined

  let initialLetter = ''
  if (username) {
    initialLetter = username.charAt(0).toUpperCase();
  }

  return (
    <HoverCard
      openDelay={200}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        <Avatar className='h-9 w-9 dark:border relative group bg-stone-900 border'>
          <Link
            href={`/user/${userId}`}
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
      </HoverCardTrigger>
      <HoverCardContent className="w-[250px] z-50 bg-[#161312]" hideWhenDetached={true}>
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage
              src={profile}
              className='object-cover'
            />
            <AvatarFallback className='h-9 w-9 bg-stone-900'>{initialLetter}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 w-full">
            <h4 className="text-sm font-semibold"></h4>
            <Link
              href={`/user/${userId}`}
              className=' underline-offset-4 hover:underline'
            >
              {username}
            </Link>
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