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
import React, { useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import {
  CalendarDays,
  ChevronDown,
  ImagePlus,
  Loader2,
  Smile
} from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "../ui/use-toast"
import { Textarea } from "../ui/textarea"
import { Skeleton } from "../ui/skeleton"
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  Theme
} from 'emoji-picker-react';
import ProfileHover from "../profileHover"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Tag } from "@prisma/client"
import { FormInputPost } from "@/types/post"
import { useRouter } from "next/navigation"
import { ToastAction } from "../ui/toast"

interface PostInput {
  initalletter: string
  username?: string
  authorId: string
}

interface TextArea {
  username?: string
  authorId: string
  updateOpenState: (newOpenState: boolean) => void;
}

const PostSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  post: z
    .string()
    .min(10, {
      message: "Post must be at least 10 characters.",
    }),
})

export const TextArea: React.FC<TextArea> = ({ username, authorId, updateOpenState }) => {

  const router = useRouter();
  const [category, setCategory] = useState("event")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string>("1f60a")
  const [inputValue, setInputValue] = useState<string>("")

  const { data: dataTags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags')
      return response.data;
    }
  })

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
  })

  const { mutate: createpost } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.post('/api/posts/create', newPost)
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not create post, Try again later.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
    onSuccess: () => {
      toast({
        description: "Post created.",
      })

      updateOpenState(false);
      router.refresh()
    }
  })

  function onSubmit(data: z.infer<typeof PostSchema>) {

    const postData: FormInputPost = { ...data, authorId, category };

    if (postData) {

      setIsLoading(true)

      createpost(postData);
    }

    // console.log(JSON.stringify(postData))
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
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
                    {dataTags?.map((item) => (
                      <DropdownMenuRadioItem
                        key={item.tagId}
                        value={item.name}
                      >
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className='border-none text-lg placeholder:font-medium focus-visible:ring-transparent'
                    placeholder="Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Write your post here..."
                    className="resize-none border-none placeholder:font-medium"
                    {...field}
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
            {category === 'event' && (
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <p>Processing...</p>
              </>
            ) : (
              <p>Post</p>
            )}
          </Button>
        </form>
      </Form >
    </>
  )
}

const PostInput: React.FC<PostInput> = ({ username, authorId }) => {

  const [open, setOpen] = React.useState(false)

  return (
    <div className='flex items-center gap-3'>
      <ProfileHover />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='w-full'>
          <Input
            placeholder='Create Post ...'
            className='focus-visible:ring-0 border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-black bg-transparent transition'
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]" >
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>
          <Separator />
          <TextArea username={username} authorId={authorId} updateOpenState={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostInput;