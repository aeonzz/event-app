'use client'

import React, { FC, useState } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormInputPost } from '@/types/post';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ToastAction } from '../ui/toast';
import { Posts } from '@/types/posts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMutationSuccess } from '../Context/mutateContext';
import { format } from 'date-fns';


interface PostReviewProps {
  post: Posts
  style?: boolean
}

const PostReview: FC<PostReviewProps> = ({ post, style }) => {

  const id = post?.id
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [approved, setApproved] = useState<boolean | undefined>(undefined)
  const { setIsMutate } = useMutationSuccess()
  const formattedActionDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");
  
  const { mutate: approval } = useMutation({
    mutationFn: async (approval: FormInputPost) => {
      return axios.patch(`/api/posts/${id}`, approval);
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not perform action, Try again later.",
      })
    },
    onSuccess: () => {
      const successMsg = post.Tag.name === 'event' ? 'Event' : 'Announcement';

      if (approved) {
        toast.success("Successful", {
          description: `${successMsg} approved.`,
        });
      } else {
        toast.success("Successful", {
          description: `${successMsg} rejected.`,
        });
      }
      setIsMutate(true)
      router.refresh()
    }
  })

  const handleApproval = (value: boolean) => {
    setIsLoading(true)
    setApproved(value)
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: false,
      venue: post.venue || undefined,
      location: post.location || undefined,
      accessibility: post.accessibility,
      published: value,
      status: post.status,
      action: formattedActionDate,
      deleted: post.deleted,
      category: post.Tag.name || undefined,
      authorId: post.author.id || undefined,
      clicks: post.clicks,
      going: undefined,
      timeFrom: post.timeFrom,
      timeTo: post.timeTo
    };
    approval(data)
  }

  return (
    <>
      {style ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant='secondary'
                size='icon'
                className='text-green-600 hover:text-green-500 text-xs'
                onClick={() => {
                  handleApproval(true)
                }}
                disabled={isLoading}
              >
                <Check className='mt-0.5 h-[1.2rem] w-[1.2rem]' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left' sideOffset={5}>
              <p className='text-xs'>Approve</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant='secondary'
                size='icon'
                className='text-red-600 hover:text-red-500 hover:bg-red-500/20 text-xs'
                onClick={() => {
                  handleApproval(false)
                }}
                disabled={isLoading}
              >
                <X className='h-[1.2rem] w-[1.2rem]' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left' sideOffset={5}>
              <p className='text-xs'>Reject</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Card className='w-[100%] mt-1'>
          <CardHeader className='flex flex-row items-center p-2 space-y-0'>
            <CardDescription className='flex-1 ml-3'>Approve this post?</CardDescription>
            <div className='flex-1 flex justify-end items-center'>
              <Button
                variant='ghost'
                size='sm'
                className='text-green-600 hover:text-green-500 text-xs'
                onClick={() => handleApproval(true)}
                disabled={isLoading}
              >
                <Check className='mt-0.5 h-[1.2rem] w-[1.2rem]' />
                Approve
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='text-red-600 hover:text-red-500 hover:bg-red-500/20 text-xs'
                onClick={() => {
                  handleApproval(false)
                }}
                disabled={isLoading}
              >
                <X className='h-[1.2rem] w-[1.2rem]' />
                Reject
              </Button>
            </div>
          </CardHeader>
        </Card >
      )}
    </>
  )
}

export default PostReview