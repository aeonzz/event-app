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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { CalendarDays, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "../ui/use-toast"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "../ui/hover-card"
import { Skeleton } from "../ui/skeleton"

interface PostInput {
  initalletter: string
  username?: string
}

const FormSchema = z.object({
  post: z
    .string()
    .min(10, {
      message: "Post must be at least 10 characters.",
    })
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
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">
                The React Framework – created and maintained by @vercel.
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostInput;