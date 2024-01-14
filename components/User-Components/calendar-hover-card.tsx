import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from 'next/image'
import { Posts } from '@/types/posts'
import Link from 'next/link'


const CalendarHoverCard = ({ post }: { post: Posts | null }) => {
  return (
    <div className='w-[220px] flex justify-center'>
      <HoverCard defaultOpen>
        <HoverCardTrigger></HoverCardTrigger>
        <HoverCardContent side='bottom' className='h-40 !p-2 bg-[#161312] flex flex-col gap-1'>
          <div className='rounded-md w-full h-16 relative border flex justify-center items-center'>
            {post?.images && post?.images.length > 0 ? (
              <Image
                src={post?.images[0].url}
                alt={`${post?.Tag.name} image`}
                objectFit="cover"
                fill
                quality={10}
                objectPosition='center'
                className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out rounded-md'
              />
            ) : (
              <Image
                src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/carbon_no-image.png'
                alt={`${post?.Tag.name} image`}
                width={56}
                height={56}
                objectFit="cover"
                objectPosition='center'
                className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out rounded-md'
              />
            )}
          </div>
          <h3 className='whitespace-pre-wrap break-words font-semibold '>{post?.title}</h3>
          <div className='relative h-14 overflow-hidden'>
            <div className='absolute w-full h-full z-50 bg-gradient-to-t from-[#161312] to-transparent' />
            <p className='whitespace-pre-wrap break-words text-xs text-muted-foreground'>{post?.content}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default CalendarHoverCard