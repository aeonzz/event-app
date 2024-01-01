import { ProfileForm } from '@/components/Forms/ProfileForm';
import ProfileHeader from '@/components/User-Components/ProfileHeader';
import { Card } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { Suspense } from 'react';

const User = async () => {

  const session = await getServerSession(authOptions);


  let initialLetter = '';
  if (session && session.user.username) {
    initialLetter = session.user.username.charAt(0).toUpperCase();
  }

  return (
    <div className='w-[79.1%] mt-4 min-h-[400px] flex flex-col'>
      <ProfileHeader
        letter={initialLetter}
        session={session}
      />
      <div className='mt-24 p-8 w-full h-auto flex border'>
        <Card className='h-[300px] w-[350px] sticky top-24'>

        </Card>
        <Card className='h-[1000px] flex-1'>

        </Card>
        {/* <ProfileForm /> */}
      </div>
    </div>
  )
}

export default User;