import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import React from 'react'

const UsersTableLoading = () => {
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
    </>
  )
}

export default UsersTableLoading