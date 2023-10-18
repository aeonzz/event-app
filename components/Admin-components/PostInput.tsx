'use client'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React from 'react'
<<<<<<< HEAD
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import {
  CalendarDays,
  ChevronDown,
  ImagePlus,
  Smile
} from "lucide-react"
=======
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { CalendarDays, ChevronDown } from "lucide-react"
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "../ui/use-toast"
import { Textarea } from "../ui/textarea"
<<<<<<< HEAD
=======
import { Label } from "../ui/label"
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "../ui/hover-card"
import { Skeleton } from "../ui/skeleton"
<<<<<<< HEAD
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  Theme
} from 'emoji-picker-react';
=======
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0

interface PostInput {
  initalletter: string
  username?: string
}

<<<<<<< HEAD
interface TextArea {
  username?: string
}

=======
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
const FormSchema = z.object({
  post: z
    .string()
    .min(10, {
      message: "Post must be at least 10 characters.",
    })
<<<<<<< HEAD
})

export const TextArea: React.FC<TextArea> = ({ username }) => {


  const [category, setCategory] = React.useState("Events");
  const [selectedEmoji, setSelectedEmoji] = React.useState<string>("1f60a");
  const [inputValue, setInputValue] = React.useState<string>("");

=======
    .max(500, {
      message: "Post must not be longer than 500 characters.",
    }),
})

export const PostSwitcher = () => {
  const [position, setPosition] = React.useState("events")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className='h-6 px-3 min-w-[50px] rounded-sm text-xs font-light '
        >
          {position}
          <ChevronDown className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-36 max-w-sm'>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="events">Event</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="announcements">Announcements</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TextArea = () => {
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

<<<<<<< HEAD
  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    setInputValue(
      (inputValue) =>
        inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
    setSelectedEmoji(emojiData.unified);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className='flex gap-2'>
            <Avatar className='h-9 w-9 dark:border relative group'>
              <Link
                href='/user/profile'
                className='relative'
              >
                <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75'
                  className='object-cover'
                />
                <AvatarFallback className='h-9 w-9 bg-stone-900'></AvatarFallback>
              </Link>
            </Avatar>
            <div className='w-full'>
              <p className='text-sm font-normal mb-0.5'>{username}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className='h-6 px-3 min-w-[50px] rounded-sm text-xs font-light '
                  >
                    {category}
                    <ChevronDown className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-36 max-w-sm'>
                  <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                    <DropdownMenuRadioItem value="Events">Event</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Announcements">Announcements</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    value={inputValue}
                    placeholder="Write your post here..."
                    className="resize-none border-none"
                    // {...field}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </FormControl>
                <div className='h-4'>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div>
            <div className='flex w-full justify-end mb-2'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size='icon'
                  >
                    <Smile
                      className='text-muted-foreground'
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className='!w-fit !p-0 border-none left-[65%] top-[40%]'>
                  <EmojiPicker
                    onEmojiClick={onClick}
                    autoFocusSearch={false}
                    emojiStyle={EmojiStyle.NATIVE}
                    theme={Theme.AUTO}
                    lazyLoadEmojis={true}
                    searchDisabled
                    width={300}
                    height={300}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {category === 'Events' && (
              <div className='border w-full py-2 px-3 flex items-center rounded-md'>
                <div
                  className='cursor-pointer'
                >
                  <ImagePlus className='text-muted-foreground' />
                </div>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className='w-full'
          >
            Post
          </Button>
        </form>
      </Form >
    </>
  )
}

const PostInput: React.FC<PostInput> = ({ username }) => {

=======
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your post here..."
                  className="resize-none border-none"
                  {...field}
                />
              </FormControl>
              <div className='h-4'>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className='w-full'
        >
          Post
        </Button>
      </form>
    </Form>
  )
}

const PostInput: React.FC<PostInput> = ({ initalletter, username }) => {
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
  return (
    <div className='flex items-center gap-3'>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className='h-9 w-9 dark:border relative group'>
            <Link
              href='/user/profile'
              className='relative'
            >
              <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
              <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75'
                className='object-cover'
              />
              <AvatarFallback className='h-9 w-9'>
                <Skeleton />
              </AvatarFallback>
            </Link>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75'
                className='object-cover'
              />
              <AvatarFallback className='h-9 w-9 bg-stone-900'></AvatarFallback>
            </Avatar>
            <div className="space-y-1">
<<<<<<< HEAD
              <h4 className="text-sm font-semibold"></h4>
              <p className="text-sm">
                The React Framework - created and maintained by @vercel.
=======
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">
                The React Framework – created and maintained by @vercel.
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
              </p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <Dialog>
        <DialogTrigger className='w-full'>
          <Input
            placeholder='Create Post ...'
            className='focus-visible:ring-0 focus-visible:ring-black dark:bg-secondary hover:dark:bg-stone-700 transition'
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>
          <Separator />
<<<<<<< HEAD
          <TextArea username={username} />
=======
          <div className='flex gap-2'>
            <Avatar className='h-9 w-9 dark:border relative group'>
              <Link
                href='/user/profile'
                className='relative'
              >
                <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75'
                  className='object-cover'
                />
                <AvatarFallback className='h-9 w-9 bg-stone-900'></AvatarFallback>
              </Link>
            </Avatar>
            <div>
              <p className='text-sm font-normal mb-0.5'>{username}</p>
              <PostSwitcher />
            </div>
          </div>
          <TextArea />
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostInput;