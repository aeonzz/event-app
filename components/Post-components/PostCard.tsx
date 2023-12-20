'use client'

import React, { FC, useRef, useState } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import ProfileHover from '../profileHover';
import { Badge } from '../ui/badge';
import { Bookmark, Calendar, Check, Copy, Dot, Forward, Hand, Loader2, MapPin, MoreHorizontal, Pencil, Plus, Theater, ThumbsUp, Trash, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import Linkify from "linkify-react";
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { Posts } from '@/types/posts';
import { Button } from '../ui/button';
import PostReview from './PostReview';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import copy from "copy-to-clipboard";
import { toast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ToastAction } from '../ui/toast';
import { Post } from '@prisma/client';
import { FormInputPost } from '@/types/post';
import { useRouter } from 'next/navigation';


interface PostCardProps {
  post: Posts
  tag?: string | null
  fw?: boolean | null
  innerRef?: React.Ref<HTMLDivElement>
  session?: Session | null
  onMutationSuccess? : () => void
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostCard: FC<PostCardProps> = ({ post, tag, innerRef, fw, session, onMutationSuccess }) => {

  const { id, title, content, author, Tag, createdAt, anonymous, images, venue, location, date, published, deleted } = post;
  const { id: authorId, username, email } = author
  const { name, tagId } = Tag
  const router = useRouter()
  const textRef = useRef<HTMLInputElement>(null);
  const postedAt = new Date(createdAt)
  const authorCreatedAt = new Date(author.createdAt)
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [goingButtonState, setgoingButtonState] = useState(false)
  const [saveButtonState, setsaveButtonState] = useState(false)
  const [actionDropdown, setActionDropdown] = useState(false)
  const [openCopyToClipboard, setOpenCopyToClipboard] = useState(false)

  const contentToDisplay = showFullContent ? content : content?.slice(0, 500);

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  const copyToClipboard = () => {
    if (textRef.current) {
      let copyText = textRef.current.value;
      let isCopy = copy(copyText);
      if (isCopy) {
        setOpenCopyToClipboard(false)
        toast({
          description: "Copied to clipboard",
        })
      }
    }
  };

  const { mutate: deletePost, data } = useMutation({
    mutationFn: async (deletePost: FormInputPost) => {
      return axios.patch(`/api/posts/${id}`, deletePost);
    },
    onError: (error) => {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not delete post, Try again later.",
        action: <ToastAction altText="Try again" onClick={() => handleDelete()}>Try again</ToastAction>,
      })
    },
    onSuccess: () => {
      setActionDropdown(false)
      onMutationSuccess && onMutationSuccess();
      toast({
        variant: "default",
        title: "Delete Successful",
        description: "Post successfully deleted.",
      })
    }
  })

  const handleDelete = () => {
    setIsLoading(true)
    const data: FormInputPost = {
      title: title,
      content: content || undefined,
      anonymous: anonymous,
      venue: venue || undefined,
      location: location || undefined,
      published: published,
      deleted: true,
      category: tagId,
      authorId: authorId
    };
    deletePost(data)
  }

  if (tag && name !== tag) {
    return null;
  }

  if (deleted) {
    return null;
  }

  return (
    <div ref={innerRef} className='relative w-full h-auto py-3 px-5 mt-5 border bg-stone-900/50 transition-colors rounded-md overflow-hidden'>
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
        <div className='relative flex items-center gap-2'>
          <DropdownMenu modal={false} open={actionDropdown} onOpenChange={setActionDropdown}>
            <DropdownMenuTrigger
              className='absolute right-0 top-0'>
              <Button
                variant='ghost'
                size='icon'
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-[80px]'>
              <DropdownMenuItem
                onClick={() => setsaveButtonState((prev) => !prev)}
                className='text-xs'>
                <Bookmark
                  className={cn(
                    saveButtonState ? 'fill-current' : 'fill-transparent',
                    'mr-2 h-4 w-4'
                  )}
                />
                {saveButtonState ? <p>Saved</p> : <p>Save</p>}
              </DropdownMenuItem>
              {session?.user.email === email && (
                <>
                  <DropdownMenuItem className='text-xs'>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600 text-xs" onSelect={(e) => e.preventDefault()}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-1xl font-semibold" >Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the post from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete()}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          )}
                          Continue
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
        <h1 className='font-semibold text-2xl mb-3'>{title}</h1>
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
          <div className='flex w-full items-center my-5 gap-3'>
            {date && (
              <Badge variant='secondary' className='flex items-center p-2'>
                <Calendar className='stroke-primary h-4 w-4 mr-2' />
                <p className='text-xs text-muted-foreground'>{date}</p>
              </Badge>
            )}
            {location && (
              <Badge variant='secondary' className='flex items-center p-2'>
                <MapPin className='stroke-primary h-4 w-4 mr-2' />
                <p className='text-xs text-muted-foreground'>{location}</p>
              </Badge>
            )}
            {venue && (
              <Badge variant='secondary' className='flex items-center p-2'>
                <Theater className='stroke-primary h-4 w-4 mr-2' />
                <p className='text-xs text-muted-foreground'>{venue}</p>
              </Badge>
            )}
          </div>
        )}
        {fw ? null : (
          <div className='relative w-full flex overflow-hidden rounded-sm'>
            <Link href={`/post/${id}`} className='w-full'>
              <div
                className={cn(
                  images?.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
                  'flex-1 grid gap-[1px]'
                )}>
                {images?.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id}
                    className={cn(
                      images.length === 3 && index === 0 && 'col-span-2',
                      images.length === 1 ? 'h-[400px]' : 'h-[250px]',
                      'relative w-full'
                    )}>
                    <div className={cn(
                      index === 3 && images.length >= 5 && 'bg-black/40',
                      'absolute w-full h-full hover:bg-black/20 duration-300 flex justify-center items-center'
                    )}>
                      {index === 3 && images.length >= 5 && <p>More...</p>}
                    </div>
                    <Image
                      className='object-cover h-full w-full object-center'
                      src={image.url}
                      alt='post image'
                      width={1000}
                      height={1000}
                      quality={100}
                    />
                  </div>
                ))}
              </div>
            </Link>
          </div>
        )}
        <Separator className='mt-4 mb-1' />
        <div className='w-full flex p-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setgoingButtonState((prev) => !prev)}
            className={cn(
              goingButtonState ? 'text-primary hover:text-primary' : 'text-muted-foreground',
              'relative flex-1 transition-colors'
            )}
          >
            <ThumbsUp
              className={cn(
                goingButtonState ? 'fill-primary stroke-primary' : 'stroke-muted-foreground',
                'absolute left-[29%] h-4 w-4 transition-colors'
              )}
            />
            Going
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setsaveButtonState((prev) => !prev)}
            className={cn(
              saveButtonState ? 'text-primary hover:text-primary' : 'text-muted-foreground',
              'relative flex-1 transition-colors'
            )}
          >
            <Bookmark
              className={cn(
                saveButtonState ? 'fill-primary stroke-primary' : 'stroke-muted-foreground',
                'absolute left-[29%] h-4 w-4 transition-colors'
              )}
            />
            {saveButtonState ? <p>Saved</p> : <p>Save</p>}
          </Button>
          <Dialog open={openCopyToClipboard} onOpenChange={setOpenCopyToClipboard}>
            <DialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='relative flex-1 text-muted-foreground'
              >
                <Forward className="absolute left-[29%] h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue={`localhost:3000/post/${id}`}
                    readOnly
                    ref={textRef}
                  />
                </div>
                <Button
                  size="sm"
                  className="px-3"
                  onClick={() => copyToClipboard()}
                >
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {post.published === false ? (
          <PostReview
            post={post}
            onMutationSuccess={onMutationSuccess}
          />
        ) : (
          null
        )}
      </div>
    </div>
  )
}

export default PostCard;