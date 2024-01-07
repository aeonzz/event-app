'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
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
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { UpdateUser } from '@/types/update-user'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { User } from '@prisma/client'
import { Session } from 'next-auth'

const FormSchema = z.object({
  bio: z
    .string()
    .max(100, {
      message: "maximum of 100 characters.",
    })
    .optional(),
})

const About = ({ user, session }: { user: User, session: Session }) => {

  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(user.bio || undefined)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: updateUser, data: userData } = useMutation({
    mutationFn: (updateUser: UpdateUser) => {
      return axios.patch(`/api/users/${user.id}`, updateUser)
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not edit bio, Try again later.",
      })
    },
    onSuccess: () => {
      setIsEditing(false)
      setIsLoading(false)
      router.refresh()
    }
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bio: bio || '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const userData: UpdateUser = {
      bio: data.bio || null,
      username: user.username,
      status: user.status,
      imageUrl: user.imageUrl,
      yearLevel: user.yearLevel,
      section: user.section,
      deleted: user.deleted,
      email: user.email,
      password: user.password,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    }
    setIsLoading(true)
    updateUser(userData)
  }


  return (
    <Form {...form}>
      <div className={cn(
        isEditing ? 'hidden' : 'flex',
        'flex-col h-28'
      )}>
        <p className='font-light italic text-center text-sm h-16 whitespace-pre-wrap break-words'>&quot;{user.bio}&quot;</p>
        {user.email === session.user.email && (
          <Button
            variant='ghost'
            size='sm'
            className='text-xs h-7 w-full'
            onClick={() => setIsEditing(true)}
          >
            {user.bio === '' ? <p>Add bio</p> : <p>Edit bio</p>}
          </Button>
        )}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        isEditing ? 'flex' : 'hidden',
        'flex-col gap-3 h-28'
      )}>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none text-center border-none font-light text-sm !pb-0 !pt-4 !min-h-[10px] italic bg-[#161312]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center gap-3'>
          <Button
            variant='secondary'
            size='sm'
            className='text-xs h-7 w-full'
            onClick={(e) => {
              e.preventDefault()
              setIsEditing(false)
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size='sm'
            className='text-xs h-7 w-full'
            type='submit'
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Confirm
          </Button>
        </div>
      </form>
    </Form >
  )
}

export default About