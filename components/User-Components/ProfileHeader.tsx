import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '../ui/card';
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import { Skeleton } from '../ui/skeleton';
import { FC } from 'react';
import { Session } from 'next-auth';
import { User } from '@prisma/client';
import ActiveStatus from '../active-status';

interface ProfileHeaderProps {
  letter: string;
  user: User
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
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
          <Avatar className='h-32 w-32 border-4 border-background'>
            <AvatarImage src='https://christian-aeonzz.vercel.app/_next/image?url=%2Fpfp.jpg&w=640&q=75' className='object-cover' />
            <AvatarFallback>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
          <ActiveStatus isActive={user.isActive} className='bottom-2.5 left-[30%]' />
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