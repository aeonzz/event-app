import React, { FC } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostReviewProps {
  reviewStyle?: string
}

const PostReview: FC<PostReviewProps> = ({ reviewStyle }) => {
  return (
    <Card className='w-[100%]'>
      <CardHeader className='flex flex-row items-center p-2 space-y-0'>
        <CardDescription className='flex-1 ml-3'>Approve this post?</CardDescription>
        <div className='flex-1 flex justify-end items-center'>
          <Button
            variant='ghost'
            size='sm'
            className='text-green-600 hover:text-green-500 text-xs'
          >
            <Check className='mt-0.5 h-[1.2rem] w-[1.2rem]' />
            <span className={cn(
              reviewStyle,
              'ml-1'
            )}>
              Approve
            </span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-red-600 hover:text-red-500 hover:bg-red-500/20 text-xs'
          >
            <X className='h-[1.2rem] w-[1.2rem]' />
            <span className={cn(
              reviewStyle,
              'ml-1'
            )}>
              Reject
            </span>
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

export default PostReview