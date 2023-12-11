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
import React, { ChangeEvent, useEffect, useState } from 'react'
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
import { usePathname, useRouter } from "next/navigation"
import { ToastAction } from "../ui/toast"
import LoadingSpinner from "../Loading/Spinner"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Card } from "../ui/card"

interface PostInput {
  initalletter: string
  username?: string
  authorId: string
  joined: string
}

interface TextArea {
  username?: string
  authorId: string
  fwall: boolean
  updateOpenState: (newOpenState: boolean) => void;
}

const PostSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  post: z
    .string()
    .min(10, {
      message: "Post must be at least 10 characters.",
    }),
  image: z
    .string()
    .optional(),
})

export const TextArea: React.FC<TextArea> = ({ username, authorId, updateOpenState, fwall }) => {

  const router = useRouter()
  const [category, setCategory] = useState(() => {
    if (fwall) {
      return "fw"
    } else {
      return "event"
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string>("1f60a")
  const [file, setFile] = useState<File>()
  const [inputValue, setInputValue] = useState<string>("")
  const [anonymous, setAnonymous] = useState(false)
  const [published, setPublished] = useState(fwall)
  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  const { data: dataTags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags')
      return response.data;
    }
  })

  const { mutate: createpost } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.post('/api/posts', newPost)
    },
    onError: (error) => {
      console.log(error)
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not create post, Try again later.",
      })
    },
    onSuccess: () => {
      toast({
        description: "Post created. Awaiting admin approval.",
      })
      updateOpenState(false);
      router.refresh()
    }
  })

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }

    setSelectedImage(target.files[0])
  }

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
  })

  function onSubmit(data: z.infer<typeof PostSchema>) {
    const postData: FormInputPost = { ...data, authorId, category, published, anonymous };
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
          <div className='flex gap-2 justify-between items-center'>
            <div className='flex'>
              {anonymous ? (
                <Avatar className='h-9 w-9 dark:border relative group'>
                  <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                  <AvatarImage src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/EJFa13qXUAEzWpm.png'
                    className='object-cover'
                  />
                  <AvatarFallback className='h-9 w-9 bg-stone-900'></AvatarFallback>
                </Avatar>
              ) : (
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
              )}
              <div className='w-fit flex flex-col justify-center ml-2'>
                <p className='text-sm font-normal mb-0.5'>{anonymous ? 'Anonymous participant' : username}</p>
                {fwall ? (
                  null
                ) : (
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
                        {isLoadingTags ? (
                          <LoadingSpinner />
                        ) : (
                          dataTags?.filter(item => item.name !== "fw")
                            .map((item) => (
                              <DropdownMenuRadioItem
                                key={item.tagId}
                                value={item.name}
                              >
                                {item.name}
                              </DropdownMenuRadioItem>
                            ))
                        )}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            {fwall ? (
              <Card className="flex items-center space-x-4 px-4 py-2">
                <Label htmlFor="airplane-mode">Post anonymously</Label>
                <Switch
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                  id="airplane-mode"
                />
              </Card>
            ) : null}
          </div>
          {fwall ? null : (
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Label className='absolute -bottom-3 left-3 text-slate-200/40 text-xs'>
                        (optional)
                      </Label>
                      <Input
                        className='border-none text-lg placeholder:font-medium focus-visible:ring-transparent'
                        placeholder="Title"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={fwall ? "Write your thoughts here..." : "Write your post here..."}
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
          {selectedImage && (
            <div>
              <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
                className="border w-[200px] h-[200px]"
              />
              <br />
              <button onClick={() => setSelectedImage(undefined)}>Remove</button>
            </div>
          )}

          <input
            type="file"
            name="image"
            onChange={uploadImage} />
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

const PostInput: React.FC<PostInput> = ({ username, authorId, joined }) => {

  const pathname = usePathname()
  const fwall = pathname === '/freedom-wall'
  const [open, setOpen] = useState(false)

  return (
    <div className='flex-1 flex items-center gap-3'>
      <ProfileHover
        username={username}
        date={joined}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='w-full'>
          <Input
            placeholder={fwall ? 'Write your thoughts here...' : 'Write your post here...'}
            className='focus-visible:ring-0 border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-black bg-transparent transition'
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]" >
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>
          <Separator />
          <TextArea
            username={username}
            authorId={authorId}
            fwall={fwall}
            updateOpenState={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostInput;