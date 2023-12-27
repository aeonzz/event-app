import React from 'react'
import { Skeleton } from '../ui/skeleton'

const PostGridLoading = () => {
  return (
    <div className='w-full mt-3 flex gap-3'>
      <div className='flex-1 h-[400px] flex justify-center flex-col gap-3 p-5'>
        <Skeleton className='h-44' />
        <div className='flex-1 flex flex-col gap-1'>
          <Skeleton className='w-[30%] h-5' />
          <Skeleton className='w-full h-3 mt-1' />
          <Skeleton className='w-full h-3' />
          <Skeleton className='w-full h-3' />
          <div className='w-full mt-5 flex gap-1'>
            <Skeleton className='w-9 h-9 rounded-full' />
            <div className='flex flex-col justify-center gap-1'>
              <Skeleton className='w-24 h-4' />
              <Skeleton className='w-36 h-4' />
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1 h-[400px] flex justify-center flex-col gap-3 p-5'>
        <Skeleton className='h-44' />
        <div className='flex-1 flex flex-col gap-1'>
          <Skeleton className='w-[30%] h-5' />
          <Skeleton className='w-full h-3 mt-1' />
          <Skeleton className='w-full h-3' />
          <Skeleton className='w-full h-3' />
          <div className='w-full mt-5 flex gap-1'>
            <Skeleton className='w-9 h-9 rounded-full' />
            <div className='flex flex-col justify-center gap-1'>
              <Skeleton className='w-24 h-4' />
              <Skeleton className='w-36 h-4' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostGridLoading