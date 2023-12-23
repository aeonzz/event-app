import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ViewPostLoading = () => {
  return (
    <div className='w-full h-[85vh] flex justify-between mt-5'>
      <div className='w-[350px] h-full px-5 ml-10'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9 rounded-full' />
          <div className='flex flex-col'>
            <Skeleton className='w-20 h-3' />
            <Skeleton className='w-10 h-3 mt-1' />
          </div>
        </div>
        <div className='mt-14 flex flex-col gap-2'>
          <Skeleton className='w-full h-5' />
          <Skeleton className='w-[70%] h-5' />
          <Skeleton className='w-[50%] h-5' />
        </div>
      </div>
      <Separator orientation='vertical' />
      <div className='flex-1 mr-3'>

      </div>
    </div>
  )
}

export default ViewPostLoading