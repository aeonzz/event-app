'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer'
import axios from 'axios';
import React, { FC, useEffect } from 'react'
import PostCard from './PostCard';
import { Posts } from '@/types/posts';
import NoPostMessage from '../NoPostMessage';
import HomeLoading from '../Loading/PostsLoading';
import FetchDataError from '../FetchDataError';
import LoadingSpinner from '../Loading/Spinner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

interface PostsProps {
  tag?: string | null
  fw?: boolean | null
  published?: boolean | null
  session?: Session | null
}

const Posts: FC<PostsProps> = ({ tag, published, fw, session }) => {

  // const { data: dataPosts, isLoading, isError } = useQuery<Posts[]>({
  //   queryKey: ['posts'],
  //   queryFn: async () => {
  //     const response = await axios.get('/api/posts');
  //     return response.data
  //   },
  // });

  // const fetchPosts = async () => {
  //   const res = await axios.get('/api/posts')
  //   return res.data
  // }
  // console.log(fetchPosts())

  const { ref, inView } = useInView();

  const fetchPosts = async ({ pageParam = 0 }) => {
    const res = await axios.get(`/api/posts?cursor=${pageParam}`);
    return res.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    refetchOnWindowFocus: 'always',
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })


  const handleRefetch = () => {
    refetch();
  };
  
  const content = data?.pages.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.length === 0 ? (
        <NoPostMessage />
      ) : (
        <>
          {group.data.map((post: Posts) => (
            post.published === published && (
              <PostCard
                fw={fw}
                tag={tag}
                key={post.id}
                post={post}
                session={session}
                onMutationSuccess={handleRefetch}
              />
            )
          ))}
        </>
      )}
    </React.Fragment>
  ));

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <>
      {status === 'pending' ? (
        <HomeLoading />
      ) : status === "error" ? (
        <FetchDataError />
      ) : (
        content
      )}
      <div className='h-24 mt-10 flex justify-center'>
        {isFetchingNextPage ? <HomeLoading /> : null}
      </div>
      <div ref={ref}></div>
    </>
  )
}

export default Posts