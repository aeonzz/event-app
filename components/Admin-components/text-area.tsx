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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import React, { ChangeEvent, FC, useEffect, useState } from 'react'
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
  ChevronLeft,
  Frown,
  ImagePlus,
  Loader2,
  Plus,
  Smile,
  X
} from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import {
  MultiFileDropzone,
  type FileState,
} from '@/components/ui/multi-image-dropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import Image from 'next/image';
import { DatePickerWithRange } from "../ui/date-range-picker"
import { Posts } from "@/types/posts"
import { useMutationSuccess } from "../Context/mutateContext"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface TextAreaProps {
  tag: string
  username?: string
  authorId: number | undefined | null
  fwall: boolean | null
  toggleImageInput: boolean
  imageUrl: string | undefined
  editData?: Posts
  updateOpenState: (newOpenState: boolean) => void;
  onChangeOptionState: (newOptionState: boolean) => void;
  onChangeDropdownState?: (newDropdownState: boolean) => void;
  onMutationSuccess?: () => void
}

const PostSchema = z.object({
  title: z
    .string()
    .optional(),
  content: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    }),
  venue: z
    .string()
    .optional(),
  location: z
    .string()
    .optional(),
  image: z
    .string()
    .optional(),
  timeFrom: z
    .string(),
  timeTo: z
    .string(),
})

const TextArea: FC<TextAreaProps> = ({ username, authorId, updateOpenState, onChangeOptionState, fwall, tag, toggleImageInput, editData, onMutationSuccess, onChangeDropdownState, imageUrl }) => {

  const router = useRouter()
  const deleted = false
  const { edgestore } = useEdgeStore();
  const [category, setCategory] = useState(tag)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string>("1f60a")
  const [inputValue, setInputValue] = useState<string>("")
  const [anonymous, setAnonymous] = useState(false)
  const [accessibility, setAccessibility] = useState(false)
  const [published, setPublished] = useState(fwall)
  console.log(fwall)
  const [urls, setUrls] = useState<string[]>([])
  const [isEditingUrls, setIsEditingUrls] = useState<string[]>([])
  const [fileStates, setFileStates] = useState<FileState[]>([])
  const [imageInput, setImageInput] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (editData) {
      const from = editData.dateFrom ? new Date(editData.dateFrom) : undefined;
      const to = editData.dateTo ? new Date(editData.dateTo) : undefined;

      return { from, to };
    }

    return undefined;
  });

  // const formatFrom = date?.from ? format(date.from, "LLL dd, y") : undefined
  // const formatTo = date?.to ? format(date.to, "LLL dd, y") : undefined

  const [isEditing, setIsEditing] = useState(false)
  const [postId, setPostId] = useState(editData?.id)
  const { setIsMutate } = useMutationSuccess()
  let initialLetter = ''
  if (username) {
    initialLetter = username.charAt(0).toUpperCase();
  }

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
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not create post, Try again later.",
      })
    },
    onSuccess: async (data) => {
      const postId = data.data.id

      await Promise.all(
        urls.map(async (url) => {
          await axios.post('/api/files', {
            url,
            postId,
          });
        })
      );

      if (fwall) {
        setIsMutate(true)
        toast("Posted.")
      } else if (category === 'event') {
        toast("Event Created", {
          description: "Awaiting admin approval."
        })
      } else {
        toast("Announcement Created", {
          description: "Awaiting admin approval."
        })
      }
      updateOpenState(false);
    }
  })

  const { mutate: updatePost } = useMutation({
    mutationFn: (updatePost: FormInputPost) => {
      return axios.patch(`/api/posts/${editData?.id}`, updatePost)
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not update post, Try again later.",
      })
    },
    onSuccess: async () => {

      await Promise.all(
        urls.map(async (url) => {
          await axios.post('/api/files', {
            url,
            postId,
          });
        })
      );
      setIsMutate(true)
      onMutationSuccess && onMutationSuccess();
      router.refresh()
      toast.success("Update Successful", {
        description: "Post successfully updated.",
      })
      updateOpenState(false);

      if (onChangeDropdownState) {
        onChangeDropdownState(false)
      }
    }
  })

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: editData?.title || '',
      content: editData?.content || '',
      location: editData?.location || '',
      venue: editData?.venue || '',
      timeFrom: editData?.timeFrom || '',
      timeTo: editData?.timeTo || '',
    },
  })

  function onSubmit(data: z.infer<typeof PostSchema>) {
    const postData: FormInputPost = {
      ...data,
      authorId,
      category,
      published,
      accessibility: accessibility ? 'department' : 'public',
      anonymous,
      dateFrom: date?.from,
      dateTo: date?.to,
      deleted,
      clicks: editData?.clicks,
      status: 'upcoming',
      going: undefined
    };
    if (editData) {
      setIsLoading(true);
      updatePost(postData);
    } else {
      setIsLoading(true);
      createpost(postData);
    }
    // console.log(JSON.stringify(postData))
  }

  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  useEffect(() => {
    if (editData?.images && editData.images.length > 0) {
      const imageUrls = editData.images.map(image => image.url);
      setIsEditingUrls(imageUrls);
    }

    if (editData) {
      setIsEditing(true)
      setPublished(true)
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.accessibility === 'department') {
      setAccessibility(true)
    } else {
      setAccessibility(false)
    }
  }, [editData])

  function toggleOptions(e: any) {
    e.preventDefault()
    setImageInput((prev) => !prev)
    onChangeOptionState(!toggleImageInput);
  }

  function dateRange(newDate: DateRange | undefined) {
    if (date?.to !== undefined && newDate?.to === undefined) {
      // @ts-ignore
      newDate = { ...newDate, to: null };
    }
    setDate(newDate)
  }


  function handleClearUrls(indexToRemove: number) {
    setUrls((prevUrls) => prevUrls.filter((_, index) => index !== indexToRemove));
  };

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 grid-cols-2">
          <div className={cn(
            toggleImageInput ? 'col-span-1' : 'col-span-2',
            'w-full space-y-3'
          )}>
            <>
              <div className='flex gap-2 justify-between items-center'>
                <div className='flex'>
                  {anonymous ? (
                    <Avatar className='h-9 w-9 dark:border relative group'>
                      <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                      <AvatarImage src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/EJFa13qXUAEzWpm.png'
                        className='object-cover'
                      />
                      <AvatarFallback className='h-9 w-9 bg-stone-900'>
                        {initialLetter}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className='h-9 w-9 dark:border relative group'>
                      <Link
                        href='/user/profile'
                        className='relative'
                      >
                        <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                        <AvatarImage src={imageUrl}
                          className='object-cover'
                        />
                        <AvatarFallback className='h-9 w-9 bg-stone-900 pb-1 pr-1'>
                          {initialLetter}
                        </AvatarFallback>
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
                            disabled={isEditing}
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
                {fwall && (
                  <Card className="flex items-center space-x-4 px-4 py-2">
                    <Label htmlFor="airplane-mode">Post anonymously</Label>
                    <Switch
                      checked={anonymous}
                      onCheckedChange={setAnonymous}
                      id="airplane-mode"
                      disabled={isLoading}
                    />
                  </Card>
                )}
                {category === 'event' && (
                  <div className="flex items-center space-x-4 px-4 py-2">
                    <Label className="text-xs">{accessibility ? 'Dept. only' : 'Public'}</Label>
                    <Switch
                      checked={accessibility}
                      onCheckedChange={setAccessibility}
                      disabled={isLoading}
                    />
                  </div>
                )}
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
                            disabled={isLoading}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={fwall ? "Write your thoughts here..." : "Write your description here..."}
                        className="h-[150px] resize-none border-none border-white placeholder:font-medium"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {fwall || category === 'announcement' ? null : (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <p className='text-xs text-muted-foreground'>Add more details</p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  className='mt-1 border-none text-sm focus-visible:ring-transparent'
                                  placeholder="Location"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  className='mt-1 border-none text-sm focus-visible:ring-transparent'
                                  placeholder="Venue"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </>
            <div>
              {/* <div className='flex w-full justify-end mb-2'>
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
              </div> */}
              <div className='w-full flex items-center gap-3 mt-5'>
                {fwall || category === 'announcement' ? null : (
                  <>
                    <div className='flex-1'>
                      <Label className='text-xs'>Date:</Label>
                      <DatePickerWithRange
                        onDateChange={dateRange}
                        dataDate={date}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="timeFrom"
                      render={({ field }) => (
                        <FormItem className='relative'>
                          <FormControl>
                            <div className='relative'>
                              <Label className='text-xs'>From:</Label>
                              <Input
                                type="time"
                                className='h-9 text-xs focus-visible:ring-transparent appearance-none'
                                placeholder="Venue"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className='absolute -bottom-4' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeTo"
                      render={({ field }) => (
                        <FormItem className='relative'>
                          <FormControl>
                            <div className='relative'>
                              <Label className='text-xs'>To:</Label>
                              <Input
                                type="time"
                                className='h-9 text-xs focus-visible:ring-transparent appearance-none'
                                placeholder="Venue"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className='absolute -bottom-4' />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className="pt-1">
                  <h3 className='text-xs font-medium mb-1'>Add:</h3>
                  {fwall ? null : (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={(e) => toggleOptions(e)}
                      className='flex items-center gap-2 text-xs'
                      disabled={isLoading}
                    >
                      <ImagePlus className='h-4 w-4' />
                      {category !== 'event' && <p>Image</p>}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className='w-full transition-none'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  <p>Processing...</p>
                </>
              ) : (
                <>
                  {editData ? <p>Confirm</p> : <p>Post</p>}
                </>
              )}
            </Button>
          </div>
          <div
            className={cn(
              toggleImageInput ? 'block' : 'hidden',
              'col-span-1'
            )}>
            {imageInput ? (
              <div className='w-full flex flex-col h-full justify-center items-center'>
                <MultiFileDropzone
                  value={fileStates}
                  onChange={(files) => {
                    setFileStates(files);
                  }}
                  disabled={isLoading}
                  onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                    await Promise.all(
                      addedFiles.map(async (addedFileState) => {
                        try {
                          const res = await edgestore.publicImages.upload({
                            file: addedFileState.file,
                            onProgressChange: async (progress) => {
                              updateFileProgress(addedFileState.key, progress);
                              if (progress === 100) {
                                // wait 1 second to set it to complete
                                // so that the user can see the progress bar at 100%
                                await new Promise((resolve) => setTimeout(resolve, 1000));
                                updateFileProgress(addedFileState.key, 'COMPLETE');
                              }
                            },
                          });
                          setUrls((prevUrls) => [...prevUrls, res.url]);
                        } catch (err) {
                          updateFileProgress(addedFileState.key, 'ERROR');
                        }
                      }),
                    );
                  }}
                />
                {isEditing ? (
                  <>
                    {isEditingUrls.length !== 0 ? (
                      <ScrollArea className='relative w-full h-[328px] mt-1'>
                        {isEditingUrls.map((url, index) => (
                          <Link
                            key={index}
                            href={url}
                            target="_blank"
                            className="relative"
                          >
                            <div className="absolute w-full h-full hover:bg-black/30 group" />
                            <Image
                              key={index}
                              alt={url}
                              src={url}
                              objectFit="cover"
                              width={400}
                              height={300}
                              className='mb-2 rounded-md w-full'
                            />
                          </Link>
                        ))}
                        {urls.map((url, index) => (
                          <Link
                            key={index}
                            href={url}
                            target="_blank"
                            className="relative"
                          >
                            <div className="absolute w-full h-full hover:bg-black/30 group" >
                              <Button
                                variant='link'
                                size='icon'
                                className='opacity-0 group-hover:opacity-100 text-slate-100'
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClearUrls(index);
                                }}
                              >
                                <X />
                              </Button>
                            </div>
                            <Image
                              key={index}
                              alt={url}
                              src={url}
                              objectFit="cover"
                              width={400}
                              height={300}
                              className='mb-2 rounded-md w-full'
                            />
                          </Link>
                        ))}
                      </ScrollArea>
                    ) : (
                      <>
                        {urls.length !== 0 && (
                          <ScrollArea className='relative w-full h-[328px] mt-1'>
                            {urls.map((url, index) => (
                              <Link
                                key={index}
                                href={url}
                                target="_blank"
                                className="relative"
                              >
                                <div className="absolute w-full h-full hover:bg-black/30 group" >
                                  <Button
                                    variant='link'
                                    size='icon'
                                    className='opacity-0 group-hover:opacity-100 text-slate-100'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleClearUrls(index);
                                    }}
                                  >
                                    <X />
                                  </Button>
                                </div>
                                <Image
                                  key={index}
                                  alt={url}
                                  src={url}
                                  objectFit="cover"
                                  width={400}
                                  height={300}
                                  className='mb-2 rounded-md w-full'
                                />
                              </Link>
                            ))}
                          </ScrollArea>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {urls.length !== 0 && (
                      <ScrollArea className='relative w-full h-[328px] mt-1'>
                        {urls.map((url, index) => (
                          <Link
                            key={index}
                            href={url}
                            target="_blank"
                            className="relative"
                          >
                            <div className="absolute w-full h-full hover:bg-black/30 group" >
                              <Button
                                variant='link'
                                size='icon'
                                className='opacity-0 group-hover:opacity-100 text-slate-100'
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClearUrls(index);
                                }}
                              >
                                <X />
                              </Button>
                            </div>
                            <Image
                              key={index}
                              alt={url}
                              src={url}
                              objectFit="cover"
                              width={400}
                              height={300}
                              className='mb-2 rounded-md w-full'
                            />
                          </Link>
                        ))}
                      </ScrollArea>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </form>
      </Form >
    </>
  )
}

export default TextArea