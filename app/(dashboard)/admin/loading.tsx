import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <>
      <div className='relative'>
        <Skeleton className='h-44 w-full' />
        <Skeleton className='absolute -bottom-20 left-5 h-32 w-32 rounded-full' />
      </div>
      <div className='w-full mt-20 p-8'>
        <div className='mb-10'>
          <Skeleton className='h-5 w-20 mb-3' />
          <Skeleton className='h-12 w-full' />
        </div>
        <div className='mb-10'>
          <Skeleton className='h-5 w-20 mb-3' />
          <Skeleton className='h-12 w-full' />
        </div>
        <div className='mb-10'>
          <Skeleton className='h-5 w-20 mb-3' />
          <Skeleton className='h-12 w-full' />
        </div>
      </div>
    </>
  )
}

export default loading