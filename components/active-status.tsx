import { cn } from '@/lib/utils'
import React from 'react'

export default function ActiveStatus({
  isActive,
  className
}: {
  isActive: boolean
  className: string
}) {
  return (
    <>
      {isActive && (
        <div className={cn(
          className,
          'h-3 w-3 rounded-full bg-green-500 absolute animate-pulse'
        )} />
      )}
    </>
  )
}
