'use client'

import { Posts } from '@/types/posts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { FC, useEffect } from 'react'
import NoPostMessage from '../NoPostMessage';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import PendingPostCard from './pending-post-card';
import { useMutationSuccess } from '../Context/mutateContext';
import FetchDataError from '../FetchDataError';
import PendingPostLoading from '../Loading/PendingPostLoading';

interface PendingPostProps {
  published: boolean | null
}

const PendingPost: FC<PendingPostProps> = ({ published }) => {

  const { isMutate, setIsMutate } = useMutationSuccess()

  const { data: dataPosts, status, refetch } = useQuery<Posts[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get('/api/posts');
      return response.data
    },
  });

  const handleRefetch = () => {
    refetch();
    setIsMutate(false);
  };

  useEffect(() => {
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate, refetch, setIsMutate]);

  const filteredPostsEvent = dataPosts?.filter(
    post => post.published === published && post.Tag.name === 'event'
  );

  const filteredPostsAnnouncement = dataPosts?.filter(
    post => post.published === published && post.Tag.name === 'announcement'
  );

  return (
    <div>
      <Tabs defaultValue="department" className="w-full h-auto relative">
        <TabsList className='absolute right-0 bg-transparent'>
          <TabsTrigger value="department" className='w-[150px] text-xs data-[state=active]:bg-stone-900'>Events</TabsTrigger>
          <TabsTrigger value="about" className='w-[150px] text-xs data-[state=active]:bg-stone-900'>Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="department" className='h-auto mb-3'>
          <h1 className='text-3xl font-semibold'>Pending post</h1>
          <div className='mt-5 w-full h-auto'>
            {filteredPostsEvent?.length === 0 ? (
              <NoPostMessage />
            ) : (
              <>
                {status === 'pending' && <PendingPostLoading />}
                {status === 'error' && <FetchDataError />}
                {status !== 'pending' && status !== 'error' && (
                  <div className='flex flex-col justify-center gap-3 my-3'>
                    {filteredPostsEvent?.map((post) => (
                      <PendingPostCard
                        key={post.id}
                        post={post}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="about" className='h-auto mb-3'>
          <h1 className='text-3xl font-semibold'>Pending post</h1>
          <div className='mt-5 w-full h-auto'>
            {filteredPostsAnnouncement?.length === 0 ? (
              <NoPostMessage />
            ) : (
              <>
                {status === 'pending' && <PendingPostLoading />}
                {status === 'error' && <FetchDataError />}
                {status !== 'pending' && status !== 'error' && (
                  <div className='flex flex-col justify-center gap-3 my-3'>
                    {filteredPostsAnnouncement?.map((post) => (
                      <PendingPostCard
                        key={post.id}
                        post={post}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs >
    </div>
  )
}

export default PendingPost