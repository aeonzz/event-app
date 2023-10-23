'use client'

import React, { FC } from 'react'
import Image, { StaticImageData } from 'next/image';
import { Card } from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import ProfileHover from '../profileHover';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Carousel } from 'flowbite-react';
import Linkify from 'linkify-react';

interface postImage {
  image: StaticImageData
  post: {
    id: number
    title: string
    content: string | null
    author: {
      username: string
    }
  }
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const ViewPost: FC<postImage> = ({ image, post }) => {

  const { id, title, content, author } = post;
  const { username } = author;

  return (
    <ScrollArea className='h-[600px] w-full'>
      <div className='relative w-full h-auto py-3 px-5'>
        <div className='flex items-center gap-2'>
          <ProfileHover />
          <div className='flex flex-col'>
            <Link
              href='/'
              className='hover:underline font-semibold'
            >
              {username}
            </Link>
            <Badge className='w-fit' variant='secondary'>event</Badge>
          </div>
        </div>
        <div className='mt-4'>
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
          <Linkify options={options}>
            <p className='whitespace-pre-wrap'>{content}</p>
          </Linkify>
          <Carousel className='mt-5 w-full h-[400px]'>
            <Image
              className='object-cover min-h-[400px] object-center'
              src={image}
              alt='post image'
            />
            <Image
              className='object-cover min-h-[400px] object-center'
              src={image}
              alt='post image'
            />
          </Carousel>
          <Separator className='my-4' />
        </div>
      </div>
    </ScrollArea>
  )
}

export default ViewPost