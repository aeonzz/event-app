import PostsLoading from '@/components/Loading/PostsLoading'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ViewPostLoading = () => {
  return (
    <div className='w-[58%] px-10 mt-4 flex flex-col'>
      <PostsLoading />
    </div>
  )
}

export default ViewPostLoading