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
import {
  MultiFileDropzone,
  type FileState,
} from '@/components/ui/multi-image-dropdown';
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import Image from 'next/image';
import { DatePickerWithRange } from "../ui/date-range-picker"
import TextArea from "./text-area"

interface PostInput {
  tag: string
  initalletter: string
  username?: string
  authorId: string
  joined: string
}

const PostInput: React.FC<PostInput> = ({ username, authorId, joined, tag }) => {

  const pathname = usePathname()
  const fwall = pathname === '/freedom-wall'
  const [open, setOpen] = useState(false)
  const [toggleImageInput, setToggleImageInput] = useState(false)

  const onChangeOptionState = (newChangeOptionState: boolean) => {
    setToggleImageInput(newChangeOptionState)
  }

  useEffect(() => {
    if (!open) {
      setToggleImageInput(false);
    }
  }, [open]);


  return (
    <Card className='flex-1 flex items-center py-3 px-5 gap-3 w-full bg-stone-900/50'>
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
        <DialogContent className={cn(
          toggleImageInput ? 'sm:max-w-[900px]' : 'sm:max-w-[540px]',
          'duration-300'
        )}>
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>
          <Separator />
          <TextArea
            tag={tag}
            username={username}
            authorId={authorId}
            fwall={fwall}
            updateOpenState={setOpen}
            onChangeOptionState={onChangeOptionState}
            toggleImageInput={toggleImageInput}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostInput;