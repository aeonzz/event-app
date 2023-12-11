import ImageSlider from '@/components/Post-components/ImageSlider'
import ProfileHover from '@/components/profileHover'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/db'
import Linkify from 'linkify-react'
import { Calendar, MapPin } from 'lucide-react'
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
      author: true,
      Tag: true
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

  return (
    <div className='w-full h-[85vh] flex justify-between mt-5 px-7'>
      <div className='flex-1 mr-3'>
        <BackButton style='absolute z-50' />
        <ImageSlider />
      </div>
      <Separator orientation='vertical' />
      <ScrollArea className='w-[350px] h-full px-5'>
        <div className='flex items-center gap-2'>
          <ProfileHover />
          <div className='flex flex-col'>
            <Link
              href='/'
              className='hover:underline font-semibold'
            >
              {post?.author.username}
            </Link>
            <Badge className='w-fit' variant='secondary'>event</Badge>
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold uppercase mt-2'>{post?.title}</h2>
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
        <Linkify options={options}>
          <p className='whitespace-pre-wrap text-sm'>{post?.content}</p>
        </Linkify>
        {post?.published === false && (
          <div className='mt-5'>
            <PostReview
              reviewStyle='hidden'
            />
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default PostDetails