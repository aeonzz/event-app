import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <>
      <Skeleton className='h-10 w-[200px] mb-2' />
      <Skeleton className='h-5 w-[250px]' />
      <div className='mt-8 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-8 w-[300px]' />
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
        </div>
        <Skeleton className='h-8 w-[150px]' />
      </div>
      <div className='w-full flex justify-center mt-32'>
        <Loader2 className='h-10 w-10 animate-spin stroke-1' />
      </div>
    </>
  )
}

export default loading