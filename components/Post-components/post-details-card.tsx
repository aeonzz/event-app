'use client'

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Posts } from '@/types/posts'
import React, { FC, useEffect, useRef, useState } from 'react'
import ProfileHover from '../profileHover'
import Link from 'next/link'
import { Badge } from '../ui/badge'
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
  DialogTrigger,
  DialogContent2
} from '../ui/dialog'
import { Button, buttonVariants } from '../ui/button'
import { Ban, Bookmark, Calendar, Copy, Dot, Forward, Loader2, MapPin, MonitorPause, MoreHorizontal, Pencil, Theater, ThumbsUp, Trash } from 'lucide-react'
import { Separator } from '@radix-ui/react-dropdown-menu'
import TextArea from '../Admin-components/text-area'
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { Session } from 'next-auth'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FormInputPost } from '@/types/post'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ToastAction } from '../ui/toast'
import Linkify from 'linkify-react'
import Image from 'next/image'
import ImageSlider from './image-slider'
import { Interactions } from "@/types/interactions"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import copy from "copy-to-clipboard"
import { toast } from "sonner"
import PostReview from "./PostReview"


interface PostDetailsCardProps {
  session: Session | null
  post: Posts
}

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostDetailsCard: FC<PostDetailsCardProps> = ({ session, post }) => {

  const { UserPostInteraction, images } = post;
  const pathname = usePathname()
  const router = useRouter()
  const textRef = useRef<HTMLInputElement>(null);
  const userIdString = session?.user.id;
  const userIdNumber = userIdString ? parseInt(userIdString, 10) : null;
  const fwall = pathname === '/freedom-wall'
  const postedAt = new Date(post.createdAt)
  const authorCreatedAt = new Date(post.author.createdAt)
  const going = UserPostInteraction.length > 0 ? UserPostInteraction[0].going : false;


  const [actionDropdown, setActionDropdown] = useState(false)
  const [saveButtonState, setsaveButtonState] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false);
  const [openCopyToClipboard, setOpenCopyToClipboard] = useState(false)
  const [status, setStatus] = useState(post.status)
  const [open, setOpen] = useState(false)
  const [toggleImageInput, setToggleImageInput] = useState(false)
  const [attendModal, setAttendModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [goingButtonState, setGoingButtonState] = useState(going)
  const contentToDisplay = showFullContent ? post.content : post.content?.slice(0, 500);
  const dateFrom = post.dateFrom ? new Date(post.dateFrom) : undefined;
  const dateTo = post.dateTo ? new Date(post.dateTo) : undefined;

  const date =
    dateTo
      ? dateFrom
        ? `from ${format(dateFrom, 'PP')} to ${format(dateTo, 'PP')}` +
        (post.timeTo ? `, ${convertTimeTo12HourFormat(post.timeFrom)} - ${convertTimeTo12HourFormat(post.timeTo)}` : `, ${convertTimeTo12HourFormat(post.timeFrom)}`)
        : 'No date available'
      : dateFrom
        ? `On ${format(dateFrom, 'PP')}` +
        (post.timeTo ? `, ${convertTimeTo12HourFormat(post.timeFrom)} - ${convertTimeTo12HourFormat(post.timeTo)}` : `, ${convertTimeTo12HourFormat(post.timeFrom)}`)
        : 'No date available';

  function convertTimeTo12HourFormat(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const timeIn12HourFormat = `${(parseInt(hours, 10) % 12) || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
    return timeIn12HourFormat;
  }

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


  const { mutate: deletePost } = useMutation({
    mutationFn: async (deletePost: FormInputPost) => {
      return axios.patch(`/api/posts/${post?.id}`, deletePost);
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
      if (post.Tag.name === 'event') {
        router.push('/events')
        toast.success("Delete Successful", {
          description: "Event successfully deleted.",
        })
      } else {
        router.push('/announcements')
        toast.success("Delete Successful", {
          description: "Announcement successfully deleted.",
        })
      }
    }
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (updateStatus: FormInputPost) => {
      return axios.patch(`/api/posts/${post?.id}`, updateStatus);
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Please Try again later.",
        action: {
          label: "Try again",
          onClick: () => handleStatusUpdate(),
        },
      })
    },
    onSuccess: () => {
      setIsLoading(false)
      setAttendModal(false)
      router.refresh()
      toast("Event Postponed")
    }
  })

  const { mutate: updateGoingStatus } = useMutation({
    mutationFn: async (updateGoingStatus: Interactions) => {
      return axios.patch(`/api/interaction/${post.id}`, updateGoingStatus);
    },
    onSuccess: () => {
      setIsLoading(false)
      setAttendModal(false)
      setGoingButtonState((prev) => !prev);
      if (!goingButtonState) {
        toast("Participated", {
          description: date,
        })
      }
      router.refresh()
    },
  });

  function handleDelete() {
    setIsLoading(true)
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: post.anonymous,
      venue: post.venue || undefined,
      location: post.location || undefined,
      published: post.published,
      deleted: true,
      category: post.Tag.name,
      authorId: post.author.id,
      clicks: post.clicks,
      status: post.status,
      going: going || undefined,
      timeFrom: post.timeFrom,
      timeTo: post.timeTo
    };
    deletePost(data)
  }

  function handleStatusUpdate() {
    setIsLoading(true)
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: post.anonymous,
      venue: post.venue || undefined,
      location: post.location || undefined,
      published: post.published,
      deleted: post.deleted,
      category: post.Tag.name,
      authorId: post.author.id,
      clicks: post.clicks,
      status: status,
      going: going || undefined,
      timeFrom: post.timeFrom,
      timeTo: post.timeTo
    };
    updateStatus(data)
  }

  const handleGoingClick = () => {
    setIsLoading(true)
    const data: Interactions = {
      postId: post.id,
      userId: userIdNumber,
      going: !goingButtonState,
    };
    updateGoingStatus(data);
  };

  return (
    <div className='relative w-full h-auto py-3 px-5 my-5 border bg-stone-900/50 transition-colors rounded-md'>
      <div className='relative flex items-center gap-2'>
        <ProfileHover
          username={post.author.username}
          date={format(authorCreatedAt, 'PP')}
          imageUrl={post.author.imageUrl}
        />
        <div className='flex flex-col'>
          <Link
            href='/'
            className='hover:underline font-semibold'
          >
            {post.author.username}
          </Link>
          <div className='flex items-center'>
            <p className='text-xs font-light text-muted-foreground'>
              {formatDistanceToNow(postedAt, { addSuffix: true })}
            </p>
            <Dot />
            <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
            {post.Tag.name === 'event' && (
              <Badge
                className={cn(
                  post.status === 'eventDay' && 'text-[#FFA500]',
                  post.status === 'upcoming' && 'text-[#3498db]',
                  post.status === 'ongoing' && 'text-[#2ecc71] animate-pulse',
                  post.status === 'completed' && 'text-[#27ae60]',
                  post.status === 'cancelled' && 'text-[#e74c3c]',
                  post.status === 'postponed' && 'text-[#f39c12]',
                  'w-fit ml-2'
                )}
                variant='secondary'>
                {post.status === 'eventDay' && <p>Today</p>}
                {post.status === 'upcoming' && <p>Upcoming</p>}
                {post.status === 'ongoing' && <p>Ongoing</p>}
                {post.status === 'completed' && <p>Completed</p>}
                {post.status === 'cancelled' && <p>Cancelled</p>}
                {post.status === 'postponed' && <p>Postponed</p>}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu open={actionDropdown} onOpenChange={setActionDropdown} modal={false}>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'absolute right-0 top-0'
            )}>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='min-w-[80px]' onCloseAutoFocus={(e) => e.preventDefault()}>
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
            {session!.user.email === post.author.email && (
              <>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger
                    className='w-full'
                    disabled={post.status !== 'upcoming' && post.status !== 'postponed'}
                  >
                    <DropdownMenuItem
                      className='text-xs'
                      onSelect={(e) => e.preventDefault()}
                      disabled={post.status !== 'upcoming' && post.status !== 'postponed'}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {post.status === 'postponed' ? <p>Reschedule</p> : <p>Edit</p>}
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className={cn(
                    toggleImageInput ? 'max-w-[1000px]' : 'max-w-[600px]',
                    'duration-300'
                  )}>
                    <DialogHeader>
                      <DialogTitle>Edit post</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <TextArea
                      tag={post.Tag.name}
                      editData={post}
                      username={post.author.username}
                      authorId={userIdNumber}
                      fwall={fwall}
                      imageUrl={session?.user.imageUrl}
                      updateOpenState={setOpen}
                      onChangeOptionState={onChangeOptionState}
                      toggleImageInput={toggleImageInput}
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
        <h1 className='font-semibold text-3xl mb-3'>{post.title}</h1>
        <Linkify options={options}>
          <p className='whitespace-pre-wrap break-words text-stone-200'>
            {contentToDisplay}
            {post.content!.length > 500 && (
              <Button
                variant='link'
                onClick={toggleContentVisibility}
                className='ml-1 -mt-5 p-0 text-slate-300 font-semibold'>
                {showFullContent ? 'See Less' : '...See More'}
              </Button>
            )}
          </p>
        </Linkify>
        <div className='flex w-full items-center my-5 gap-3'>
          {post.dateFrom && (
            <Badge variant='secondary' className='flex items-center p-2'>
              <Calendar className='stroke-primary h-4 w-4 mr-2' />
              <p className='text-xs text-muted-foreground'>
                {date}
              </p>
            </Badge>
          )}
          {post.location && (
            <Badge variant='secondary' className='flex items-center p-2'>
              <MapPin className='stroke-primary h-4 w-4 mr-2' />
              <p className='text-xs text-muted-foreground'>{post.location}</p>
            </Badge>
          )}
          {post.venue && (
            <Badge variant='secondary' className='flex items-center p-2'>
              <Theater className='stroke-primary h-4 w-4 mr-2' />
              <p className='text-xs text-muted-foreground'>{post.venue}</p>
            </Badge>
          )}
        </div>
        <div className='relative w-full flex justify-center rounded-sm'>
          <Dialog>
            <DialogTrigger>
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
            </DialogTrigger>
            <DialogContent2>
              <ImageSlider
                images={images}
              />
            </DialogContent2>
          </Dialog>
        </div>
        <h3 className='text-muted-foreground text-xs mt-1 text-right'>{post.clicks} Views</h3>
        <Separator className='my-2' />
        <div className='w-full flex p-1'>
          {post.Tag.name === 'event' && post.author.email !== session?.user.email ? (
            <Dialog open={attendModal} onOpenChange={setAttendModal}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className={cn(
                    goingButtonState ? 'text-primary hover:text-primary' : 'text-muted-foreground',
                    'relative flex-1 transition-colors'
                  )}
                  disabled={post.status !== 'upcoming'}
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
              <DialogContent forceMount={true}>
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
          ) : (
            <Dialog open={attendModal} onOpenChange={setAttendModal}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='relative flex-1 transition-colors text-muted-foreground'
                  onClick={() => setStatus('postponed')}
                  disabled={post.status === 'postponed' || post.status === 'cancelled'}
                >
                  <MonitorPause className='absolute left-[25%] h-4 w-4 transition-colors stroke-muted-foreground' />
                  {post.status === 'postponed' ? <p>Postponed</p> : <p>Postpone</p>}
                </Button>
              </DialogTrigger>
              <DialogContent forceMount={true}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold" >Confirmation</DialogTitle>
                  <DialogDescription>
                    <p>Are you certain you wish to postpone this event? This action is irreversible.</p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {post.Tag.name === 'event' && post.author.email !== session?.user.email ? (
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
          ) : (
            <Dialog open={attendModal} onOpenChange={setAttendModal}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='relative flex-1 transition-colors text-muted-foreground'
                  onClick={() => setStatus('cancelled')}
                  disabled={post.status === 'cancelled'}
                >
                  <Ban className='absolute left-[29%] h-4 w-4 transition-colors stroke-muted-foreground' />
                  {post.status === 'cancelled' ? <p>Cancelled</p> : <p>Cancel</p>}
                </Button>
              </DialogTrigger>
              <DialogContent forceMount={true}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold" >Confirmation</DialogTitle>
                  <DialogDescription>
                    <p>Are you certain you wish to postpone this event? This action is irreversible.</p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
                    defaultValue={`localhost:3000/post/${post.id}`}
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

export default PostDetailsCard