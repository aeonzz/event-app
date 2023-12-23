import ImageSlider from '@/components/Post-components/image-slider'
import ProfileHover from '@/components/profileHover'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/db'
import Linkify from 'linkify-react'
import { Calendar, MapPin, Theater } from 'lucide-react'
import Link from 'next/link'
import React, { FC, Suspense } from 'react'
import ViewPostLoading from './loading'
import BackButton from '@/components/BackButton'
import PostReview from '@/components/Post-components/PostReview'

interface PostDetailProps {
  params: {
    id: number
  }
}

async function getPost(id: number) {
  const response = await prisma.post.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      location: true,
      venue: true,
      date: true,
      author: true,
      images: true,
      Tag: true,
    },
  })

  return response
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostDetails: FC<PostDetailProps> = async ({ params }) => {

  const postID = +params.id
  const post = await getPost(postID);
  const tag = post?.Tag.name
  const { venue, location, date } = post || {}

  return (
    <div className='w-full h-[88vh] flex justify-between mt-5 px-7'>
      <BackButton style='z-50' />
      <ScrollArea className='w-[350px] h-full px-3'>
        <div className='flex items-center gap-2'>
          <ProfileHover />
          <div className='flex flex-col'>
            <Link
              href='/'
              className='hover:underline font-semibold'
            >
              {post?.author.username}
            </Link>
            <Badge className='w-fit' variant='secondary'>{tag}</Badge>
          </div>
        </div>
        <div>
          {tag === 'fw' ? null : (
            <div className='flex w-full flex-col my-5 gap-3'>
              {date && (
                <Badge variant='secondary' className='flex items-center p-2 w-fit'>
                  <Calendar className='stroke-primary h-4 w-4 mr-2' />
                  <p className='text-xs text-muted-foreground'>{date}</p>
                </Badge>
              )}
              {location && (
                <Badge variant='secondary' className='flex items-center p-2 w-fit'>
                  <MapPin className='stroke-primary h-4 w-4 mr-2' />
                  <p className='text-xs text-muted-foreground'>{location}</p>
                </Badge>
              )}
              {venue && (
                <Badge variant='secondary' className='flex items-center p-2 w-fit'>
                  <Theater className='stroke-primary h-4 w-4 mr-2' />
                  <p className='text-xs text-muted-foreground'>{venue}</p>
                </Badge>
              )}
              <div className='mt-2 w-[300px]'>
                <h2 className='text-xl font-bold uppercase break-words'>{post?.title}</h2>
              </div>
            </div>
          )}
        </div>
        <div className='w-[300px]'>
          <Linkify options={options}>
            <p className='whitespace-pre-wrap break-words'>
              {post?.content}
            </p>
          </Linkify>
        </div>
      </ScrollArea>
      <Separator orientation='vertical' />
      <div className='flex-1 ml-3'>
        {post?.images.length !== 0 ? (
          <ImageSlider
            images={post?.images}
          />
        ) : (
          <div className='flex-1 w-full h-full flex items-center justify-center'>
            <h1>No Images Available</h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetails