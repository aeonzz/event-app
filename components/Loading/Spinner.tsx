import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className='w-full flex h-full justify-center'>
      <Loader2 className='h-10 w-10 animate-spin stroke-1' />
    </div>
  )
}

export default LoadingSpinner