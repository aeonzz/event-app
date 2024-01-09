'use client'

import { Posts } from '@/types/posts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import NoPostMessage from '../NoPostMessage';
import PostGridLoading from '../Loading/PostGridLoading';
import FetchDataError from '../FetchDataError';
import PostGridCard from '../Post-components/post-grid-card';

const AdminPostFeed = ({ profileId }: { profileId: number }) => {

  const { data: dataPosts, status, refetch } = useQuery<Posts[]>({
    queryKey: ['allUserPosts', profileId],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/${profileId}`);
      return response.data
    },
  });

  const allPostsDeleted = dataPosts?.every(post => post.deleted)

  return (
    <div>
      {dataPosts?.length === 0 || allPostsDeleted ? (
        <NoPostMessage />
      ) : (
        <>
          {status === 'pending' && <PostGridLoading />}
          {status === 'error' && <FetchDataError />}
          {status !== 'pending' && status !== 'error' && (
            <div className='grid grid-cols-2 gap-3 mb-3'>
              {dataPosts
                .filter((post) => post.Tag.name !== 'fw')
                .map((post) => (
                  <PostGridCard
                    key={post.id}
                    post={post}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminPostFeed