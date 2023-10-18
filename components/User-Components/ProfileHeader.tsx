import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '../ui/card';
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import { Skeleton } from '../ui/skeleton';

interface ProfileHeaderProps {
  letter: string;
  username?: string;
  email?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ letter, username, email }) => {
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
          <div className='mb-5'>
            <h2 className='text-4xl font-semibold'>{username}</h2>
            <h4 className='text-muted-foreground text-xs'>{email}</h4>
          </div>
        </div>
      </Card>
    </>
  )
}

export default ProfileHeader;