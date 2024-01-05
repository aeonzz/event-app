import NotFound from '@/app/not-found';
import InsightsCard from '@/components/Admin-components/insights-card';
import FetchDataError from '@/components/FetchDataError';
import PostDetailsCard from '@/components/Post-components/post-details-card';
import PostStatus from '@/components/Post-components/post-status';
import ProfileHover from '@/components/profileHover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Posts } from '@/types/posts';
import { format, formatDistanceToNow } from 'date-fns';
import { Dot, Eye, UserPlus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react'
import { startOfDay, endOfDay } from 'date-fns';
import Image from 'next/image';
import ParticipantCard from '@/components/Admin-components/participant-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InsightsProps {
  params: {
    id: number
  }
}

async function getPost(id: number): Promise<Posts | null> {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const userIdInt = parseInt(userId, 10);

  const response = await prisma.post.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      location: true,
      venue: true,
      dateFrom: true,
      dateTo: true,
      accessibility: true,
      timeFrom: true,
      timeTo: true,
      status: true,
      deleted: true,
      clicks: true,
      anonymous: true,
      createdAt: true,
      author: true,
      images: true,
      UserPostInteraction: {
        where: {
          userId: userIdInt,
        },
        select: {
          going: true,
        },
      },
      Tag: true,
    },
  })

  return response as Posts | null;
}

async function getInteractions(id: number) {
  const userInteractions = await prisma.userPostInteraction.findMany({
    where: {
      postId: id,
      going: true,
    },
    select: {
      userId: true,
      going: true,
      user: {
        select: {
          id: true,
          email: true,
          imageUrl: true,
          username: true,
          department: true,
          createdAt: true,
          updateAt: true
        },
      },
    }
  });
  return userInteractions
}


async function getInteractionsForDay(id: number, day: Date) {
  const interactions = await prisma.userPostInteraction.findMany({
    where: {
      postId: id,
      going: true,
      createdAt: {
        gte: startOfDay(day),
        lte: endOfDay(day),
      },
    },
  });
  return interactions;
}


const Insights: React.FC<InsightsProps> = async ({ params }) => {

  const session = await getServerSession(authOptions)

  try {
    const postID = +params.id;
    const post = await getPost(postID);
    const interactions = await getInteractions(postID)

    if (post) {

      const postedAt = new Date(post.createdAt)
      const totalParticipantsCount = interactions.length
      const interactionsForDay = await getInteractionsForDay(postID, new Date())
      const totalParticipantsCountForDay = interactionsForDay.length

      if (post.Tag.name === 'announcement') {
        return <NotFound className='w-[79.1%]' />
      }

      return (
        <div className='w-[79.1%] mt-4 min-h-[400px] flex flex-col '>
          <h1 className='text-3xl font-semibold tracking-tight'>Event insights</h1>
          <div className='h-auto mt-4 grid grid-cols-4 grid-rows-[repeat(4,_minmax(0,_150px))] gap-3'>
            <Card>
              <CardHeader>
                <CardTitle className='text-xl inline-flex justify-between items-center'>
                  Total participants
                  <UserPlus className='h-5 w-5 text-muted-foreground' />
                </CardTitle>
                <h3 className='font-semibold text-4xl tracking-tight leading-none'>{totalParticipantsCount}</h3>
                <CardDescription className='text-xs'>+{totalParticipantsCountForDay} Today</CardDescription>
              </CardHeader>
            </Card>
            <Card className='col-span-3 row-span-2 p-6'>
              <h3 className='leading-none font-semibold'>Participants</h3>
              <p className='text-muted-foreground text-xs mt-1'>The event have a total of {totalParticipantsCount} participants</p>
              <ScrollArea className='h-[210px] mt-1 space-y-2'>
                {interactions.map((user) => (
                  <ParticipantCard
                    key={user.userId}
                    user={user.user}
                  />
                ))}
              </ScrollArea>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-xl inline-flex justify-between items-center'>
                  Total views
                  <Eye className='h-5 w-5 text-muted-foreground' />
                </CardTitle>
                <h3 className='font-semibold text-4xl tracking-tight leading-none'>{post.clicks}</h3>
                <CardDescription className='text-xs'>+{post.clicks} Total</CardDescription>
              </CardHeader>
            </Card>
            <div className='col-span-4 overflow-hidden relative group rounded-md'>
              <div className='overflow-hidden'>
                {post.images && post.images.length > 0 ? (
                  <Image
                    src={post.images[0].url}
                    alt={`${post.Tag.name} image`}
                    fill={true}
                    objectFit="cover"
                    objectPosition='center'
                    className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out brightness-50'
                  />
                ) : (
                  <Image
                    src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/carbon_no-image.png'
                    alt={`${post.Tag.name} image`}
                    width={56}
                    height={56}
                    objectFit="cover"
                    objectPosition='center'
                    className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out'
                  />
                )}
              </div>
              <div className='absolute w-full h-full bg-gradient-to-t from-background to-transparent' />
              <div className='flex items-end gap-3 absolute bottom-2 left-2 w-full h-full'>
                <ProfileHover
                  username={post.author.username}
                  date={format(post.author.createdAt, 'PP')}
                  imageUrl={post.author.imageUrl}
                  userId={post.author.id}
                />
                <div className='flex flex-col'>
                  <Link
                    href={`/user/${post.author.id}`}
                    className='hover:underline font-semibold'
                  >
                    {post.author.username}
                  </Link>
                  <div className='flex items-center'>
                    <p className='text-xs font-light text-muted-foreground'>
                      {formatDistanceToNow(postedAt, { addSuffix: true })}
                    </p>
                    <Dot />
                    <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
                    <PostStatus post={post} className="ml-2 !flex-row" />
                  </div>
                </div>
              </div>
            </div>
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

export default Insights