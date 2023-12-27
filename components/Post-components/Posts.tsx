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
import { useMutationSuccess } from '../Context/mutateContext';

interface PostsProps {
  tag?: string | null
  published?: boolean | null
  session?: Session | null
}

const Posts: FC<PostsProps> = ({ tag, published, session }) => {


  const { ref, inView } = useInView();
  const { isMutate, setIsMutate } = useMutationSuccess()

  const fetchPosts = async ({ pageParam = 0 }) => {
    const res = await axios.get(`/api/posts/fwall?cursor=${pageParam}`);
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
    setIsMutate(false);
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
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate, refetch, setIsMutate]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div>
      {status === 'pending' ? (
        <HomeLoading />
      ) : status === "error" ? (
        <FetchDataError />
      ) : (
        content
      )}
      <div className='h-24 mt-10 flex justify-center' ref={ref}>
        {isFetchingNextPage ? <LoadingSpinner /> : null}
      </div>
       {/* <div ref={ref}></div>  */}
    </div>
  )
}

export default Posts