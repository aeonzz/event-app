'use client'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  Theme
} from 'emoji-picker-react';
import ProfileHover from "../profileHover"
import { FormInputPost } from "@/types/post"
import { usePathname, useRouter } from "next/navigation"
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from "@/lib/utils"
import TextArea from "./text-area"
import { PlusCircle } from "lucide-react"

interface PostInput {
  tag: string
  initalletter: string
  username?: string
  authorId: number | undefined | null
  joined: string
  imageUrl: string | undefined
}

const PostInput: React.FC<PostInput> = ({ username, authorId, joined, tag, imageUrl }) => {

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
    <div className='flex-1 flex items-center py-2 gap-3 w-full'>
      <ProfileHover
        username={username}
        date={joined}
        userId={authorId}
        imageUrl={imageUrl}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='w-full flex items-center gap-3'>
          <Input
            placeholder={fwall ? 'Write your thoughts here...' : tag === 'event' ? 'Create event...' : 'Post announcement...'}
            className='focus-visible:ring-0 border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-black bg-transparent transition'
          />
          <PlusCircle className='h-8 w-8' />
        </DialogTrigger>
        <DialogContent className={cn(
          toggleImageInput ? 'max-w-[1000px]' : 'max-w-[600px]',
          'duration-300'
        )}
        onInteractOutside={(e) => e.preventDefault()}
        >
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
            imageUrl={imageUrl}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostInput;