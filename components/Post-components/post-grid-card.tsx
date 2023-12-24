import React, { FC } from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import ProfileHover from '../profileHover'
import { format, formatDistanceToNow } from 'date-fns';
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

interface PostGridCard {
  post: Posts
}

const PostGridCard: FC<PostGridCard> = ({ post }) => {

  const authorCreatedAt = new Date(post.author.createdAt)
  const postedAt = new Date(post.createdAt)


  const { mutate: updateClicks } = useMutation({
    mutationFn: async (updateClicks: FormInputPost) => {
      return axios.patch(`/api/posts/${post.id}`, updateClicks);
    },
  })


  function handleClick() {
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
      going: undefined
    };
    updateClicks(data)
  }

  return (
    <Link
      href={`/post/${post.id}`}
      key={post.id}
      onClick={() => handleClick()}
      className='group'
    >
      <Card className='h-[400px] flex border-none justify-center flex-col gap-3 p-5 bg-[#161312]'>
        <div className='w-full h-44 overflow-hidden rounded-md flex justify-center items-center border'>
          {post.images && post.images.length > 0 ? (
            <Image
              src={post.images[0].url}
              alt={`${post.Tag.name} image`}
              width={400}
              height={400}
              objectFit="cover"
              objectPosition='center'
              className='group-hover:scale-105 transition-transform duration-300 ease-in-out'
            />
          ) : (
            <Image
              src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/carbon_no-image.png'
              alt={`${post.Tag.name} image`}
              width={56}
              height={56}
              objectFit="cover"
              objectPosition='center'
              className='group-hover:scale-105 transition-transform duration-300 ease-in-out'
            />
          )}
        </div>
        <div className='flex-1 flex flex-col gap-1'>
          <h2 className='whitespace-pre-wrap break-words font-semibold text-2xl'>{post.title === '' ? post.title : <span>---</span>}</h2>
          <div className='relative h-14 overflow-hidden'>
            <div className='absolute w-full h-full z-50 bg-gradient-to-t from-[#161312] to-transparent' />
            <p className='whitespace-pre-wrap break-words text-xs text-muted-foreground'>{post.content}</p>
          </div>
          <div className='h-auto'>
            <div className='flex items-center gap-2'>
              <ProfileHover
                username={post.author.username}
                date={format(authorCreatedAt, 'PP')}
              />
              <div className='flex flex-col'>
                <Link
                  href='/'
                  className='hover:underline font-semibold'
                >
                  {post.author.username}
                </Link>
                <div className='flex items-center'>
                  <p className='text-xs font-light text-muted-foreground'>
                    {formatDistanceToNow(postedAt, { addSuffix: true })}
                  </p>
                  <Dot />
                  <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex w-fit items-center gap-2'>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  {post.date && (
                    <>
                      <TooltipTrigger>
                        <Badge variant='secondary' className='flex items-center px-2'>
                          <Calendar className='stroke-primary h-4 w-4' />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side='bottom' sideOffset={5}>
                        <p className='text-xs'>{post.date}</p>
                      </TooltipContent>
                    </>
                  )}
                </Tooltip>
                <Tooltip>
                  {post.location && (
                    <>
                      <TooltipTrigger>
                        <Badge variant='secondary' className='flex items-center px-2'>
                          <MapPin className='stroke-primary h-4 w-4' />
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
                          <Theater className='stroke-primary h-4 w-4' />
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
            <p className='text-muted-foreground text-[10px] mt-1 text-right'>Viewed by {post.clicks} people</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default PostGridCard