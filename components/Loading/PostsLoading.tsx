import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { Card } from '../ui/card'

const PostsLoading = () => {
  return (
    <div className='w-full mt-4 px-1 flex flex-col gap-4'>
      <div className=' w-full h-[450px] py-3 px-5'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9 rounded-full' />
          <div className='flex flex-col'>
            <Skeleton className='w-20 h-3' />
            <Skeleton className='w-10 h-3 mt-1' />
          </div>
        </div>
        <div className='mt-[30px] flex gap-2 flex-col'>
          <Skeleton className='w-full h-5' />
          <Skeleton className='w-[70%] h-5' />
          <Skeleton className='w-[50%] h-5' />
        </div>
        <div className='flex w-full h-44 gap-2'>
          <Skeleton className='flex-1 mt-[20px]' />
          <Skeleton className='flex-1 mt-[20px]' />
        </div>
      </div>
    </div>
  )
}

export default PostsLoading