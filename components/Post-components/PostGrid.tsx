'use client'

import { Posts } from '@/types/posts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from 'next-auth';
import React, { FC, useEffect } from 'react'
import NoPostMessage from '../NoPostMessage';
import { Card, CardHeader } from '../ui/card';
import Image from 'next/image';
import ProfileHover from '../profileHover';
import PostGridCard from './post-grid-card';
import PostGridLoading from '../Loading/PostGridLoading';
import FetchDataError from '../FetchDataError';
import { useMutationSuccess } from '../Context/mutateContext';

interface PostsProps {
  tag?: string | null
  fw?: boolean | null
  published?: boolean | null
  session: Session | null
}

const PostGrid: FC<PostsProps> = ({ tag, fw, published, session }) => {

  const { isMutate, setIsMutate } = useMutationSuccess()

  const { data: dataPosts, status , refetch } = useQuery<Posts[]>({
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

  const filteredPosts = dataPosts?.filter(
    post => post.published === published && post.Tag.name === tag
  );

  const allPostsDeleted = filteredPosts?.every(post => post.deleted)

  return (
    <div>
      {filteredPosts?.length === 0 || allPostsDeleted ? (
        <NoPostMessage />
      ) : (
        <>
          {status === 'pending' && <PostGridLoading />}
          {status === 'error' && <FetchDataError />}
          {status !== 'pending' && status !== 'error' && (
            <div className='grid grid-cols-2 gap-3 my-3'>
              {filteredPosts?.map((post) => (
                <PostGridCard
                  key={post.id}
                  post={post}
                  session={session}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>

  )
}

export default PostGrid