import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loadings = () => {
  return (
    <div className='w-[79.1%] mt-4 min-h-[400px]'>
      <Skeleton className='w-full h-44 relative'>
        <Skeleton className='h-32 w-32 absolute left-5 -bottom-16 rounded-full' />
      </Skeleton>
    </div>
  )
}

export default Loadings