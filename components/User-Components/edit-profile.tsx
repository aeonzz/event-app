'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'
import { SingleImageDropzone } from '../ui/single-image-dropzone'
import { useEdgeStore } from '@/lib/edgestore'
import { UpdateUser } from '@/types/update-user'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { User } from '@prisma/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'


const EditProfile = ({ user, letter }: { user: User, letter: string }) => {

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const { edgestore } = useEdgeStore();
  const router = useRouter()
  const profile = user.imageUrl ? user.imageUrl : undefined

  const { mutate: addImage } = useMutation({
    mutationFn: (addImage: UpdateUser) => {
      return axios.patch(`/api/users/${user.id}`, addImage)
    },
    onError: () => {
      setIsLoading(false)
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not edit profile picture, Try again later.",
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsEditing(false)
      setIsLoading(false)
      toast.success("Update Successful", {
        description: "Profile picture successfully updated.",
      })
    }
  })

  useEffect(() => {
    if (progress === 100) {
      setProgress(0)
    }
  }, [progress])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='w-full mt-3'
        >
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile picture</DialogTitle>
        </DialogHeader>
        <div className='relative w-full flex flex-col items-center gap-5'>
          <Avatar className={cn(
            isEditing ? 'hidden' : 'block mt-1.5',
            'h-40 w-40'
          )}>
            <AvatarImage
              src={profile}
              alt={user.username}
              className='object-cover object-center'
            />
            <AvatarFallback>{letter}</AvatarFallback>
          </Avatar>
          <SingleImageDropzone
            width={160}
            height={150}
            value={file}
            onChange={(file) => {
              setFile(file);
            }}
            className={cn(
              isEditing ? 'flex' : 'hidden',
              'items-center'
            )}
          />
          {progress > 0 && (
            <div className='h-2 w-44 border rounded overflow-hidden transition-all duration-1000'>
              <div
                className='h-full bg-white'
                style={{
                  width: `${progress}%`
                }}
              />
            </div>
          )}
          <div className='w-full space-y-2'>
            <Button
              size='sm'
              disabled={isLoading || file === undefined}
              className={cn(
                isEditing ? 'flex' : 'hidden',
                'w-full'
              )}
              onClick={async () => {

                setIsLoading(true)

                if (file) {
                  const res = await edgestore.publicImages.upload({
                    file,
                    onProgressChange: (progress) => {
                      setProgress(progress);
                    },
                  });

                  const userData: UpdateUser = {
                    bio: user.bio,
                    username: user.username,
                    status: user.status,
                    imageUrl: res.url,
                    yearLevel: user.yearLevel,
                    section: user.section,
                    deleted: user.deleted,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive
                  }
                  addImage(userData)
                }
              }}
            >
              {isLoading && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Update
            </Button>
            <Button
              variant='secondary'
              size='sm'
              className='w-full'
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? <p>Cancel</p> : <p>Edit</p>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default EditProfile