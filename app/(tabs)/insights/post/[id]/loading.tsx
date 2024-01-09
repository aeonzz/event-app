import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loadingss = () => {
  return (
    <div className='w-[79.1%] mt-4 min-h-[400px] flex flex-col '>
      <Skeleton className='w-full h-40' />
      <div className='h-auto mt-4 grid grid-cols-4 grid-rows-[repeat(3,_minmax(0,_150px))] gap-3'>
        <Skeleton />
        <Skeleton className='col-span-3 row-span-2' />
        <Skeleton />
      </div>
    </div>
  )
}

export default Loadingss