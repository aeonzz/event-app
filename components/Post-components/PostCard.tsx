'use client'

import React, { FC, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProfileHover from '../profileHover';
import { Badge } from '../ui/badge';
import { Calendar, Check, Dot, MapPin, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import Linkify from "linkify-react";
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { Posts } from '@/types/posts';
import { Button } from '../ui/button';
import PostReview from './PostReview';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


interface PostCardProps {
  post: Posts
  tag?: string | null
  fw?: boolean | null
  innerRef?: React.Ref<HTMLDivElement>
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostCard: FC<PostCardProps> = ({ post, tag, innerRef, fw }) => {

  const { id, title, content, author, Tag, createdAt, anonymous } = post;
  const { username, } = author;
  const { name } = Tag;
  const postedAt = new Date(createdAt)
  const authorCreatedAt = new Date(author.createdAt)
  const [showFullContent, setShowFullContent] = useState(false);
  const contentToDisplay = showFullContent ? content : content?.slice(0, 500);

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  if (tag && name !== tag) {
    return null;
  }

  return (
    <div ref={innerRef} className='relative w-full h-auto py-3 px-5 mt-3 border bg-stone-900/50 transition-colors rounded-md overflow-hidden'>
      {anonymous ? (
        <div className='flex items-center gap-2'>
          <Avatar className='h-9 w-9 dark:border relative group'>
            <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
            <AvatarImage src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/EJFa13qXUAEzWpm.png'
              className='object-cover'
            />
            <AvatarFallback className='h-9 w-9 bg-stone-900'></AvatarFallback>
          </Avatar>
          <p className='hover:underline font-semibold'>Anonymous participant</p>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <ProfileHover
            username={username}
            date={format(authorCreatedAt, 'PP')}
          />
          <div className='flex flex-col'>
            <Link
              href='/'
              className='hover:underline font-semibold'
            >
              {username}
            </Link>
            <div className='flex items-center'>
              <p className='text-xs font-light text-muted-foreground'>
                {formatDistanceToNow(postedAt, { addSuffix: true })}
              </p>
              {fw ? null : (
                <>
                  <Dot />
                  <Badge className='w-fit' variant='secondary'>{name}</Badge>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className='mt-4'>
        {fw ? null : (
          <div>
            <h2 className='text-xl font-bold uppercase mb-2'>{title}</h2>
            <Accordion type="single" collapsible className="w-full mb-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <p className='text-xs text-muted-foreground'>More details</p>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center'>
                      <Calendar className='stroke-primary h-5 w-5 mr-2' />
                      <p className='text-xs text-muted-foreground'>12/16/02</p>
                    </div>
                    <div className='flex items-center'>
                      <MapPin className='stroke-primary h-5 w-5 mr-2' />
                      <p className='text-xs text-muted-foreground'>Jasaan, Mis.Or</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        <Linkify options={options}>
          <p className='whitespace-pre-wrap break-words'>
            {contentToDisplay}
            {content!.length > 500 && (
              <Button
                variant='link'
                onClick={toggleContentVisibility}
                className='ml-1 -mt-5 p-0 text-slate-200'>
                {showFullContent ? 'See Less' : '...See More'}
              </Button>
            )}
          </p>
        </Linkify>
        {fw ? null : (
          <div className='relative w-full flex overflow-hidden rounded-lg mt-5'>
            <Link href={`/post/${id}`}>
              <div className='flex-1 flex'>
                <div className='flex-1'>
                  <Image
                    className='object-cover min-h-[400px] object-center'
                    src={gg}
                    alt='post image'
                  />
                </div>
                <div className='flex-1'>
                  <Image
                    className='object-cover min-h-[400px] object-center'
                    src={gg}
                    alt='post image'
                  />
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* <Separator className='my-4' /> */}
        {post.published === false ? (
          <PostReview />
        ) : (
          null
        )}
      </div>
    </div>
  )
}

export default PostCard;