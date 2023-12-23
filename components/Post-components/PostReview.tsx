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
import { toast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';
import { Posts } from '@/types/posts';

interface PostReviewProps {
  post: Posts
  onMutationSuccess?: () => void
}

const PostReview: FC<PostReviewProps> = ({ post, onMutationSuccess }) => {

  const id = post?.id
  console.log(post?.title)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: approval } = useMutation({
    mutationFn: async (approval: FormInputPost) => {
      return axios.patch(`/api/posts/${id}`, approval);
    },
    onError: (error) => {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not approve post, Try again later.",
        action: <ToastAction altText="Try again" onClick={() => handleApproval()}>Try again</ToastAction>,
      })
    },
    onSuccess: () => {
      onMutationSuccess && onMutationSuccess();
      toast({
        variant: "default",
        title: "Successful",
        description: "Post successfully approved.",
      })
    }
  })

  const handleApproval = () => {
    setIsLoading(true)
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: false,
      venue: post.venue || undefined,
      location: post.location || undefined,
      published: true,
      deleted: post.deleted,
      category: post.Tag.name || undefined,
      authorId: post.author.id || undefined,
      clicks: 0,
      going: undefined
    };
    approval(data)
  }

  return (
    <Card className='w-[100%] mt-1'>
      <CardHeader className='flex flex-row items-center p-2 space-y-0'>
        <CardDescription className='flex-1 ml-3'>Approve this post?</CardDescription>
        <div className='flex-1 flex justify-end items-center'>
          <Button
            variant='ghost'
            size='sm'
            className='text-green-600 hover:text-green-500 text-xs'
            onClick={() => handleApproval()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Check className='mt-0.5 h-[1.2rem] w-[1.2rem]' />
            )}
            Approve
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-red-600 hover:text-red-500 hover:bg-red-500/20 text-xs'
          >
            <X className='h-[1.2rem] w-[1.2rem]' />
            Reject
          </Button>
        </div>
      </CardHeader>
    </Card >
  )
}

export default PostReview