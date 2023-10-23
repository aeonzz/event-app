import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <>
      <Skeleton className='h-12 w-[200px] mb-2' />
      <Skeleton className='h-5 w-[250px]' />
      <Skeleton className='h-9 w-[250px] mt-8' />
      <div className='w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-5'>
        <Skeleton className='h-[140px]' />
        <Skeleton className='h-[140px]' />
        <Skeleton className='h-[140px]' />
        <Skeleton className='h-[140px]' />
      </div>
    </>
  )
}

export default loading