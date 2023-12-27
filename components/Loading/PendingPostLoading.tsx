import React from 'react'
import { Skeleton } from '../ui/skeleton'

const PendingPostLoading = () => {
  return (
    <div className='w-full h-40 flex py-3 px-4'>
      <Skeleton className='h-full w-32' />
      <div className='flex-1 ml-3 flex flex-col'>
        <div className='flex gap-1'>
          <Skeleton className='h-9 w-9 rounded-full' />
          <div className='flex flex-col'>
            <Skeleton className='w-20 h-3' />
            <Skeleton className='w-40 h-3 mt-1' />
          </div>
        </div>
        <Skeleton className='h-3 w-20 mt-2' />
        <Skeleton className='h-3 w-[90%] mt-1' />
        <Skeleton className='h-3 w-[60%] mt-1' />
      </div>
    </div>
  )
}

export default PendingPostLoading