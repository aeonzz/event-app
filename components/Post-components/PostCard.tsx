import React, { FC } from 'react'
import { Card } from '../ui/card';
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
import { Calendar, MapPin } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import Linkify from "linkify-react";


interface postCardProps {
  post: {
    id: number
    title: string
    content: string | null
    author: {
      username: string
    }
    Tag: {
      name: string
    }
  }
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostCard: FC<postCardProps> = ({ post }) => {

  const { id, title, content, author, Tag } = post;
  const { username } = author;
  const { name } = Tag;

  return (
    <div className='relative w-full h-auto py-3 px-5 mt-10 border-t hover:bg-accent/20 transition-colors rounded-md'>
      <div className='flex items-center gap-2'>
        <ProfileHover />
        <div className='flex flex-col'>
          <Link
            href='/'
            className='hover:underline font-semibold'
          >
            {username}
          </Link>
          <Badge className='w-fit' variant='secondary'>{name}</Badge>
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
        {/* <Separator className='my-4' /> */}
      </div>
    </div>
  )
}

export default PostCard;