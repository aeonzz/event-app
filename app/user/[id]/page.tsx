import FetchDataError from '@/components/FetchDataError'
import ProfileHeader from '@/components/User-Components/ProfileHeader'
import About from '@/components/User-Components/about'
import EditProfile from '@/components/User-Components/edit-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { cn } from '@/lib/utils'
import { AtSign, User, UserSquareIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import React, { FC } from 'react'

interface UserDetailsProps {
  params: {
    id: number
  }
}

async function getUser(id: number) {
  const response = await prisma.user.findFirst({
    where: {
      id: id,
    }
  })

  return response
}

const UserDetails: FC<UserDetailsProps> = async ({ params }) => {


  try {
    const userId = +params.id
    const user = await getUser(userId);
    const session = await getServerSession(authOptions);
    const isUser = user?.email === session?.user.email
    
    let initialLetter = '';
    if (user && user.username) {
      initialLetter = user.username.charAt(0).toUpperCase();
    }
    if (user && session) {
      return (
        <div className='w-[79.1%] mt-4 min-h-[400px] flex flex-col'>
          <ProfileHeader
            letter={initialLetter}
            user={user}
          />
          <div className='mt-24 p-8 w-full h-auto flex gap-3'>
            <Card className={cn(
              isUser ? 'h-[350px]' : 'h-[290px]',
              'w-[350px] sticky top-20'
            )}>
              <CardHeader>
                <CardTitle>
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <About
                  session={session}
                  user={user}
                />
                <div className='mt-2 space-y-2'>
                  <div className='flex items-center gap-3'>
                    <UserSquareIcon className='text-muted-foreground h-5 w-5' />
                    <p className='text-sm'>{user.department}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <AtSign className='text-muted-foreground h-5 w-5' />
                    <p className='text-sm'>{user.email}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <User className='text-muted-foreground h-5 w-5' />
                    <p className='text-sm'>{user.username}</p>
                  </div>
                </div>
                {isUser && (
                  <EditProfile
                    user={user}
                    letter={initialLetter}
                  />
                )}
              </CardContent>
            </Card>
            <Card className='h-[1000px] flex-1'>

            </Card>
            {/* <ProfileForm /> */}
          </div>
        </div>
      )
    } else {
      return <FetchDataError />;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return <FetchDataError />;
  }
}

export default UserDetails