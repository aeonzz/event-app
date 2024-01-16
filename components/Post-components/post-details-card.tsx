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
import { AreaChart, BadgeCheck, Ban, Bookmark, Calendar, Copy, Dot, Forward, Loader2, MapPin, MonitorPause, MoreHorizontal, Pencil, SendHorizonal, Theater, ThumbsUp, Trash } from 'lucide-react'
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
import PostStatus from "./post-status"
import { Card } from "../ui/card"
import NotFound from "@/app/not-found"
import { useMutationSuccess } from "../Context/mutateContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import CommentBox from '../User-Components/comment-box';
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


interface PostDetailsCardProps {
  session: Session | null
  post: Posts
}

export type CommentPost = {
  comment: string
  postId: number
}

const FormSchema = z.object({
  comment: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const options = {
  target: '_blank',
  className: 'text-blue-500 hover:underline',
}

const PostDetailsCard: FC<PostDetailsCardProps> = ({ session, post }) => {

  const { UserPostInteraction, images } = post;
  const { isMutate, setIsMutate } = useMutationSuccess()
  const pathname = usePathname()
  const router = useRouter()
  const textRef = useRef<HTMLInputElement>(null);
  const userIdString = session?.user.id;
  const userIdNumber = userIdString ? parseInt(userIdString, 10) : null;
  const fwall = pathname === '/freedom-wall' || post.Tag.name === 'fw' ? true : null
  const postedAt = new Date(post.createdAt)
  const authorCreatedAt = new Date(post.author.createdAt)
  const going = UserPostInteraction.length > 0 ? UserPostInteraction[0].going : false;
  const formattedActionDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");
  const [actionDropdown, setActionDropdown] = useState(false)
  const [saveButtonState, setsaveButtonState] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false);
  const [openCopyToClipboard, setOpenCopyToClipboard] = useState(false)
  const [status, setStatus] = useState(post.status)
  const [open, setOpen] = useState(false)
  const [toggleImageInput, setToggleImageInput] = useState(false)
  const [attendModal, setAttendModal] = useState(false)
  const [postponeModal, setPostponeModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  })

  const { formState, handleSubmit, control, reset } = form;

  const onChangeOptionState = (newChangeOptionState: boolean) => {
    setToggleImageInput(newChangeOptionState)
  }

  const onChangeDropdownState = (newChangeDropdownState: boolean) => {
    setActionDropdown(newChangeDropdownState)
  }

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  const handleRefetch = () => {
    router.refresh()
    setIsMutate(false);
  };

  useEffect(() => {
    if (!open) {
      setToggleImageInput(false);
    }
  }, [open]);

  useEffect(() => {
    setGoingButtonState(going);
  }, [going]);

  useEffect(() => {
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate, setIsMutate]);

  useEffect(() => {
    handleClick()
  }, [])

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

  const { mutate: createComment } = useMutation({
    mutationFn: (newComment: CommentPost) => {
      return axios.post('/api/comments', newComment)
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not create post, Try again later.",
      })
    },
    onSuccess: async (data) => {
      setIsLoading(false)
      router.refresh()
      toast("Comment posted")
      reset();
    }
  })

  const { mutate: updateClicks } = useMutation({
    mutationFn: async (updateClicks: FormInputPost) => {
      return axios.patch(`/api/posts/${post.id}`, updateClicks);
    },
    onError: () => {
      router.refresh()
    },
    onSuccess: async () => {
      router.refresh()
    }
  })

  function handleClick() {
    const data: FormInputPost = {
      title: post.title,
      content: post.content || undefined,
      anonymous: post.anonymous,
      venue: post.venue || undefined,
      accessibility: post.accessibility,
      location: post.location || undefined,
      published: post.published,
      deleted: false,
      category: post.Tag.name,
      authorId: post.author.id,
      clicks: post.clicks + 1,
      status: post.status,
      going: undefined,
      timeFrom: post.timeFrom,
      timeTo: post.timeTo
    };
    updateClicks(data)
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
      router.refresh()
      if (status === 'postponed') {
        setPostponeModal(false)
        toast("Event Postponed")
      } else {
        setCancelModal(false)
        toast("Event Cancelled")
      }
    }
  })

  const { mutate: updateGoingStatus } = useMutation({
    mutationFn: async (updateGoingStatus: Interactions) => {
      return axios.patch(`/api/interaction/${post.id}`, updateGoingStatus);
    },
    onError: () => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Please Try again later.",
      })
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
      accessibility: post.accessibility,
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
      accessibility: post.accessibility,
      action: formattedActionDate,
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    const commentData: CommentPost = {
      ...data,
      postId: post.id
    }
    createComment(commentData);
  }

  if (post.deleted) {
    return <NotFound />
  }

  return (
    <div className='flex flex-col'>
      {post.published === null && session?.user.role === 'SYSTEMADMIN' ? (
        <PostReview
          post={post}
        />
      ) : (
        null
      )}
      <Card className='relative w-full h-auto py-3 px-5 my-5 transition-colors'>
        {post.anonymous ? (
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
          <div className="relative flex items-center gap-2">
            <ProfileHover
              username={post.author.username}
              date={format(authorCreatedAt, 'PP')}
              imageUrl={post.author.imageUrl}
              userId={post.author.id}
            />
            <div className='flex flex-col'>
              <Link
                href={`/user/${post.author.id}`}
                className='hover:underline font-semibold flex items-center gap-1'
              >
                {post.author.username}
                {post.author.role === 'SYSTEMADMIN' && (
                  <BadgeCheck className='h-4 w-4 text-red-500' />
                )}
                {post.author.role === 'ADMIN' && (
                  <BadgeCheck className='h-4 w-4 text-primary' />
                )}
              </Link>
              <div className='flex items-center'>
                <p className='text-xs font-light text-muted-foreground'>
                  {formatDistanceToNow(postedAt, { addSuffix: true })}
                </p>
                {post.Tag.name !== 'fw' && (
                  <>
                    <Dot />
                    <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
                  </>
                )}
                {post.Tag.name !== 'fw' && (
                  <PostStatus post={post} hidden="hidden" className="ml-2 !flex-row" />
                )}
              </div>
            </div>
          </div>
        )}
        <div className='relative flex items-center gap-2'>
          <DropdownMenu open={actionDropdown} onOpenChange={setActionDropdown} modal={false}>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'absolute right-0 top-0'
              )}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-[80px] bg-[#161312]' onCloseAutoFocus={(e) => e.preventDefault()}>
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
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className='text-xs'
                        onSelect={(e) => e.preventDefault()}
                        disabled={post.status !== 'upcoming' && post.status !== 'postponed' || post.published === null}
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
                  {post.Tag.name !== 'event' ? null : (
                    <Link
                      href={`/insights/post/${post.id}`}
                    >
                      <DropdownMenuItem className="text-xs">
                        <AreaChart className="mr-2 h-4 w-4" />
                        Insights
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600 text-xs"
                        onSelect={(e) => e.preventDefault()}
                        disabled={post.status !== 'upcoming'}
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
          <h1 className='font-semibold text-3xl mb-3 tracking-tight'>{post.title}</h1>
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
              <DialogTrigger className="w-full">
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
              <DialogContent2 className=" !w-auto !h-auto">
                <ImageSlider
                  images={images}
                />
              </DialogContent2>
            </Dialog>
          </div>
          <h3 className='text-muted-foreground text-xs mt-1 text-right'>{post.clicks} Views</h3>
          <Separator className='mt-2' />
          <div className='w-full flex p-1'>
            {post.Tag.name === 'event' ? (
              <>
                {post.author.email !== session?.user.email ? (
                  <Dialog open={attendModal} onOpenChange={setAttendModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className={cn(
                          goingButtonState ? 'text-primary hover:text-primary' : 'text-muted-foreground',
                          'relative flex-1 transition-colors'
                        )}
                        disabled={post.status !== 'upcoming' || post.accessibility === 'department' && session?.user.department !== post.author.department}
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
                  <Dialog open={postponeModal} onOpenChange={setPostponeModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='relative flex-1 transition-colors text-muted-foreground'
                        onClick={() => setStatus('postponed')}
                        disabled={post.status !== 'upcoming' && post.status !== 'eventDay'}
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
                {post.author.email !== session?.user.email ? (
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
                  <Dialog open={cancelModal} onOpenChange={setCancelModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='relative flex-1 transition-colors text-muted-foreground'
                        onClick={() => setStatus('cancelled')}
                        disabled={post.status !== 'upcoming' && post.status !== 'eventDay'}
                      >
                        <Ban className='absolute left-[29%] h-4 w-4 transition-colors stroke-muted-foreground' />
                        {post.status === 'cancelled' ? <p>Cancelled</p> : <p>Cancel</p>}
                      </Button>
                    </DialogTrigger>
                    <DialogContent forceMount={true}>
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold" >Confirmation</DialogTitle>
                        <DialogDescription>
                          <p>Are you certain you wish to cancel this event? This action is irreversible.</p>
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
                          defaultValue={`event-app-aeonzz.vercel.app/post/${post.id}`}
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
              </>
            ) : (
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
                        defaultValue={`event-app-aeonzz.vercel.app/post/${post.id}`}
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
            )}
          </div>
          <Separator className='mb-3' />
          <div className='h-auto flex flex-col gap-5'>
            <div className='flex flex-col gap-5 h-auto'>
              {post.Comment.map((comment) => (
                <CommentBox key={comment.id} comment={comment} />
              ))}
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3 mt-1 ">
                <div className='w-full space-y-6 '>
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Write a comment on this post..."
                            className='bg-[#161312]'
                            autoComplete="off"
                            disabled={isLoading}
                            {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  type="submit"
                  disabled={!formState.isDirty || isLoading}
                >
                  <SendHorizonal className='w-4 h-4' />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PostDetailsCard