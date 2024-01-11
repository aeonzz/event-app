'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
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
import { BadgeCheck, Bookmark, Calendar, Check, Copy, Dot, Forward, Hand, Loader2, MapPin, MoreHorizontal, Pencil, Plus, Theater, ThumbsUp, Trash, X } from 'lucide-react';
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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ToastAction } from '../ui/toast';
import { Post } from '@prisma/client';
import { FormInputPost } from '@/types/post';
import { usePathname, useRouter } from 'next/navigation';
import TextArea from '../Admin-components/text-area';
import { useMutationSuccess } from '../Context/mutateContext';
import { Interactions } from '@/types/interactions';
import { toast } from 'sonner';


interface PostCardProps {
  post: Posts
  profile?: boolean
  profileId?: number
  tag?: string | null
  innerRef?: React.Ref<HTMLDivElement>
  session?: Session | null
  onMutationSuccess?: () => void
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostCard: FC<PostCardProps> = ({ post, tag, innerRef, session, onMutationSuccess, profile, profileId }) => {

  const { id, title, content, author, Tag, createdAt, anonymous, images, venue, location, published, deleted, clicks, UserPostInteraction, timeFrom, timeTo, accessibility } = post;
  const { id: authorId, username, email } = author
  const { name, tagId } = Tag
  const going = UserPostInteraction.length > 0 ? UserPostInteraction[0].going : false;

  const userIdString = session?.user.id;
  const userIdNumber = userIdString ? parseInt(userIdString, 10) : null;
  const router = useRouter()
  const pathname = usePathname()
  const fw = tag === 'fw'
  const click = post.clicks;
  const fwall = pathname === '/freedom-wall'
  const textRef = useRef<HTMLInputElement>(null);
  const postedAt = new Date(createdAt)
  const authorCreatedAt = new Date(author.createdAt)
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [goingButtonState, setGoingButtonState] = useState(going)
  const [saveButtonState, setsaveButtonState] = useState(false)
  const [actionDropdown, setActionDropdown] = useState(false)
  const [attendModal, setAttendModal] = useState(false)
  const [openCopyToClipboard, setOpenCopyToClipboard] = useState(false)
  const [open, setOpen] = useState(false)
  const [toggleImageInput, setToggleImageInput] = useState(false)
  const contentToDisplay = showFullContent ? content : content?.slice(0, 500);

  const onChangeOptionState = (newChangeOptionState: boolean) => {
    setToggleImageInput(newChangeOptionState)
  }

  const onChangeDropdownState = (newChangeDropdownState: boolean) => {
    setActionDropdown(newChangeDropdownState)
  }

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  useEffect(() => {
    if (!open) {
      setToggleImageInput(false);
    }
  }, [open]);

  useEffect(() => {
    setGoingButtonState(going);
  }, [going]);

  const copyToClipboard = () => {
    if (textRef.current) {
      let copyText = textRef.current.value;
      let isCopy = copy(copyText);
      if (isCopy) {
        setOpenCopyToClipboard(false)
        toast("Copied to clipboard")
      }
    }
  }

  const { mutate: deletePost, data } = useMutation({
    mutationFn: async (deletePost: FormInputPost) => {
      return axios.patch(`/api/posts/${id}`, deletePost);
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not delete post, Try again later.",
        action: {
          label: "Try again",
          onClick: () => handleDelete(),
        },
      })
    },
    onSuccess: () => {
      setActionDropdown(false)
      onMutationSuccess && onMutationSuccess();
      toast.success("Delete Successful", {
        description: "post successfully deleted.",
      })
    }
  })

  const { mutate: updateClicks } = useMutation({
    mutationFn: async (updateClicks: FormInputPost) => {
      return axios.patch(`/api/posts/${id}`, updateClicks);
    },
  })

  const { mutate: updateGoingStatus } = useMutation({
    mutationFn: async (updateGoingStatus: Interactions) => {
      return axios.patch(`/api/interaction/${id}`, updateGoingStatus);
    },
    onSuccess: () => {
      setIsLoading(false)
      setAttendModal(false)
      setGoingButtonState((prev) => !prev);
      onMutationSuccess && onMutationSuccess();
    },
  });

  function handleDelete() {
    setIsLoading(true)
    const data: FormInputPost = {
      title: title,
      content: content || undefined,
      anonymous: anonymous,
      venue: venue || undefined,
      location: location || undefined,
      accessibility: accessibility,
      published: published,
      deleted: true,
      category: name,
      authorId: authorId,
      clicks: 1,
      going: going || undefined,
      timeFrom: timeFrom || undefined,
      timeTo: timeTo || undefined,
      status: 'fw'
    };
    deletePost(data)
  }

  const handleGoingClick = () => {
    setIsLoading(true)
    const data: Interactions = {
      postId: id,
      userId: userIdNumber,
      going: !goingButtonState,
    };
    updateGoingStatus(data);
  };

  function handleClick() {
    const data: FormInputPost = {
      title: title,
      content: content || undefined,
      anonymous: anonymous,
      venue: venue || undefined,
      location: location || undefined,
      accessibility: accessibility,
      published: published,
      deleted: false,
      category: name,
      authorId: authorId,
      clicks: click,
      going: going || undefined,
      timeFrom: timeFrom || undefined,
      timeTo: timeTo || undefined,
      status: 'fw'
    };
    updateClicks(data)
  }

  if (tag === 'announcement' && post.accessibility === 'department' && session?.user.department !== post.author.department) {
    return null
  }

  if (tag && name !== tag) {
    return null;
  }

  if (profile && post.author.id !== profileId) {
    return null
  }

  if (deleted) {
    return null;
  }

  if (profile && userIdNumber !== profileId && post.anonymous) {
    return null;
  }

  return (
    <div ref={innerRef} className='relative w-full h-auto py-3 px-5 mb-3 border bg-stone-900/50 transition-colors rounded-md overflow-hidden'>
      <div className='flex justify-between'>
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
            <ProfileHover
              username={username}
              date={format(authorCreatedAt, 'PP')}
              userId={post.author.id}
              imageUrl={post.author.imageUrl}
            />
            <div className='flex flex-col'>
              <Link
                href='/'
                className='hover:underline font-semibold flex items-center gap-1'
              >
                {username}
                {post.author.role === 'SYSTEMADMIN' && (
                  <BadgeCheck className='h-4 w-4 text-primary' />
                )}
              </Link>
              <div className='flex items-center'>
                <p className='text-xs font-light text-muted-foreground'>
                  {formatDistanceToNow(postedAt, { addSuffix: true })}
                </p>
                {fw ? null : (
                  <>
                    <Dot />
                    <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <DropdownMenu open={actionDropdown} onOpenChange={setActionDropdown} modal={false}>
          <DropdownMenuTrigger asChild >
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
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger className='w-full'>
                    <DropdownMenuItem
                      className='text-xs'
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className={cn(
                    toggleImageInput ? 'sm:max-w-[900px]' : 'sm:max-w-[540px]',
                    'duration-300'
                  )}>
                    <DialogHeader>
                      <DialogTitle>Edit post</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <TextArea
                      tag={name}
                      editData={post}
                      username={username}
                      authorId={userIdNumber}
                      fwall={fwall}
                      imageUrl={session.user.imageUrl}
                      updateOpenState={setOpen}
                      onChangeOptionState={onChangeOptionState}
                      toggleImageInput={toggleImageInput}
                      onMutationSuccess={onMutationSuccess}
                      onChangeDropdownState={onChangeDropdownState}
                    />
                  </DialogContent>
                </Dialog>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 text-xs"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold" >Are you absolutely sure?</DialogTitle>
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
      </div>
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
        {/* {fw ? null : (
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
        )} */}
        {fw ? null : (
          <Link
            href={`/post/${id}`}
            replace={true}
            onClick={() => handleClick()}
          >
            <div className='relative w-full flex overflow-hidden rounded-sm mt-5'>
              <div
                className={cn(
                  images?.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
                  'flex-1 grid gap-[1px] w-full'
                )}
              >
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
            </div>
          </Link>
        )}
        {!fw && (
          <h3 className='text-muted-foreground text-xs mt-1 text-right'>{clicks} Views</h3>
        )}
        <Separator className='my-2' />
        <div className='w-full flex p-1'>
          {tag === 'event' && (
            <Dialog open={attendModal} onOpenChange={setAttendModal}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className={cn(
                    goingButtonState ? 'text-primary hover:text-primary' : 'text-muted-foreground',
                    'relative flex-1 transition-colors'
                  )}
                >
                  <ThumbsUp
                    className={cn(
                      goingButtonState ? 'fill-primary stroke-primary' : 'stroke-muted-foreground',
                      'absolute left-[27%] bottom-[30%] h-4 w-4 transition-colors'
                    )}
                  />
                  Attend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold" >Confirmation</DialogTitle>
                  <DialogDescription>
                    {goingButtonState ? (
                      <p>Are you sure you want to ditch this event? Aren&apos;t you ashamed that you joined the event and now you&apos;ve changed your mind?</p>
                    ) : (
                      <p>Are you sure you want to attend this event?.</p>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  {goingButtonState ? (
                    <Button
                      variant='destructive'
                      onClick={handleGoingClick}
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Ditch
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGoingClick}
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Confirm
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
                    defaultValue={`event-app-aeonzz.vercel.app/post/${id}`}
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
          />
        ) : (
          null
        )}
      </div>
    </div>
  )
}

export default PostCard;
