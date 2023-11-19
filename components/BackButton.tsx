'use client'
import React, { FC } from 'react'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  style: string
}

const BackButton: FC<BackButtonProps> = ({ style }) => {
  const router = useRouter();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {router.back()}}
      className={style}
    >
      <ChevronLeft />
    </Button>
  )
}

export default BackButton