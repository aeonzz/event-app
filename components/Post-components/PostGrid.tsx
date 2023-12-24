'use client'

import { Posts } from '@/types/posts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from 'next-auth';
import React, { FC } from 'react'
import NoPostMessage from '../NoPostMessage';
import { Card, CardHeader } from '../ui/card';
import Image from 'next/image';
import ProfileHover from '../profileHover';
import PostGridCard from './post-grid-card';

interface PostsProps {
  tag?: string | null
  fw?: boolean | null
  published?: boolean | null
  session?: Session | null
}

const PostGrid: FC<PostsProps> = ({ tag, fw, published, session }) => {


  const { data: dataPosts } = useQuery<Posts[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get('/api/posts');
      return response.data
    },
  });

  return (
    <div>
      {dataPosts?.length === 0 ? (
        <NoPostMessage />
      ) : (
        <div className='grid grid-cols-2 gap-5 mt-3'>
          {dataPosts?.map((post) => (
            post.published === published && post.Tag.name === tag && (
              <PostGridCard 
                post={post}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default PostGrid