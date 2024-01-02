import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '../ui/card';
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import { Skeleton } from '../ui/skeleton';
import { FC } from 'react';
import { Session } from 'next-auth';
import { User } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogContent2,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface ProfileHeaderProps {
  letter: string;
  user: User
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, letter }) => {

  const profile = user.imageUrl ? user.imageUrl : undefined

  return (
    <>
      <Card className='relative h-44 w-full'>
        <Image
          fill
          className='object-cover rounded-sm object-center'
          src={gg}
          alt='profile-picture'
        />
        <div className='absolute -bottom-20 left-5 h-32 w-auto flex items-end gap-5'>
          {profile ? (
            <Dialog>
              <DialogTrigger>
                <Avatar className='h-32 w-32 border-4 border-background group '>
                  <div className='h-full w-full bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition' />
                  <AvatarImage src={profile} className='object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-in-out' alt={user.username} />
                  <AvatarFallback>{letter}</AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent2 className='border overflow-hidden'>
                <Image
                  className='object-contain object-center'
                  src={profile}
                  alt='post image'
                  width={1000}
                  height={1000}
                  quality={100}
                />
              </DialogContent2>
            </Dialog>
          ) : (
            <Avatar className='h-32 w-32 border-4 border-background '>
              <AvatarImage src={profile} className='object-cover' />
              <AvatarFallback>{letter}</AvatarFallback>
            </Avatar>
          )}
          <div className='mb-5'>
            <h2 className='text-4xl font-semibold'>{user.username}</h2>
            <h4 className='text-muted-foreground text-sm'>{user.department}</h4>
            <h4 className='text-muted-foreground text-xs'>{user.email}</h4>
          </div>
        </div>
      </Card>
    </>
  )
}

export default ProfileHeader;