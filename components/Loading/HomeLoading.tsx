import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { Card } from '../ui/card'

const HomeLoading = () => {
  return (
    <div className='w-[50%] mt-4 px-1 flex flex-col gap-4'>
      <Skeleton className='w-full h-14' />
      <Card className=' w-full h-[400px] py-3 px-5'>
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
      </Card>
    </div>
  )
}

export default HomeLoading