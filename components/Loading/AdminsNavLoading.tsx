import React from 'react'
import { Skeleton } from '../ui/skeleton'

const AdminsNavLoading = () => {
  return (
    <div className='flex flex-col gap-5 px-5 py-1'>
      <div className='flex gap-4'>
        <Skeleton className='w-9 h-9 rounded-full' />
        <div>
          <Skeleton className='w-36 h-3' />
          <Skeleton className='w-20 h-3 mt-1' />
        </div>
      </div>
      <div className='flex gap-4'>
        <Skeleton className='w-9 h-9 rounded-full' />
        <div>
          <Skeleton className='w-36 h-3' />
          <Skeleton className='w-20 h-3 mt-1' />
        </div>
      </div>
      <div className='flex gap-4'>
        <Skeleton className='w-9 h-9 rounded-full' />
        <div>
          <Skeleton className='w-36 h-3' />
          <Skeleton className='w-20 h-3 mt-1' />
        </div>
      </div>
    </div>
  )
}

export default AdminsNavLoading