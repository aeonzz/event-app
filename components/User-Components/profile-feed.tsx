
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Upcoming from './upcoming'
import { Post, User } from '@prisma/client';
import { Posts } from '@/types/posts';
import { CircleOff } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import EventHistory from './event-history';
import AdminPostFeed from '../Admin-components/admin-post-feed';
import { Session } from 'next-auth';
import Fwall from '../Post-components/Fwall';

interface ProfileFeedProps {
  eventCount: number | undefined;
  session: Session | null
  profileId: number 
  post: {
    userId: number;
    postId: number;
    going: boolean;
    user: {
      id: number;
      email: string;
      imageUrl: string | null;
      name: string | null;
      username: string;
      department: string | null;
      bio: string | null;
      status: string;
      isActive: boolean;
      deleted: boolean;
      password: string;
      role: string;
      createdAt: Date;
      updateAt: Date;
    };
    post: {
      id: number;
      title: string | null;
      anonymous: boolean;
      createdAt: Date;
      updatedAt: Date;
      content: string | null;
      venue: string | null;
      location: string | null;
      dateFrom: Date | null;
      dateTo: Date | null;
      timeFrom: string | null;
      timeTo: string | null;
      published: boolean;
      status: string;
      deleted: boolean;
      authorId: number;
      tagTagId: number;
      clicks: number;
    };
  }[];
}


const ProfileFeed: React.FC<ProfileFeedProps> = ({ eventCount, post, session, profileId }) => {

  const tag = 'fw'
  const published = true

  return (
    <div>
      <Tabs defaultValue="fw" className="w-full h-auto relative">
        <TabsList className='absolute right-0 -top-11 bg-transparent'>
          <TabsTrigger value="fw" className='w-[100px] text-xs data-[state=active]:bg-stone-900'>Freedom wall</TabsTrigger>
          <TabsTrigger value="feed" className='w-[100px] text-xs data-[state=active]:bg-stone-900'>Feed</TabsTrigger>
          <TabsTrigger value="insights" className='w-[100px] text-xs data-[state=active]:bg-stone-900'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="fw" className='!mt-0 h-auto mb-3'>
          <div className='w-full'>
            <Fwall
              tag={tag}
              published={published}
              session={session}
              profileId={profileId}
              profile={true}
            />
          </div>
        </TabsContent>
        <TabsContent value="feed" className='!mt-0 h-auto mb-3'>
          <div className='w-full'>
            <AdminPostFeed
              sessionId={session?.user.id}
            />
          </div>
        </TabsContent>
        <TabsContent value="insights" className='!mt-0 h-auto mb-3'>
          <div className='w-full h-auto grid grid-cols-2 grid-rows-2 gap-3'>
            <Card className='bg-[#161312]'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Event Attendance Summary
                </CardTitle>
                <CardDescription>
                  Total number of events attended.
                </CardDescription>
              </CardHeader>
              <CardContent className='!p-0'>
                <h2 className='text-center text-7xl font-bold'>{eventCount}</h2>
              </CardContent>
              <CardFooter className='justify-center'>
                <p className='text-sm'>events</p>
              </CardFooter>
            </Card>
            <Card className='bg-[#161312] row-span-2'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Event History
                </CardTitle>
                <CardDescription>
                  Past Event Log
                </CardDescription>
              </CardHeader><CardContent className='relative h-[330px]'>
                <ScrollArea className='h-full'>
                  {post.length > 0 ? (
                    post.map((item) => (
                      item.going && item.post.status === 'completed' || item.post.status === 'cancelled' ? (
                        <EventHistory
                          key={item.userId}
                          postStatus={item.post.status}
                          postTitle={item.post.title}
                          postDateFrom={item.post.dateFrom}
                          postDateTo={item.post.dateTo}
                          postTimeFrom={item.post.timeFrom}
                          postTimetTo={item.post.timeTo}
                        />
                      ) : null
                    ))
                  ) : (
                    <div className='absolute top-[50%] w-[250px] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center flex-col items-center text-muted-foreground'>
                      <CircleOff className='h-6 w-6 mb-1' />
                      <p className='text-center text-sm'>You have no event history</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className='bg-[#161312]'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Upcoming Event
                </CardTitle>
                <CardDescription>
                  My listed events
                </CardDescription>
              </CardHeader>
              <CardContent className='relative h-[100px]'>
                <ScrollArea className='h-full'>
                  {post.length > 0 ? (
                    post.map((item) => (
                      item.going && (
                        <Upcoming
                          key={item.userId}
                          postStatus={item.post.status}
                          postTitle={item.post.title}
                          postDateFrom={item.post.dateFrom}
                          postDateTo={item.post.dateTo}
                          postTimeFrom={item.post.timeFrom}
                          postTimetTo={item.post.timeTo}
                          postLink={item.post.id}
                        />
                      )
                    ))
                  ) : (
                    <div className='absolute top-[50%] w-[250px] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center flex-col items-center text-muted-foreground'>
                      <CircleOff className='h-6 w-6 mb-1' />
                      <p className='text-center text-sm font-semibold'>You have no upcoming events</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileFeed