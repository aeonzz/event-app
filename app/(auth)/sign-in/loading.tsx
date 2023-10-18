import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const loading = () => {
  return (
    <div className='w-[93%] m-auto h-screen flex justify-between items-start container'>
      <Skeleton className='w-72 h-[80%] mt-5' />
      <div className='w-[49%] h-[80%] mt-5 flex flex-col items-center gap-3'>
        <Skeleton className='w-full h-[70%]' />
        <Skeleton className='w-full h-[30%]' />
      </div>
      <Skeleton className='w-72 h-[80%] mt-5' />
    </div>
  )
}

export default loading;