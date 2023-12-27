'use client'

import Image from 'next/image'
import React from 'react'

const RecentImage = ({
  image
}: {
  image: string
}) => {
  return (
    <>
      <Image
        className='object-cover h-full object-center absolute group-hover:scale-[1.03] transition-transform duration-300 ease-in-out'
        src={image}
        width={1000}
        height={1000}
        alt='post image'
      />
    </>
  )
}

export default RecentImage